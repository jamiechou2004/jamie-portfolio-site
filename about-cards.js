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
      img.onload = () => { tile.textContent = ''; tile.append(img); tile.classList.add('has-logo'); };
      img.onerror = () => tryLoad(exts.slice(1));
      img.src = `assets/logos/${org}.${exts[0]}`;
    };
    tryLoad(['svg', 'png', 'webp']);
  });

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
