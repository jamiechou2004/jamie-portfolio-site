/* About — experience badges: tilt toward the pointer, flip on click, logos from assets/logos/. */
(() => {
  const cards = [...document.querySelectorAll('.xp-card')];
  if (!cards.length) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Logos ---------- */
  // Drop official logo files into assets/logos/ as <org>.svg or <org>.png (org = data-org on the card).
  // Until a file exists, the tile keeps its engraved initial.
  cards.forEach((card) => {
    const tile = card.querySelector('.xp-tile');
    const org = card.dataset.org;
    if (!tile || !org) return;
    const tryLoad = (exts) => {
      if (!exts.length) return;
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.onload = () => {
        tile.textContent = '';
        tile.append(img);
        tile.classList.add('has-logo');
        // Wordmarks (wide logos) get a wider window instead of shrinking to a sliver.
        if (img.naturalWidth / img.naturalHeight > 1.6) tile.classList.add('is-wide');
      };
      img.onerror = () => tryLoad(exts.slice(1));
      img.src = `assets/logos/${org}.${exts[0]}`;
    };
    tryLoad(['svg', 'png', 'webp']);
  });

  /* ---------- Sound: a metal card flipping ---------- */
  // Synthesized with Web Audio (no file): a short brushed "swish" plus inharmonic metallic partials.
  // Opening is brighter; closing is lower and softer.
  let audio;
  const clink = (open) => {
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const t = audio.currentTime + 0.01;
      const out = audio.createGain();
      out.gain.value = open ? 0.22 : 0.15;
      out.connect(audio.destination);

      const len = Math.floor(audio.sampleRate * 0.16);
      const buf = audio.createBuffer(1, len, audio.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const noise = audio.createBufferSource();
      noise.buffer = buf;
      const bp = audio.createBiquadFilter();
      bp.type = 'bandpass'; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(open ? 1800 : 4200, t);
      bp.frequency.exponentialRampToValueAtTime(open ? 5200 : 1500, t + 0.14);
      const ng = audio.createGain();
      ng.gain.setValueAtTime(0.0001, t);
      ng.gain.exponentialRampToValueAtTime(0.35, t + 0.03);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      noise.connect(bp).connect(ng).connect(out);
      noise.start(t); noise.stop(t + 0.17);

      const hit = t + (open ? 0.13 : 0.11);
      const base = open ? 1320 : 880;
      [1, 2.76, 5.4, 8.93].forEach((ratio, i) => {
        const osc = audio.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = base * ratio;
        const g = audio.createGain();
        const peak = [0.5, 0.28, 0.16, 0.08][i];
        const decay = (open ? 0.55 : 0.4) / (1 + i * 0.7);
        g.gain.setValueAtTime(0.0001, hit);
        g.gain.exponentialRampToValueAtTime(peak, hit + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, hit + decay);
        osc.connect(g).connect(out);
        osc.start(hit); osc.stop(hit + decay + 0.02);
      });
    } catch (_) { /* audio unavailable: stay silent */ }
  };

  /* ---------- Flip ---------- */
  const setFlipped = (card, flipped, silent = false) => {
    if (!silent && card.classList.contains('is-flipped') !== flipped) clink(flipped);
    card.classList.toggle('is-flipped', flipped);
    const front = card.querySelector('.xp-front');
    const back = card.querySelector('.xp-back');
    front.setAttribute('aria-expanded', String(flipped));
    front.tabIndex = flipped ? -1 : 0;
    back.toggleAttribute('inert', !flipped);
    back.setAttribute('aria-hidden', String(!flipped));
  };

  cards.forEach((card, i) => {
    setFlipped(card, false, true);
    const inner = card.querySelector('.xp-inner');

    card.querySelector('.xp-front').addEventListener('click', () => {
      cards.forEach((c) => { if (c !== card && c.classList.contains('is-flipped')) setFlipped(c, false, true); });
      setFlipped(card, true);
      setTimeout(() => card.querySelector('.xp-back a, .xp-close')?.focus({ preventScroll: true }), 360);
    });
    card.querySelector('.xp-close').addEventListener('click', () => {
      setFlipped(card, false);
      card.querySelector('.xp-front').focus({ preventScroll: true });
    });

    /* ---------- Tilt + light ---------- */
    if (finePointer && !reduceMotion) {
      card.addEventListener('pointermove', (e) => {
        const r = inner.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        const dir = card.classList.contains('is-flipped') ? -1 : 1;
        card.style.setProperty('--ry', `${((x - 0.5) * 16 * dir).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - y) * 12).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        ['--rx', '--ry', '--mx', '--my'].forEach((p) => card.style.removeProperty(p));
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = cards.find((c) => c.classList.contains('is-flipped'));
    if (!open) return;
    setFlipped(open, false);
    open.querySelector('.xp-front').focus({ preventScroll: true });
  });
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.xp-card')) return;
    cards.forEach((c) => { if (c.classList.contains('is-flipped')) setFlipped(c, false); });
  });
})();
