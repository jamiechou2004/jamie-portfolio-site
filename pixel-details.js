(() => {
  const arrow = '<svg class="pixel-arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 1h2v2h2v2h2v2h-2v2H8v2H6V9h2V7H0V5h8V3H6Z" fill="currentColor"/></svg>';
  document.querySelectorAll('.hp-caption h3 > span[aria-hidden], .cc-footer > a > span[aria-hidden]').forEach(old => {
    old.outerHTML = arrow;
  });
  const mark = document.querySelector('.hp-closing-mark');
  if (!mark) return;
  mark.removeAttribute('aria-hidden');
  mark.innerHTML = '<button class="pixel-sprout" type="button" aria-label="Grow a little leaf" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="sprout-stem" d="M11 10h2v10h-2zM5 20h14v2H5zM5 8h4v2h2v4H9v-2H7v-2H5z"/><path class="sprout-leaf" d="M13 8h2V6h6v4h-2v2h-4v2h-2z"/></svg></button>';
  const btn = mark.querySelector('button');
  let pinned = false;
  const hover = matchMedia('(hover:hover) and (pointer:fine)');
  btn.addEventListener('pointerenter', () => {if(hover.matches)btn.classList.add('is-grown');});
  btn.addEventListener('pointerleave', () => {if(!pinned)btn.classList.remove('is-grown');});
  btn.addEventListener('click', () => {pinned=!pinned;btn.setAttribute('aria-pressed',String(pinned));btn.setAttribute('aria-label',pinned?'Reset the little leaf':'Grow a little leaf');btn.classList.toggle('is-grown',pinned);});
})();
