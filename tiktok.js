/* TikTok case study: half/full toggle + section scrollspy. */
(() => {
  const tabs = [...document.querySelectorAll('.tk-switch [role="tab"]')];
  const select = (tab) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next); next.focus();
    });
  });

  const links = [...document.querySelectorAll('.tk-nav a')];
  const parts = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = () => {
    const y = window.scrollY + window.innerHeight * 0.3;
    let current = null;
    parts.forEach(p => { if (p.offsetTop <= y) current = p; });
    links.forEach(a => a.classList.toggle('is-on', current && a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();
