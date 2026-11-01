/* About — experience badges: tilt toward the pointer, flip on click, small synthesized sounds.
   Sounds are generated with Web Audio (no files), start only after the visitor's first click,
   and can be turned off with the Sound button (remembered per browser). */
(() => {
  const cards = [...document.querySelectorAll('.xp-card')];
  if (!cards.length) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Sound ---------- */
  const KEY = 'jamie-about-sound';
  let soundOn = true;
  try { soundOn = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
  let ctx = null;
  let unlocked = false;

  const audio = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const envelope = (g, t, peak, attack, decay) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  };
  // A soft tick, like a card brushing another.
  const tick = (pitch = 1) => {
    if (!soundOn || !unlocked) return;
    const a = audio(); if (!a) return;
    const t = a.currentTime;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(1500 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(900 * pitch, t + 0.04);
    envelope(g, t, 0.025, 0.004, 0.05);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + 0.07);
  };
  // A paper-like swish followed by a light tap when the card lands.
  const flip = () => {
    if (!soundOn) return;
    const a = audio(); if (!a) return;
    const t = a.currentTime;
    const len = Math.floor(a.sampleRate * 0.22);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const n = a.createBufferSource(); n.buffer = buf;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(900, t);
    bp.frequency.exponentialRampToValueAtTime(4200, t + 0.18);
    const g = a.createGain(); envelope(g, t, 0.07, 0.03, 0.17);
    n.connect(bp).connect(g).connect(a.destination);
    n.start(t);
    const o = a.createOscillator(), g2 = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(320, t + 0.36);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.44);
    envelope(g2, t + 0.36, 0.08, 0.005, 0.09);
    o.connect(g2).connect(a.destination);
    o.start(t + 0.36); o.stop(t + 0.5);
  };
  document.addEventListener('pointerdown', () => { unlocked = true; }, { once: true });
  document.addEventListener('keydown', () => { unlocked = true; }, { once: true });

  const soundBtn = document.querySelector('.xp-sound');
  const syncSound = () => {
    if (!soundBtn) return;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    const zh = document.documentElement.dataset.language === 'zh';
    soundBtn.querySelector('.xp-sound-label').textContent = soundOn ? (zh ? '音效开' : 'Sound on') : (zh ? '音效关' : 'Sound off');
  };
  soundBtn?.setAttribute('translate', 'no');
  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem(KEY, soundOn ? 'on' : 'off'); } catch (e) {}
    syncSound();
    if (soundOn) { unlocked = true; tick(1.2); }
  });
  new MutationObserver(syncSound).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  syncSound();

  /* ---------- Flip ---------- */
  const setFlipped = (card, flipped) => {
    card.classList.toggle('is-flipped', flipped);
    const front = card.querySelector('.xp-front');
    const back = card.querySelector('.xp-back');
    front.setAttribute('aria-expanded', String(flipped));
    front.tabIndex = flipped ? -1 : 0;
    back.toggleAttribute('inert', !flipped);
    back.setAttribute('aria-hidden', String(!flipped));
  };

  cards.forEach((card, i) => {
    setFlipped(card, false);
    const inner = card.querySelector('.xp-inner');

    card.querySelector('.xp-front').addEventListener('click', () => {
      cards.forEach((c) => { if (c !== card && c.classList.contains('is-flipped')) setFlipped(c, false); });
      setFlipped(card, true);
      flip();
      setTimeout(() => card.querySelector('.xp-back a, .xp-close')?.focus({ preventScroll: true }), 360);
    });
    card.querySelector('.xp-close').addEventListener('click', () => {
      setFlipped(card, false);
      flip();
      card.querySelector('.xp-front').focus({ preventScroll: true });
    });

    /* ---------- Tilt + light ---------- */
    if (finePointer && !reduceMotion) {
      card.addEventListener('pointerenter', () => tick(1 + i * 0.06));
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
