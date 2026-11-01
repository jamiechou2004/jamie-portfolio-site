/* Contextual project pill.
   While a case study cover is on screen, a small pill names the project and
   types through its topics. Content is read from each .hp-project, so it stays
   in sync with the page copy and with the zh translation layer. */
(() => {
  const projects = [...document.querySelectorAll('.hp-project')];
  if (!projects.length || !('IntersectionObserver' in window)) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pill = document.createElement('div');
  pill.className = 'project-pill';
  pill.setAttribute('translate', 'no'); // the i18n layer must not rewrite text mid-typing
  pill.setAttribute('aria-hidden', 'true'); // captions already carry this info for assistive tech
  pill.innerHTML =
    '<a class="project-pill__name" tabindex="-1"></a>' +
    '<span class="project-pill__tag"><span data-text></span><i class="project-pill__caret"></i></span>';
  document.body.appendChild(pill);

  const nameEl = pill.querySelector('.project-pill__name');
  const textEl = pill.querySelector('[data-text]');
  let active = null;
  let timer = null;

  const read = (project) => {
    const heading = project.querySelector('.hp-caption h3');
    const link = project.querySelector('.hp-caption a, .hp-cover');
    const name = heading ? heading.firstChild.textContent.trim() : '';
    const tags = [...project.querySelectorAll('.hp-caption li')].map((li) => li.textContent.trim());
    return { name, tags, href: link ? link.getAttribute('href') : '#' };
  };

  const place = () => {
    const main = document.getElementById('main-content');
    if (!main) return;
    const r = main.getBoundingClientRect();
    pill.style.left = `${r.left + r.width / 2}px`;
  };

  const stop = () => { clearTimeout(timer); timer = null; };

  const type = (tags) => {
    stop();
    if (!tags.length) { textEl.textContent = ''; return; }
    if (reduce) { textEl.textContent = tags.join(' · '); return; }
    let i = 0;
    let n = 0;
    let deleting = false;
    const tick = () => {
      const word = tags[i % tags.length];
      n += deleting ? -1 : 1;
      textEl.textContent = word.slice(0, n);
      let wait = deleting ? 28 : 55;
      if (!deleting && n >= word.length) { deleting = true; wait = 1600; }
      else if (deleting && n <= 0) { deleting = false; i += 1; wait = 260; }
      timer = setTimeout(tick, wait);
    };
    tick();
  };

  const show = (project) => {
    if (active === project) return;
    active = project;
    const { name, tags, href } = read(project);
    nameEl.textContent = name;
    nameEl.setAttribute('href', href);
    place();
    pill.classList.add('is-visible');
    type(tags);
  };

  const hide = () => {
    active = null;
    stop();
    pill.classList.remove('is-visible');
  };

  const visible = new Map();
  projects.forEach((p) => { const cover = p.querySelector('.hp-cover') || p; cover.__project = p; });
  // Observe covers but report the parent project.
  const coverIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => visible.set(e.target.__project, e.isIntersecting ? e.intersectionRatio : 0));
    let best = null;
    let bestRatio = 0;
    visible.forEach((ratio, el) => { if (ratio > bestRatio) { best = el; bestRatio = ratio; } });
    if (best && bestRatio >= 0.35) show(best); else hide();
  }, { threshold: [0, 0.2, 0.35, 0.5, 0.75, 1] });
  projects.forEach((p) => coverIo.observe(p.querySelector('.hp-cover') || p));

  window.addEventListener('resize', place, { passive: true });
  // Rail collapse/expand and language switches change layout or copy; refresh both.
  const refresh = new MutationObserver(() => {
    // Let the translation layer finish rewriting captions before re-reading them.
    setTimeout(() => {
      place();
      if (active) {
        const current = active;
        active = null;
        show(current);
      }
    }, 60);
  });
  refresh.observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  refresh.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
