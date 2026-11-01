/* About v2 — flip experience cards. One card open at a time; Escape closes. */
(() => {
  const cards = [...document.querySelectorAll('.xp-card')];
  if (!cards.length) return;

  const setFlipped = (card, flipped) => {
    card.classList.toggle('is-flipped', flipped);
    const front = card.querySelector('.xp-front');
    const back = card.querySelector('.xp-back');
    front.setAttribute('aria-expanded', String(flipped));
    // Keep only the visible face reachable by keyboard and screen readers.
    front.tabIndex = flipped ? -1 : 0;
    back.toggleAttribute('inert', !flipped);
    back.setAttribute('aria-hidden', String(!flipped));
  };

  cards.forEach((card) => {
    setFlipped(card, false);
    card.querySelector('.xp-front').addEventListener('click', () => {
      cards.forEach((c) => { if (c !== card) setFlipped(c, false); });
      setFlipped(card, true);
      setTimeout(() => card.querySelector('.xp-back a, .xp-close')?.focus({ preventScroll: true }), 320);
    });
    card.querySelector('.xp-close').addEventListener('click', () => {
      setFlipped(card, false);
      card.querySelector('.xp-front').focus({ preventScroll: true });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = cards.find((c) => c.classList.contains('is-flipped'));
    if (!open) return;
    setFlipped(open, false);
    open.querySelector('.xp-front').focus({ preventScroll: true });
  });

  // Tapping outside the deck closes an open card.
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.xp-card')) return;
    cards.forEach((c) => { if (c.classList.contains('is-flipped')) setFlipped(c, false); });
  });
})();
