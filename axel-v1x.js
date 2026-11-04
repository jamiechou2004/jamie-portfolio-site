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
