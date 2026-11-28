/* Shopwise case study: + reveals, segmented tabs, storyboard toggle, live prototype embed.
   Without JS every reveal body stays visible (CSS hides them only under html.js-sw). */
(() => {
  const page = document.querySelector('.sw-page');
  if (!page) return;
  const zh = () => /^zh/.test(document.documentElement.lang);

  // + reveals
  page.querySelectorAll('.sw-reveal').forEach((item, i) => {
    const btn = item.querySelector('.sw-plus');
    const body = item.querySelector('.sw-reveal-body');
    const row = item.querySelector('.sw-reveal-row');
    if (!btn || !body) return;
    body.id = body.id || `sw-reveal-${i}`;
    btn.setAttribute('aria-controls', body.id);
    const toggle = () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? (zh() ? '收起说明' : 'Hide details') : (zh() ? '展开说明' : 'Show details'));
    };
    btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    row.addEventListener('click', toggle);
  });

  // Segmented tabs: each .sw-seg[data-tab] switches sibling [data-panel] inside its section
  page.querySelectorAll('.sw-seg').forEach(seg => {
    const scope = seg.parentElement;
    const tabs = [...seg.querySelectorAll('button[data-tab]')];
    if (!tabs.length) return;
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      scope.querySelectorAll(':scope > [data-panel]').forEach(p => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }));
  });

  // Before / After: tap a tag or the card behind, and it deals to the front
  page.querySelectorAll('.sw-pair-phones').forEach(stack => {
    const show = side => {
      if (stack.dataset.front === side) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      stack.querySelectorAll('.sw-pc').forEach(card => {
        card.classList.remove('to-front', 'to-back');
        if (!reduce) { void card.offsetWidth; card.classList.add(card.dataset.side === side ? 'to-front' : 'to-back'); }
      });
      stack.dataset.front = side;
      stack.querySelectorAll('.sw-tag').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.show === side)));
    };
    stack.querySelectorAll('.sw-pc').forEach(card => card.addEventListener('click', e => {
      const tag = e.target.closest('.sw-tag');
      show(tag ? tag.dataset.show : card.dataset.side);
    }));
  });

  // Aa: show the type scale as capsules
  const aa = page.querySelector('.sw-aa');
  const cloud = document.getElementById('sw-type-cloud');
  if (aa && cloud) aa.addEventListener('click', () => {
    const open = cloud.hidden;
    cloud.hidden = !open;
    aa.setAttribute('aria-expanded', String(open));
    aa.setAttribute('aria-label', open ? 'Hide the type scale' : 'Show the type scale');
  });

  // AI screen recordings play only while on screen
  const recs = [...page.querySelectorAll('video.sw-rec')];
  if (recs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const vio = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.preload = 'auto'; e.target.play().catch(() => {}); } else e.target.pause();
    }), { threshold: 0.35 });
    recs.forEach(v => vio.observe(v));
  }

  // Storyboards toggle
  const sbBtn = page.querySelector('.sw-pill-toggle');
  const sb = document.getElementById('sw-storyboards');
  if (sbBtn && sb) sbBtn.addEventListener('click', () => {
    const open = sb.hidden;
    sb.hidden = !open;
    sbBtn.setAttribute('aria-expanded', String(open));
    sbBtn.querySelector('span').textContent = open ? (zh() ? '收起故事板' : 'Hide the storyboards') : (zh() ? '查看故事板' : 'See the storyboards');
    if (open) sb.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  // Live prototypes: the coded customer app and GM console are hosted on this site,
  // so each flow can start from the right saved state (same-origin localStorage).
  const KEY = 'shopwise-prototype-v1';
  const ANSWERS = { goal: 'home', floorPlan: false, rooms: [{ name: 'Bedrooms', count: 1 }, { name: 'Living rooms', count: 1 }, { name: 'Bathrooms', count: 1 }], size: '800–1,199', planRooms: 'living-bedroom', planRoomsCustom: '', furniture: 'fresh', keeping: [], livingWith: ['Just me'], everyDay: ['Work from home', 'Hosting', 'Storage'], style: 'warm', budget: 3000, location: 'New York, NY', timing: 'two-weeks', timingNote: '' };
  const PROFILE = { signUpMethod: 'apple', name: 'Alex', homeType: 'apartment', onboardedAt: '2026-10-18T10:00:00.000Z' };
  const plan = lampId => ({ status: 'ready', lampId, stepsDone: 10, answers: ANSWERS, updatedAt: '2026-10-18T10:00:00.000Z' });
  const ORDER = { id: 'SW-10482', lines: [
    { id: 'linen-sofa', name: 'Linen sofa', price: 700, image: './img/sofa.png' },
    { id: 'coffee-table', name: 'Coffee table', price: 150, image: './img/table.png' },
    { id: 'mini-globe', name: 'Mini globe lamp', price: 80, image: './img/lamp-mini-room.png' },
    { id: 'queen-bed', name: 'Queen bed', price: 900, image: './img/bed.png' },
    { id: 'wardrobe', name: 'Wardrobe', price: 300, image: './img/wardrobe.png' },
    { id: 'desk', name: 'Desk', price: 200, image: './img/desk.png' },
    { id: 'desk-chair', name: 'Desk chair', price: 150, image: './img/chair.png' }
  ], total: 2807, slot: 'thu', status: 'buying' };
  const FLOWS = {
    home: { seed: { profile: PROFILE, plan: plan('shade-floor') }, hash: '/home' },
    onboarding: { seed: {}, hash: '/' },
    design: { seed: { profile: PROFILE }, hash: '/setup/1' },
    change: { seed: { profile: PROFILE, plan: plan('shade-floor') }, hash: '/plan' },
    checkout: { seed: { profile: PROFILE, plan: plan('mini-globe') }, hash: '/checkout' },
    delivery: { seed: { profile: PROFILE, plan: plan('mini-globe'), order: ORDER }, hash: '/notify' },
    ai: { seed: { profile: PROFILE, plan: plan('shade-floor') }, hash: '/ai/plan' }
  };
  const APP = '/shopwise-app/';
  const GM = '/shopwise-gm/';

  const live = page.querySelector('.sw-live');
  if (!live) return;
  const phone = live.querySelector('.sw-iphone-screen');
  const browser = live.querySelector('.sw-browser-screen');
  const openFull = document.getElementById('sw-open-full');
  const flowBtns = [...live.querySelectorAll('[data-flow]')];
  const modeBtns = [...page.querySelectorAll('#try [data-live]')];
  let appFrame = null, gmFrame = null, flow = 'home', mode = 'customer';

  const fit = () => {
    if (appFrame) appFrame.style.transform = `scale(${phone.clientWidth / 402})`;
    if (gmFrame) gmFrame.style.transform = `scale(${browser.clientWidth / 1440})`;
  };
  addEventListener('resize', fit);

  const makeFrame = (host, title) => {
    const f = document.createElement('iframe');
    f.title = title;
    host.prepend(f);
    return f;
  };

  const startFlow = name => {
    const f = FLOWS[name];
    try { localStorage.setItem(KEY, JSON.stringify(f.seed)); } catch (e) { /* storage blocked: app starts fresh */ }
    if (!appFrame) {
      appFrame = makeFrame(phone, 'Shopwise customer app, live prototype');
      // Match the status bar to the screen underneath (same list as the app's own Device frame)
      const LIGHT = [/^\/$/, /^\/style\//, /^\/setup\/generating/, /^\/plan$/, /^\/plan\/lamp(\/replace|\/try\/.*)?$/, /^\/notify$/, /^\/check-in$/];
      const sync = () => {
        try {
          const path = appFrame.contentWindow.location.hash.replace(/^#/, '') || '/';
          phone.classList.toggle('is-light', LIGHT.some(r => r.test(path)));
          phone.classList.toggle('no-status', path === '/notify');
        } catch (e) { /* cross-origin: keep defaults */ }
      };
      appFrame.addEventListener('load', () => {
        sync();
        try { appFrame.contentWindow.addEventListener('hashchange', sync); } catch (e) {}
      });
    }
    appFrame.src = `${APP}?flow=${name}&t=${Date.now()}#${f.hash}`;
    openFull.href = `${APP}#${f.hash}`;
    fit();
  };
  const showGM = () => {
    if (!gmFrame) { gmFrame = makeFrame(browser, 'Shopwise GM console, live prototype'); gmFrame.src = GM; }
    openFull.href = GM;
    fit();
  };

  flowBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
  flowBtns.forEach(b => b.addEventListener('click', () => {
    flow = b.dataset.flow;
    flowBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    startFlow(flow);
  }));
  modeBtns.forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.live;
    live.dataset.mode = mode;
    modeBtns.forEach(x => x.setAttribute('aria-selected', String(x === b)));
    if (mode === 'gm') showGM(); else { openFull.href = `${APP}#${FLOWS[flow].hash}`; if (!appFrame) startFlow(flow); }
    requestAnimationFrame(fit);
  }));

  // Load the app once the section is close to the viewport
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { io.disconnect(); if (!appFrame) startFlow(flow); }
  }, { rootMargin: '400px 0px' });
  io.observe(live);

  // Back to top
  const top = page.querySelector('.sw-top');
  if (top) top.addEventListener('click', e => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  document.documentElement.classList.add('js-sw');
})();
