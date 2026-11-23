/* Shopwise case study: part tabs scrollspy. */
(() => {
  const links = [...document.querySelectorAll('.sw-tabs a')];
  const parts = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!parts.length) return;
  const spy = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = parts[0];
    parts.forEach((p) => { if (p.getBoundingClientRect().top + window.scrollY <= y) current = p; });
    links.forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();
