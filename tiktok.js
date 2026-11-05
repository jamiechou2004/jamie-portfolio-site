/* TikTok case study: part tabs scrollspy + honest-limit dot grid. */
(() => {
  const grid = document.querySelector('.tk-dotgrid');
  if (grid) {
    const miss = new Set([7, 23, 44, 58, 71]);
    for (let i = 0; i < 80; i++) {
      const d = document.createElement('i');
      if (miss.has(i)) d.className = 'is-miss';
      grid.appendChild(d);
    }
  }

  const links = [...document.querySelectorAll('.tk-tabs a')];
  const parts = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = parts[0];
    parts.forEach(p => { if (p.getBoundingClientRect().top + window.scrollY <= y) current = p; });
    links.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();
