/* Hero capsule: tap the pill to stretch it into the three themes; a theme opens the matching card
   (hero-a.js moves the guide there). Chip state follows whichever card is open. */
(() => {
  'use strict';
  const root = document.querySelector('.ha-hero');
  const cap = root && root.querySelector('.ha-capsule');
  if (!cap) return;
  const label = cap.querySelector('.ha-home-bubble');
  const chips = [...cap.querySelectorAll('.ha-chip')];
  const grid = root.querySelector('.ha-cards');
  const cards = [...root.querySelectorAll('.ha-card')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const zh = () => document.documentElement.dataset.language === 'zh';
  const names = { en: ['How I think', 'How I explore', 'What I notice'], zh: ['我的思考方式', '我的探索方式', '我注意到的事'] };

  // Width change with a press-then-spring feel. FLIP on width, so the pill grows from its left edge.
  let anim = null;
  const setState = (next) => {
    if (cap.dataset.state === next) return;
    const from = cap.getBoundingClientRect().width;
    cap.dataset.state = next;
    label.setAttribute('aria-expanded', String(next === 'open'));
    if (reduce.matches) return;
    const to = cap.getBoundingClientRect().width;
    if (anim) anim.cancel();
    anim = cap.animate(
      [
        { width: `${from}px`, transform: 'scale(1)' },
        { width: `${from}px`, transform: 'scale(.96)', offset: 0.22 },
        { width: `${to + (to > from ? 10 : -6)}px`, transform: 'scale(1.01)', offset: 0.72 },
        { width: `${to}px`, transform: 'scale(1)' },
      ],
      { duration: 460, easing: 'cubic-bezier(.22,.8,.3,1)' }
    );
    anim.finished.then(() => { anim = null; }).catch(() => {});
  };

  const open = () => { setState('open'); chips[0].focus({ preventScroll: true }); };
  label.addEventListener('click', open);
  label.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  // A theme = the same as tapping its card.
  chips.forEach((chip, i) => chip.addEventListener('click', () => cards[i].querySelector('.ha-trigger').click()));

  // Keep chips in step with the open card (cards can also be tapped directly).
  const sync = () => {
    const i = grid.dataset.open === undefined ? -1 : Number(grid.dataset.open);
    if (i >= 0) setState('open');
    chips.forEach((c, n) => c.setAttribute('aria-pressed', String(n === i)));
  };
  new MutationObserver(sync).observe(grid, { attributes: true, attributeFilter: ['data-open'] });

  // Capture phase: runs before hero-a.js, so Esc first closes an open card, and only a second Esc folds the pill.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cap.dataset.state === 'open' && grid.dataset.open === undefined) {
      setState('closed');
      label.focus({ preventScroll: true });
    }
  }, true);

  const language = () => { const l = zh() ? names.zh : names.en; chips.forEach((c, i) => { c.textContent = l[i]; }); };
  new MutationObserver(language).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  language();
  sync();
})();
