/* Selected work: compact layout previews (November 2026).
   Inactive unless the URL carries ?layout=1|2|3, so the live homepage is unchanged.
   1 = list + large preview, 2 = carousel, 3 = 2x2 grid.
   Content is read from the existing .hp-project articles. */
(() => {
  const mode = new URLSearchParams(location.search).get('layout');
  if (!['1', '2', '3'].includes(mode)) return;
  const section = document.querySelector('.hp-work');
  const articles = [...document.querySelectorAll('.hp-work .hp-project')];
  if (!section || !articles.length) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'work-layouts.css?v=20261128-1';
  document.head.append(css);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const chev = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

  const items = articles.map((art, i) => {
    const cover = art.querySelector('.hp-cover');
    const h3 = art.querySelector('.hp-caption h3');
    return {
      i,
      num: String(i + 1).padStart(2, '0'),
      href: cover.getAttribute('href'),
      name: h3 ? h3.firstChild.textContent.trim() : '',
      tag: art.querySelector('.hp-caption li')?.textContent.trim() || '',
      coverClass: cover.className,
      media: cover.innerHTML,
    };
  });

  const coverHTML = it => `<div class="${it.coverClass} wl-cover">${it.media}</div>`;
  const prep = root => root.querySelectorAll('video').forEach(v => {
    v.removeAttribute('autoplay');
    v.removeAttribute('data-cover-video');
    v.muted = true;
    v.pause();
  });
  const play = v => { if (v && !reduce) v.play().catch(() => {}); };
  const stop = v => v && v.pause();

  articles.forEach(a => { a.hidden = true; });
  const root = document.createElement('div');
  root.className = `wl wl-${mode}`;
  section.append(root);

  if (mode === '1') {
    root.innerHTML =
      `<ol class="wl1-list">${items.map(it =>
        `<li><a class="wl1-row" href="${it.href}" data-i="${it.i}"><span class="wl1-num">${it.num}</span><span class="wl1-name">${it.name}</span><span class="wl1-tag">${it.tag}</span><span class="wl1-go">${arrow}</span></a></li>`).join('')}</ol>` +
      `<a class="wl1-stage" href="${items[0].href}">${items.map(coverHTML).join('')}<span class="wl-pill">View case ${arrow}</span></a>`;
    prep(root);
    const rows = [...root.querySelectorAll('.wl1-row')];
    const covers = [...root.querySelectorAll('.wl-cover')];
    const stage = root.querySelector('.wl1-stage');
    let active = -1;
    const set = n => {
      if (n === active) return;
      active = n;
      rows.forEach((r, k) => r.classList.toggle('is-active', k === n));
      covers.forEach((c, k) => {
        c.classList.toggle('is-active', k === n);
        const v = c.querySelector('video');
        if (k === n) { if (v) v.currentTime = 0; play(v); } else stop(v);
      });
      stage.href = items[n].href;
    };
    rows.forEach((r, k) => {
      r.addEventListener('mouseenter', () => set(k));
      r.addEventListener('focus', () => set(k));
      r.addEventListener('click', e => { if (touch && k !== active) { e.preventDefault(); set(k); } });
    });
    set(0);
  }

  if (mode === '2') {
    root.innerHTML =
      `<div class="wl2-track">${items.map(it => `<a class="wl2-card" href="${it.href}" data-i="${it.i}">${coverHTML(it)}</a>`).join('')}</div>` +
      `<div class="wl2-bar"><a class="wl2-meta" href="${items[0].href}"><span class="wl2-name"></span><span class="wl2-tag"></span></a>` +
      `<div class="wl2-ctrl"><button type="button" class="wl-round" data-dir="-1" aria-label="Previous project">${chev('m15 18-6-6 6-6')}</button>` +
      `<span class="wl2-dots">${items.map(() => '<i></i>').join('')}</span>` +
      `<button type="button" class="wl-round" data-dir="1" aria-label="Next project">${chev('m9 18 6-6-6-6')}</button></div></div>`;
    prep(root);
    const track = root.querySelector('.wl2-track');
    const cards = [...root.querySelectorAll('.wl2-card')];
    const dots = [...root.querySelectorAll('.wl2-dots i')];
    const meta = root.querySelector('.wl2-meta');
    let active = -1;
    const set = n => {
      if (n === active) return;
      active = n;
      cards.forEach((c, k) => {
        c.classList.toggle('is-active', k === n);
        const v = c.querySelector('video');
        k === n ? play(v) : stop(v);
      });
      dots.forEach((d, k) => d.classList.toggle('is-active', k === n));
      meta.href = items[n].href;
      meta.querySelector('.wl2-name').textContent = items[n].name;
      meta.querySelector('.wl2-tag').textContent = items[n].tag;
    };
    const go = n => {
      n = Math.max(0, Math.min(cards.length - 1, n));
      const c = cards[n];
      track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      set(n);
    };
    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0, dist = Infinity;
        cards.forEach((c, k) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = k; } });
        set(best);
      });
    });
    cards.forEach((c, k) => c.addEventListener('click', e => { if (k !== active) { e.preventDefault(); go(k); } }));
    root.querySelectorAll('.wl-round').forEach(b => b.addEventListener('click', () => go(active + Number(b.dataset.dir))));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    set(0);
  }

  if (mode === '3') {
    root.innerHTML = items.map(it =>
      `<a class="wl3-card" href="${it.href}">${coverHTML(it)}<span class="wl3-cap"><span class="wl3-name">${it.name}</span><span class="wl3-tag">${it.tag}</span><span class="wl3-go">${arrow}</span></span></a>`).join('');
    prep(root);
    const cards = [...root.querySelectorAll('.wl3-card')];
    if (touch && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        const v = e.target.querySelector('video');
        e.isIntersecting ? play(v) : stop(v);
      }), { threshold: 0.6 });
      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(c => {
        const v = c.querySelector('video');
        c.addEventListener('mouseenter', () => play(v));
        c.addEventListener('mouseleave', () => stop(v));
        c.addEventListener('focus', () => play(v));
        c.addEventListener('blur', () => stop(v));
      });
    }
  }

  // Preview-only switcher, so the options can be compared side by side.
  const sw = document.createElement('nav');
  sw.className = 'wl-switch';
  sw.setAttribute('aria-label', 'Layout preview');
  sw.setAttribute('translate', 'no');
  const opts = [['', 'Now'], ['1', 'List'], ['2', 'Carousel'], ['3', 'Grid']];
  sw.innerHTML = opts.map(([v, label]) => {
    const u = new URL(location.href);
    v ? u.searchParams.set('layout', v) : u.searchParams.delete('layout');
    u.hash = 'hp-title';
    return `<a href="${u.pathname}${u.search}${u.hash}"${v === mode ? ' aria-current="true"' : ''}>${v ? `<b>${v}</b>` : ''}${label}</a>`;
  }).join('');
  document.body.append(sw);
})();
