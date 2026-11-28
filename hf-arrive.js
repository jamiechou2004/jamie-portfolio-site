/* Arrival half of the homepage "Let's go" transition: the black portal opens back up onto the new page. */
(() => {
  let t = 0;
  try { t = Number(sessionStorage.getItem('hf-arrive')) || 0; sessionStorage.removeItem('hf-arrive'); } catch {}
  if (!t || Date.now() - t > 11000 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const st = document.createElement('style');
  st.textContent = 'html.hf-arriving::after{content:"";position:fixed;inset:0;z-index:10000;background:#000;pointer-events:none;' +
    'clip-path:circle(150% at 50% 55%);animation:hf-iris .8s .15s cubic-bezier(.7,0,.25,1) forwards}' +
    '@keyframes hf-iris{to{clip-path:circle(0% at 50% 55%)}}';
  document.head.append(st);
  document.documentElement.classList.add('hf-arriving');
  setTimeout(() => document.documentElement.classList.remove('hf-arriving'), 1100);
})();
