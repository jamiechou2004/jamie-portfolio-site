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

  // Live prototypes
  const CODED = {
    customer: 'https://jamiechou2004.github.io/ShopWise_CustomerSide/customer/',
    gm: 'https://jamiechou2004.github.io/ShopWise_CustomerSide/gm-console/'
  };
  const FILE = '9PlQMFsLfdYTDK8qfViN96';
  const FLOWS = {
    onboarding: ['1398:2648', '1398:2649'],
    design: ['1398:2970', '1398:2971'],
    change: ['1398:3517', '1398:3518'],
    checkout: ['1398:4708', '1398:4709'],
    delivery: ['1398:5189', '1398:5190'],
    ai: ['1398:3846', '1398:3847']
  };
  const proto = (host, [pageId, nodeId], extra = '') =>
    `https://${host}/proto/${FILE}/Shopwise?page-id=${encodeURIComponent(pageId)}&node-id=${nodeId.replace(':', '-')}` +
    `&starting-point-node-id=${encodeURIComponent(nodeId)}&scaling=scale-down&content-scaling=fixed${extra}`;

  const live = page.querySelector('.sw-live');
  if (!live) return;
  const screen = live.querySelector('.sw-live-screen');
  const poster = live.querySelector('.sw-live-poster');
  const openFull = document.getElementById('sw-open-full');
  const flowBtns = [...live.querySelectorAll('[data-flow]')];
  const modeBtns = [...page.querySelectorAll('#try [data-live]')];
  let iframe = null;

  const fit = () => {
    if (!iframe) return;
    const baseW = live.dataset.mode === 'gm' ? 1440 : 390;
    iframe.style.transform = `scale(${screen.clientWidth / baseW})`;
  };
  addEventListener('resize', fit);

  const load = (src, title) => {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      screen.append(iframe);
    }
    iframe.title = title;
    iframe.src = src;
    poster.hidden = true;
    fit();
  };

  const state = { mode: 'customer', flow: null };
  const current = () => {
    if (state.mode === 'gm') return { src: CODED.gm, full: CODED.gm, title: 'Shopwise GM console, live prototype' };
    if (state.flow) {
      const f = FLOWS[state.flow];
      return {
        src: proto('embed.figma.com', f, '&embed-host=share&hide-ui=1&footer=false&theme=light'),
        full: proto('www.figma.com', f, '&hide-ui=1'),
        title: `Shopwise Figma prototype: ${state.flow}`
      };
    }
    return { src: CODED.customer, full: CODED.customer, title: 'Shopwise customer app, live prototype' };
  };
  const apply = (autoload) => {
    const c = current();
    openFull.href = c.full;
    if (autoload || iframe) load(c.src, c.title);
  };

  poster.addEventListener('click', () => apply(true));
  flowBtns.forEach(b => b.addEventListener('click', () => {
    const same = state.flow === b.dataset.flow;
    state.flow = same ? null : b.dataset.flow;
    flowBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b && !same)));
    apply(true);
  }));
  flowBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
  modeBtns.forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.live;
    live.dataset.mode = state.mode;
    modeBtns.forEach(x => x.setAttribute('aria-selected', String(x === b)));
    apply(state.mode === 'gm' || !!iframe);
  }));

  // Back to top
  const top = page.querySelector('.sw-top');
  if (top) top.addEventListener('click', e => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  document.documentElement.classList.add('js-sw');
})();
