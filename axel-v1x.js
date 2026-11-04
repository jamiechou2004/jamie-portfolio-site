/* Iteration 1 Today's Summary: scale-to-fit + hover/focus previews. */
(() => {
  const root = document.querySelector('[data-v1x]');
  if (!root) return;
  const stage = root.querySelector('.v1x-stage');
  const fit = root.querySelector('.v1x-fit');
  const ui = root.querySelector('.v1x');
  const zones = [...root.querySelectorAll('.v1x-zone')];
  const calls = [...root.querySelectorAll('.v1x-calls button')];
  const tips = [...root.querySelectorAll('.v1x-tip')];
  let scale = 1, locked = null;

  const resize = () => {
    scale = Math.min(1, fit.clientWidth / 860);
    ui.style.transform = `scale(${scale})`;
    fit.style.height = ui.offsetHeight * scale + 'px';
  };
  new ResizeObserver(resize).observe(fit);
  resize();

  const place = (tip, zone) => {
    const s = stage.getBoundingClientRect(), z = zone.getBoundingClientRect();
    const narrow = window.matchMedia('(max-width:650px)').matches;
    if (narrow) { tip.style.left=''; tip.style.top=''; return; }
    let left, top;
    const n = zone.dataset.zone;
    if (n === '3') { left = z.left - s.left - tip.offsetWidth - 14; top = z.top - s.top + 10; }
    else if (n === '2') { left = z.left - s.left + 24; top = z.top - s.top - tip.offsetHeight - 10; }
    else { left = z.left - s.left + 24; top = z.bottom - s.top + 10; }
    left = Math.max(12, Math.min(left, s.width - tip.offsetWidth - 12));
    top = Math.max(12, top);
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  };

  const show = (n) => {
    zones.forEach(z => z.classList.toggle('is-on', z.dataset.zone === n));
    calls.forEach(c => c.classList.toggle('is-on', c.dataset.zone === n));
    tips.forEach(t => {
      const on = t.dataset.tip === n;
      t.classList.toggle('is-on', on);
      if (on) place(t, zones.find(z => z.dataset.zone === n));
    });
  };
  const clear = () => { if (!locked) show(null); };

  [...zones, ...calls].forEach(el => {
    el.addEventListener('pointerenter', () => { if (!locked) show(el.dataset.zone); });
    el.addEventListener('pointerleave', clear);
    el.addEventListener('focus', () => show(el.dataset.zone));
    el.addEventListener('blur', () => { locked = null; clear(); });
    el.addEventListener('click', () => { locked = locked === el.dataset.zone ? null : el.dataset.zone; show(locked); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { locked = null; show(null); } });
  window.addEventListener('resize', () => { const on = tips.find(t => t.classList.contains('is-on')); if (on) place(on, zones.find(z => z.dataset.zone === on.dataset.tip)); });
})();

/* Sidebar navigation between prototype pages. */
(() => {
  const root = document.querySelector('[data-v1x]');
  if (!root) return;
  const ui = root.querySelector('.v1x');
  const fit = root.querySelector('.v1x-fit');
  const views = [...root.querySelectorAll('.v1x-view')];
  const navs = [...root.querySelectorAll('.v1x-nav [data-go]')];
  const away = root.querySelector('.v1x-away');
  const dash = root.querySelector('.v1x-dash');
  const lockHeight = () => { views.forEach(v => v.style.height = ''); const h = dash.offsetHeight; views.forEach(v => { v.style.height = h + 'px'; }); };
  const refit = () => { const s = Math.min(1, fit.clientWidth / 860); fit.style.height = ui.offsetHeight * s + 'px'; };
  const go = (name) => {
    views.forEach(v => { v.hidden = v.dataset.view !== name; });
    navs.forEach(n => { const on = n.dataset.go === name; n.classList.toggle('on', on); on ? n.setAttribute('aria-current', 'page') : n.removeAttribute('aria-current'); });
    const isAway = name !== 'dashboard';
    root.classList.toggle('is-away', isAway);
    away.hidden = !isAway;
    root.querySelectorAll('.v1x-zone.is-on, .v1x-calls .is-on, .v1x-tip.is-on').forEach(e => e.classList.remove('is-on'));
    refit();
  };
  navs.forEach(n => n.addEventListener('click', () => go(n.dataset.go)));
  root.querySelector('.v1x-back').addEventListener('click', () => { go('dashboard'); navs[0].focus(); });
  root.querySelectorAll('[data-toggle]').forEach(t => t.addEventListener('click', () => {
    const on = !t.classList.contains('is-on'); t.classList.toggle('is-on', on); t.setAttribute('aria-pressed', on);
    const label = t.querySelector('span'); if (label) label.textContent = on ? 'In stock' : 'Out of stock';
    const card = t.closest('.mi'); if (card) card.classList.toggle('is-out', !on);
  }));
  lockHeight(); refit();
  window.addEventListener('resize', () => { lockHeight(); refit(); });
})();
