/* TikTok case study — the phone screens, rebuilt as live HTML so visitors can use them.
   Every [data-proto] container is rendered from the same small UI kit. */
(() => {
  const IMG = 'assets/tiktok-test/ui/';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------- data (from the Figma boards) ---------- */
  const D = {
    lotus: { name: 'Dry Pot Lotus Root', price: '$18.95', img: 'lotus', likes: 1861, top: 63, serves: 'serves 2–3', tags: ['Crispy outside', 'Numbing-spicy', 'House secret spice'], note: 'Crispy outside, tender inside, house spice' },
    frog: { name: 'Spicy Frog', price: '$22.95', img: 'frog', likes: 128, top: 33, serves: 'serves 2', tags: ['Numbing-hot', 'Fresh frog', 'Stir-fried'], note: 'Numbing-hot, fresh frog, stir-fried' },
    fish: { name: 'Boiled Fish in Chili Oil', price: '$32.95', img: 'fish', likes: 87, top: 53, serves: 'serves 3–4', tags: ['Layered chili broth', 'Fresh fish', 'Mala'], note: 'Layered chili broth, fresh fish, mala' },
    pork: { name: 'Garlic Pork Belly', price: '$12.95', img: 'pork', likes: 36, top: 33, serves: 'serves 2', tags: ['Thin-sliced', 'Garlic sauce', 'Cold starter'], note: 'Thin-sliced, garlic sauce, cold starter' },
    mapo: { name: 'Mapo Beef Rib', price: '$24.95', img: 'mapo', likes: 14, serves: 'serves 2', tags: ['Rich', 'Beef rib', 'Slow-braised'], note: 'Rich, beef rib, slow-braised' },
    noodle: { name: 'Cold Sesame Noodles', price: '$9.95', img: 'noodle', likes: 10, serves: 'serves 1', tags: ['Nutty', 'Chewy', 'Hand-pulled'], note: 'Nutty, chewy, hand-pulled' }
  };
  const TOP = ['lotus', 'frog', 'fish', 'pork'];
  const MENU = [
    ['Signature', [['lotus', 'Signature'], ['frog', 'Signature'], ['fish', 'Signature'], ['pork', 'Signature'], ['mapo', 'Signature'], ['noodle', 'Signature']]],
    ['Meat', [['Twice-Cooked Pork', '$16.95', 'pork', 'Popular', 412, 'Double-cooked, leek, bean paste'], ['Peppercorn Duck', '$21.95', 'duck', 'Spicy', 233, 'Green peppercorn, tender duck'], ['Char Siu Beef', '$19.95', 'charsiu', 'Signature', 188, 'Honey glaze, flame-roasted'], ['Braised Pigeon Legs', '$15.95', 'pigeon', 'Signature', 96, 'Dried chili, Sichuan pepper'], ['Mushroom Duck Stew', '$22.95', 'mushduck', 'Signature', 74, 'Slow-cooked, earthy broth']]],
    ['Veg', [['Dry Pot Lotus Root', '$18.95', 'lotus', 'Popular', 1861, 'Crispy outside, tender inside'], ['Garlic Edamame', '$6.95', 'edamame', 'Signature', 305, 'Garlic, chili flakes'], ['Celery & Lily Bulb Stir-fry', '$10.95', 'celery', 'Signature', 142, 'Light, crunchy, wok-fried'], ['Mapo Tofu', '$12.95', 'mapo', 'Spicy', 527, 'Silken tofu, numbing sauce']]],
    ['Dessert', [['Egg Tart', '$5.95', 'eggtart', 'Popular', 388, 'Flaky crust, warm custard'], ['Sesame Bun', '$6.95', 'sesamebun', 'Signature', 204, 'Molten sesame filling'], ['Osmanthus Pastry', '$5.95', 'osmanthus', 'Signature', 119, 'Floral, lightly sweet'], ["Bird's Nest Pudding", '$8.95', 'birdsnest', 'Signature', 67, 'Silky, chilled']]],
    ['Snacks', [['Cold Sesame Noodles', '$9.95', 'noodle', 'Popular', 10, 'Nutty, chewy, hand-pulled'], ['Garlic Edamame', '$6.95', 'edamame', 'Signature', 305, 'Garlic, chili flakes'], ['Claypot Rice', '$13.95', 'claypot', 'Signature', 156, 'Crispy rice crust, smoked fish'], ['Garlic Crayfish (small)', '$14.95', 'crayfish', 'Spicy', 221, 'Garlic butter, chili']]],
    ['Soup', [['Yellow Croaker Soup', '$18.95', 'croaker', 'Popular', 173, 'Clear broth, tofu'], ['Pickled Fish Soup', '$19.95', 'fish', 'Spicy', 342, 'Sour, spicy, fresh fish'], ['Stone Frog Soup', '$22.95', 'frog', 'Signature', 88, 'Ginger, scallion'], ['Crab & Tofu Soup', '$16.95', 'crab', 'Signature', 59, 'Crab roe, soft tofu']]]
  ];

  /* ---------- tiny icon set ---------- */
  const I = {
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M14 5l7 7-7 7M21 12H10a6 6 0 00-6 6"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>',
    star: '<svg viewBox="0 0 24 24" class="is-fill"><path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.6l5.9-.8z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
    thumb: '<svg viewBox="0 0 24 24"><path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a1.5 1.5 0 011.5 1.8l-1.4 6.6A2 2 0 0117.1 20H7"/></svg>',
    car: '<svg viewBox="0 0 24 24" class="is-fill"><path d="M5 11l1.6-4.2A2 2 0 018.5 5.5h7a2 2 0 011.9 1.3L19 11v6h-2v-1.5H7V17H5zM7.5 13.5a1 1 0 100-.01M16.5 13.5a1 1 0 100-.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" class="is-fill"><path d="M7 3l3 4-2 2a12 12 0 006 6l2-2 4 3-2 3C10 19 5 14 4 5z"/></svg>',
    walk: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.6"/><path d="M10 21l2-6 3 3v3M9 11l3-3 3 2 3 1M12 8l-1 5"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/></svg>',
    map: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" class="is-fill"><path d="M12 20s-7-4.4-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.6-9 9-9 9z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" class="is-fill"><path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4.1A8 8 0 1120 12z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    nav: '<svg viewBox="0 0 24 24" class="is-fill"><path d="M12 3l7 18-7-4-7 4z"/></svg>'
  };
  const img = (k, cls = '', alt = '') => `<img class="${cls}" src="${IMG}${k}.webp" alt="${esc(alt)}" loading="lazy" decoding="async">`;

  /* ---------- building blocks ---------- */
  const status = (t = '9:41', dark = false) => `<div class="kp-status${dark ? ' is-dark' : ''}" aria-hidden="true"><span>${t}</span><span class="kp-sig"><i></i><i></i><i></i><i></i><b></b></span></div>`;
  const topbar = () => `<div class="kp-topbar" aria-hidden="true"><span class="kp-cir" data-act="back">${I.back}</span><span class="kp-flex"></span><span class="kp-cir">${I.save}</span><span class="kp-cir">${I.share}</span><span class="kp-cir">${I.more}</span></div>`;
  const cta = () => `<div class="kp-cta"><button type="button" class="is-2" data-act="ride"><b>Get a ride</b>from $20 · Uber / Lyft</button><button type="button" class="is-1" data-act="drive"><b>Guide me there</b>18 min drive</button></div>`;
  const placeHead = (sub = '<span class="kp-green">Open until 11 PM</span>', icons = true) => `<div class="kp-place"><img class="kp-pav" src="${IMG}placeav.webp" alt=""><div><b>Good Harvest</b><span>Sichuan · ${sub}</span></div>${icons ? `<span class="kp-icons">${I.save}${I.share}${I.more}</span>` : ''}</div>`;
  const stats = (z = '') => `<div class="kp-stats" ${z}><div><small>18 reviews</small><b><i>${I.star}</i>4.6 Excellent</b></div><div><small>Per person</small><b>$35</b></div><div><small>Drive</small><b>18 min</b></div></div>`;
  const tiles = () => TOP.map((k, i) => `<button type="button" class="kp-tile" data-dish="${k}"><span class="kp-tile-img">${img(D[k].img, '', D[k].name)}<em>TOP-${i + 1}</em></span><b>${D[k].name}</b><small>${D[k].top}${I.thumb}</small></button>`).join('');
  const dishes = (z = '', zt = '') => `<section class="kp-mod" ${z}><header><b>Dishes · 6</b><button type="button" class="kp-link" data-act="viewall">View all ›</button></header><p class="kp-upd">Updated 2 days ago</p><div class="kp-tiles" ${zt}>${tiles()}</div></section>`;
  const combos = (z = '') => `<section class="kp-mod" ${z}><header><b>Popular combos · 3</b><span class="kp-link">View all ›</span></header><div class="kp-combos">
      <div class="kp-combo"><span>${img('video')}${img('c1')}</span><p><b>For 2</b><b>$46</b></p><small>Mala Dry Pot · Spicy Frog · Rice</small><small class="is-mute">1,208 ordered</small></div>
      <div class="kp-combo"><span>${img('c5')}${img('c2')}</span><p><b>For 4</b><b>$98</b></p><small>Hot Pot · Spicy Frog · Cumin Lamb · Dan Dan Noodles</small><small class="is-mute">640 ordered</small></div>
      <div class="kp-combo"><span>${img('c3')}${img('c4')}</span><p><b>For 1</b><b>$14</b></p><small>Lunch Special · Tea</small><small class="is-mute">2,310 ordered</small></div>
    </div></section>`;
  const reviews = (z = '', n = 2) => `<section class="kp-mod" ${z}><header><b>What people say</b><span class="kp-link">View all ›</span></header>
      <article class="kp-rev"><p class="kp-who">${img('av1')}<span><b>Eternally Happy</b>Jun 21, 2026 · Post</span></p><p>📍 Good Harvest – Doraville, GA. They specialize in authentic Sichuan hot pots, dry pots, and traditional Chinese cuisine. Food was very good! We ord… <em>more</em></p><span class="kp-revimg is-video">${img('c4')}</span></article>
      ${n > 1 ? `<article class="kp-rev"><p class="kp-who">${img('av2')}<span><b>Lil Nisa <i>Lv.1</i></b>Sep 27, 2026 · Review</span></p><p class="kp-stars">★★★★★</p><p>This was my first time trying K-pot style food &amp; boy was it amazing!!! Me and my friend made an hour trip and were not disappointed whatsoever! <em>more</em></p><span class="kp-revrow">${img('rv1')}${img('rv2')}</span></article>` : ''}
    </section>`;
  const gettingThere = (z = '', zf = '') => `<section class="kp-there" ${z}>
      <div class="kp-there-main"><p class="kp-teal">${I.pin}<b>18 min drive</b><span>|</span><b>No wait now</b> ›</p><p class="is-mute">Busy Fri–Sat 6–8 PM</p><p class="is-mute">5150 Buford Hwy NE C-120, Doraville, GA 30340</p><button type="button" class="kp-findit" data-act="findit" ${zf}>${I.walk}Find it ›</button></div>
      <span class="kp-round"><i>${I.car}</i>Ride</span><span class="kp-round"><i>${I.phone}</i>Call</span>
    </section>
    <div class="kp-btnrow"><span>${I.link}Website</span><span>${I.map}Map</span><span>${I.phone}Call</span><span>${I.pen}Review</span></div>`;

  /* full-height screens */
  const scrVideo = () => `<div class="kp-scr kp-video" data-scr="video">
      <div class="kp-vbg">${img('video', '', '')}</div>${status('9:41')}
      <div class="kp-vtabs" aria-hidden="true"><span>Following</span><b>For You</b></div>
      <div class="kp-rail" aria-hidden="true"><span>${I.heart}<small>24.1K</small></span><span>${I.chat}<small>412</small></span><span>${I.save}<small>3,208</small></span><span>${I.share}<small>Share</small></span></div>
      <div class="kp-vcap"><button type="button" class="kp-tag" data-act="tag">${I.pin}Good Harvest · Doraville</button><b>@spicyfoodie_atl</b><p>this dry pot in Doraville is unreal 🌶️ lotus root soaks up all the mala #atlantafood #sichuan</p><small>♫ original sound – spicyfoodie_atl</small></div>
    </div>`;
  const scrHalf = (opts = {}) => `<div class="kp-scr kp-half" data-scr="half">
      <div class="kp-halfvid" data-zone="1" ${opts.m1 ? `data-mark="${opts.m1}"` : ''}>${img('video')}<span>@spicyfoodie_atl · Oct 28</span><button type="button" class="kp-hit" data-act="close" aria-label="Back to the video"></button></div>
      <div class="kp-sheet">
        <button type="button" class="kp-handle" data-act="up" aria-label="Swipe up for the full page" ${opts.m2 ? `data-mark="${opts.m2}"` : ''}></button>
        ${placeHead()}
        ${stats('data-zone="2"')}
        ${opts.noDishes ? '' : dishes('data-zone="3"', opts.mTile ? `data-mark-tile="${opts.mTile}"` : '').replace('class="kp-link" data-act="viewall"', `class="kp-link" data-act="viewall" ${opts.mAll ? `data-mark="${opts.mAll}"` : ''}`)}
        ${reviews('data-zone="4"', opts.noDishes ? 2 : 1)}
      </div>
    </div>`;
  const scrFull = () => `<div class="kp-scr kp-full" data-scr="full">
      <div class="kp-fullhead">${status('9:41')}${topbar()}</div>
      <nav class="kp-tabs" data-zone="1" aria-label="Place page tabs"><button type="button" data-tab="ov" class="is-on">Overview</button><button type="button" data-tab="di">Dishes</button><button type="button" data-tab="co">Combos</button><button type="button" data-tab="re">Reviews</button><button type="button" data-tab="mp">More places</button></nav>
      <div class="kp-scroll">
        <div data-sec="ov">${placeHead('$20–50 · Doraville', false)}
        <p class="kp-raterow" data-zone="2"><span><i>${I.star}</i>4.6 Excellent (18)</span><span><em class="kp-green">Open</em> · until 11 PM ›</span></p>
        <div data-zone="3">${gettingThere()}</div></div>
        <div data-zone="4"><div data-sec="di">${dishes()}</div><div data-sec="co">${combos()}</div></div>
        <div data-sec="re">${reviews('', 2)}</div>
        <section class="kp-mod" data-sec="mp"><header><b>More places</b></header><p class="is-mute kp-small">Bo Bo Garden · Gu’s Kitchen · Chong Qing Hot Pot</p></section>
      </div>
      ${cta()}
    </div>`;
  const scrMenu = () => `<div class="kp-scr kp-menu" data-scr="menu">
      ${status('9:41', true)}<div class="kp-menuhead"><button type="button" class="kp-cir is-grey" data-act="back" aria-label="Back">${I.back}</button><b>Dishes</b><span></span></div>
      <nav class="kp-chips" data-zone="1">${MENU.map(([c], i) => `<button type="button" data-chip="${i}" class="${i ? '' : 'is-on'}">${c}</button>`).join('')}</nav>
      <div class="kp-scroll">${MENU.map(([c, rows], i) => `<section data-cat="${i}"><h4>${c}</h4>${rows.map((r, j) => {
        const d = typeof r[0] === 'string' && D[r[0]] ? Object.assign({ key: r[0], badge: r[1] }, D[r[0]]) : { name: r[0], price: r[1], img: r[2], badge: r[3], likes: r[4], note: r[5] };
        const hot = d.badge === 'Signature' && i === 0;
        return `<button type="button" class="kp-row" ${d.key ? `data-dish="${d.key}"` : ''} ${i === 0 && j === 0 ? 'data-zone="2"' : ''}>${img(d.img, '', d.name)}<span><b>${esc(d.name)}</b><em class="${d.badge === 'Signature' ? '' : 'is-alt'}">${d.badge}</em><small class="${hot && d.likes > 100 ? 'is-hot' : ''}">${d.likes}${I.thumb}</small><i>“${esc(d.note)}”</i></span><strong>${d.price}</strong></button>`;
      }).join('')}</section>`).join('')}</div>
      ${cta()}
    </div>`;
  const scrDetail = (k = 'lotus', opts = {}) => {
    const d = D[k];
    return `<div class="kp-scr kp-detail" data-scr="detail" data-dish-key="${k}">
      <div class="kp-scroll">
        <div class="kp-hero" data-zone="1">${img(d.img, '', d.name)}${status('9:41')}<div class="kp-topbar is-float"><button type="button" class="kp-cir" data-act="back" aria-label="Back">${I.back}</button><span class="kp-flex"></span><span class="kp-cir">${I.share}</span></div></div>
        <div class="kp-dcard">
          <p class="kp-dname"><b>${d.name}</b><em>Signature</em></p>
          <p class="kp-dprice"><b>${d.price}</b><span>· ${d.serves}</span><button type="button" class="kp-like" data-act="like" ${opts.mLike ? `data-mark="${opts.mLike}"` : ''} aria-pressed="false">${I.thumb}<span>${d.likes.toLocaleString('en-US')}</span></button></p>
          <p class="kp-dtags" data-zone="2">${d.tags.map(t => `<span>${t}</span>`).join('')}</p>
        </div>
        <div class="kp-dcard" data-zone="3"><header><b>What diners say</b><small>12 mention this dish</small></header>
          <p class="kp-who"><span class="kp-ava"></span><span><b>Lil Nisa</b><i class="kp-stars">★★★★★</i></span><small>Sep 27, 2026</small></p>
          <p class="kp-dtext">The <em>${d.name}</em> is black-pepper forward and really good — crispy edges, soaks up all the mala. We ordered it twice. Would come back for this alone… <span class="is-mute">more</span></p>
          <span class="kp-photos">${img('pork')}${img('mapo')}${img('noodle')}</span>
          <p class="kp-small is-mute kp-seeall">See all 12 reviews ›</p>
        </div>
        <div class="kp-more" data-zone="4"><p><b>More dishes</b></p><div class="kp-tiles">${TOP.filter(t => t !== k).slice(0, 3).map(t => `<button type="button" class="kp-tile" data-dish="${t}"><span class="kp-tile-img">${img(D[t].img)}</span><b>${D[t].name}</b></button>`).join('')}</div></div>
      </div>
      ${cta()}
      <div class="kp-dim" hidden></div><div class="kp-modal" hidden></div>
    </div>`;
  };
  const scrToday = () => `<div class="kp-scr kp-today" data-scr="today">
      <div class="kp-todayhead" data-zone="1">${status('9:01', true)}<div class="kp-topbar is-light"><span class="kp-cir">${I.back}</span><span class="kp-flex"></span><span class="kp-cir">${I.save}</span><span class="kp-cir">${I.share}</span><span class="kp-cir">${I.more}</span></div></div>
      <div class="kp-scroll"><div class="kp-todaybody">
        <b class="kp-big">Good Harvest</b>
        <p class="kp-small"><span class="kp-r">${I.star}</span><b>4.6 Excellent</b> <span class="is-mute">(18) ›</span></p>
        <p class="kp-small"><span class="kp-green">Open</span> · 12:00 PM – 11:00 PM · $20–50 · Chinese Restau… ›</p>
        <p class="kp-small">⌖ 5150 Buford Hwy C-120, Doraville, GA 30340, USA ›</p>
        <div class="kp-btnrow is-today" data-zone="2"><span>${I.map}Map</span><span>${I.phone}Call</span><span>${I.pen}Review</span><span>${I.save}Saved</span></div>
      </div>${reviews('', 2)}</div>
    </div>`;
  const scrFind = () => `<div class="kp-scr kp-find" data-scr="find">
      <div class="kp-scroll">
        <div class="kp-storehero" data-zone="2">${img('store', '', 'Good Harvest storefront')}${status('1:09')}<div class="kp-topbar is-float"><button type="button" class="kp-cir" data-act="back" aria-label="Back">${I.back}</button><span class="kp-flex"></span><span class="kp-cir">${I.share}</span></div></div>
        <div class="kp-findcard"><b>Good Harvest</b><p class="kp-small">5150 Buford Hwy NE C-120, Doraville, GA 30340 <span class="kp-teal">${I.pin}</span></p><p class="kp-small is-mute kp-sb"><span>Directions from the restaurant</span><span>Report</span></p></div>
        <ol class="kp-steps" data-zone="3">
          <li><p>Take Exit 32 (Chamblee Tucker Rd) off I-285, head toward Buford Hwy</p>${img('step1', '', 'Exit 32 sign on I-285')}</li>
          <li><p>Turn into the Asian Square plaza — look for the tall pylon sign on Buford Hwy</p>${img('step2', '', 'Plaza pylon sign on Buford Hwy')}</li>
          <li><p>Good Harvest is at the far end, suite C-120, under the blue tile roof</p>${img('store', '', 'Storefront under the blue tile roof')}</li>
        </ol>
      </div>
      ${cta()}
    </div>`;
  const phone = (inner, cls = '') => `<div class="kp-phone ${cls}" translate="no"><div class="kp-screen">${inner}</div><p class="kp-toast" role="status" aria-live="polite"></p></div>`;

  /* ---------- shared behaviour ---------- */
  const toastIn = (root) => { let t; return (msg) => { const el = root.querySelector('.kp-toast'); el.textContent = msg; el.classList.add('is-on'); clearTimeout(t); t = setTimeout(() => el.classList.remove('is-on'), 2600); }; };
  const ctaMsg = { ride: 'Opens Uber or Lyft with Good Harvest as the destination. From $20.', drive: 'Opens Maps with Good Harvest filled in. 18 min drive.' };
  // notes ↔ zones
  const bindZones = (wrap, phoneEl) => {
    let locked = null;
    const notes = () => [...wrap.querySelectorAll('.kp-notes [data-zone]')];
    const show = (n) => {
      wrap.classList.toggle('is-focus', !!n);
      phoneEl.querySelectorAll('.kp-scr.is-on [data-zone]').forEach(z => z.classList.toggle('is-lit', z.dataset.zone === n));
      notes().forEach(l => l.classList.toggle('is-on', l.dataset.zone === n));
    };
    wrap.addEventListener('pointerover', e => { const el = e.target.closest('.kp-notes [data-zone]'); if (el && !locked) show(el.dataset.zone); });
    wrap.addEventListener('pointerout', e => { const el = e.target.closest('.kp-notes [data-zone]'); if (el && !locked && !el.contains(e.relatedTarget)) show(null); });
    wrap.addEventListener('focusin', e => { const el = e.target.closest('.kp-notes [data-zone]'); if (el) show(el.dataset.zone); });
    wrap.addEventListener('focusout', e => { const el = e.target.closest('.kp-notes [data-zone]'); if (el) { locked = null; show(null); } });
    wrap.addEventListener('click', e => { const el = e.target.closest('.kp-notes [data-zone]'); if (el) { locked = locked === el.dataset.zone ? null : el.dataset.zone; show(locked); } });
    return { reset: () => { locked = null; show(null); } };
  };
  const setScreen = (phoneEl, name) => phoneEl.querySelectorAll('.kp-scr').forEach(s => s.classList.toggle('is-on', s.dataset.scr === name));
  const segs = (wrap, cur) => wrap.querySelectorAll('.kp-seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.go === cur ? 'true' : 'false'));
  const notesFor = (wrap, set) => wrap.querySelectorAll('.kp-notes').forEach(n => { n.hidden = n.dataset.set !== set; });
  const tabSpy = (scrEl) => {
    const scroll = scrEl.querySelector('.kp-scroll'), tabs = [...scrEl.querySelectorAll('[data-tab]')];
    if (!scroll || !tabs.length) return;
    let lock = 0;
    tabs.forEach(t => t.addEventListener('click', () => { const s = scroll.querySelector(`[data-sec="${t.dataset.tab}"]`); lock = Date.now(); tabs.forEach(x => x.classList.toggle('is-on', x === t)); scroll.scrollTo({ top: s.offsetTop - 4, behavior: 'smooth' }); }));
    scroll.addEventListener('scroll', () => { if (Date.now() - lock < 600) return; let cur = tabs[0]; tabs.forEach(t => { const s = scroll.querySelector(`[data-sec="${t.dataset.tab}"]`); if (s && s.offsetTop - 30 <= scroll.scrollTop) cur = t; }); tabs.forEach(x => x.classList.toggle('is-on', x === cur)); }, { passive: true });
  };
  const chipSpy = (scrEl) => {
    const scroll = scrEl.querySelector('.kp-scroll'), chips = [...scrEl.querySelectorAll('[data-chip]')], bar = scrEl.querySelector('.kp-chips');
    let lock = 0;
    const mark = (c) => { chips.forEach(x => x.classList.toggle('is-on', x === c)); bar.scrollTo({ left: c.offsetLeft - 12, behavior: 'smooth' }); };
    chips.forEach(c => c.addEventListener('click', () => { const s = scroll.querySelector(`[data-cat="${c.dataset.chip}"]`); lock = Date.now(); mark(c); scroll.scrollTo({ top: s.offsetTop - 2, behavior: 'smooth' }); }));
    scroll.addEventListener('scroll', () => { if (Date.now() - lock < 650) return; let cur = chips[0]; chips.forEach(c => { const s = scroll.querySelector(`[data-cat="${c.dataset.chip}"]`); if (s.offsetTop - 20 <= scroll.scrollTop) cur = c; }); if (!cur.classList.contains('is-on')) mark(cur); }, { passive: true });
  };

  /* ---------- modules ---------- */
  const modules = {
    /* Entry point: video → half sheet → full page, with today’s page to compare */
    entry(wrap) {
      const host = wrap.querySelector('[data-proto-phone]');
      host.innerHTML = phone(scrVideo() + scrHalf() + scrFull() + scrToday());
      const ph = host.firstElementChild, say = toastIn(ph), z = bindZones(wrap, ph);
      tabSpy(ph.querySelector('[data-scr="full"]'));
      const go = (s) => { setScreen(ph, s); segs(wrap, s); notesFor(wrap, s); z.reset(); const sc = ph.querySelector(`[data-scr="${s}"] .kp-scroll`); if (sc) sc.scrollTop = 0; ph.querySelector('[data-scr="half"] .kp-sheet').scrollTop = 0; };
      wrap.querySelectorAll('.kp-seg button').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
      ph.addEventListener('click', e => {
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'tag') go('half');
        else if (act === 'up') go('full');
        else if (act === 'close') go('video');
        else if (act === 'back') go('half');
        else if (act === 'viewall') say('View all opens the full menu (see System 1).');
        else if (ctaMsg[act]) say(ctaMsg[act]);
      });
      ph.addEventListener('click', e => { if (e.target.closest('.kp-tile')) say('Tapping a dish opens its detail (see System 1).'); });
      // swipe up/down on the half sheet
      const sheet = ph.querySelector('[data-scr="half"] .kp-sheet');
      let y0 = null;
      sheet.addEventListener('pointerdown', e => { y0 = e.clientY; });
      sheet.addEventListener('pointerup', e => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (dy < -40) go('full'); else if (dy > 50 && sheet.scrollTop <= 0) go('video'); });
      go('video');
    },

    /* System 1: place page dishes → full menu → dish detail */
    dishes(wrap) {
      const host = wrap.querySelector('[data-proto-phone]');
      const full = scrFull().replace('data-scr="full"', 'data-scr="place"');
      host.innerHTML = phone(full + scrMenu() + scrDetail('lotus'));
      const ph = host.firstElementChild, say = toastIn(ph), z = bindZones(wrap, ph);
      // re-zone the place page for this module: 1 header, 2 tiles, 3 combos
      const place = ph.querySelector('[data-scr="place"]');
      place.querySelectorAll('[data-zone]').forEach(el => el.removeAttribute('data-zone'));
      const dmod = place.querySelector('[data-sec="di"] .kp-mod');
      dmod.querySelector('header').setAttribute('data-zone', '1'); dmod.querySelector('.kp-upd').setAttribute('data-zone', '1');
      dmod.querySelector('.kp-tiles').setAttribute('data-zone', '2');
      place.querySelector('[data-sec="co"] .kp-mod').setAttribute('data-zone', '3');
      tabSpy(place); chipSpy(ph.querySelector('[data-scr="menu"]'));
      const history = [];
      let cur = 'place';
      const go = (s, push = true) => {
        if (push && cur !== s) history.push(cur);
        cur = s; setScreen(ph, s); segs(wrap, s); notesFor(wrap, s); z.reset();
        if (s === 'place') { const sc = place.querySelector('.kp-scroll'); sc.scrollTop = place.querySelector('[data-sec="di"]').offsetTop - 4; place.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('is-on', t.dataset.tab === 'di')); }
      };
      const openDish = (k) => { const old = ph.querySelector('[data-scr="detail"]'); const tmp = document.createElement('div'); tmp.innerHTML = scrDetail(k); old.replaceWith(tmp.firstElementChild); go('detail'); ph.querySelector('[data-scr="detail"] .kp-scroll').scrollTop = 0; };
      wrap.querySelectorAll('.kp-seg button').forEach(b => b.addEventListener('click', () => { history.length = 0; if (b.dataset.go === 'detail') openDish('lotus'); else go(b.dataset.go, false); }));
      ph.addEventListener('click', e => {
        const dish = e.target.closest('[data-dish]');
        if (dish) { openDish(dish.dataset.dish); return; }
        const row = e.target.closest('.kp-row');
        if (row) { say('This dish detail is not in the prototype. Try a Signature dish.'); return; }
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'viewall') go('menu');
        else if (act === 'back') go(history.pop() || 'place', false);
        else if (act === 'like') say('Likes count only after a check-in (see System 3).');
        else if (ctaMsg[act]) say(ctaMsg[act]);
      });
      requestAnimationFrame(() => go('place', false));
    },

    /* System 2: Find it → photo guide to the door */
    find(wrap) {
      const host = wrap.querySelector('[data-proto-phone]');
      host.innerHTML = phone(scrFull().replace('data-scr="full"', 'data-scr="place"') + scrFind());
      const ph = host.firstElementChild, say = toastIn(ph), z = bindZones(wrap, ph);
      const place = ph.querySelector('[data-scr="place"]');
      place.querySelectorAll('[data-zone]').forEach(el => el.removeAttribute('data-zone'));
      place.querySelector('.kp-findit').setAttribute('data-zone', '1');
      tabSpy(place);
      const go = (s) => { setScreen(ph, s); segs(wrap, s); z.reset(); const sc = ph.querySelector(`[data-scr="${s}"] .kp-scroll`); if (sc) sc.scrollTop = s === 'place' ? 60 : 0; };
      wrap.querySelectorAll('.kp-seg button').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
      ph.addEventListener('click', e => {
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'findit') go('find');
        else if (act === 'back') go('place');
        else if (ctaMsg[act]) say(ctaMsg[act]);
        else if (act === 'viewall') say('View all opens the full menu.');
      });
      // the Find it note also lives on the place page; zones 2 and 3 live on the guide
      wrap.addEventListener('click', e => { const n = e.target.closest('.kp-notes [data-zone]'); if (!n) return; const want = n.dataset.zone === '1' ? 'place' : 'find'; if (!ph.querySelector(`[data-scr="${want}"]`).classList.contains('is-on')) { go(want); requestAnimationFrame(() => n.click()); } });
      requestAnimationFrame(() => go('place'));
    },

    /* System 3: like → check-in → counted or declined */
    like(wrap) {
      const host = wrap.querySelector('[data-proto-phone]');
      const order = ['lotus', 'frog', 'fish', 'pork'];
      let i = 0, used = 0, here = true, busy = false;
      host.innerHTML = phone(scrDetail(order[0]));
      const ph = host.firstElementChild, say = toastIn(ph), z = bindZones(wrap, ph);
      const scr = () => ph.querySelector('[data-scr="detail"]');
      setScreen(ph, 'detail');
      const step = (n) => wrap.querySelectorAll('.kp-flowsteps li').forEach(li => li.classList.toggle('is-on', li.dataset.step === String(n)));
      const where = wrap.querySelectorAll('[data-where]');
      const setWhere = (v) => { here = v; where.forEach(b => b.setAttribute('aria-pressed', String((b.dataset.where === 'here') === v))); };
      where.forEach(b => b.addEventListener('click', () => { setWhere(b.dataset.where === 'here'); reset(false); }));
      const modal = (html) => { const s = scr(); s.querySelector('.kp-dim').hidden = !html; const m = s.querySelector('.kp-modal'); m.hidden = !html; m.innerHTML = html || ''; };
      const counter = () => `<span class="kp-progress">${[0, 1, 2].map(k => `<i class="${k < used ? 'is-on' : ''}"></i>`).join('')}</span><small>${used} of 3 for this visit</small>`;
      const reset = (newDish) => {
        if (newDish) { i = (i + 1) % order.length; const tmp = document.createElement('div'); tmp.innerHTML = scrDetail(order[i]); scr().replaceWith(tmp.firstElementChild); setScreen(ph, 'detail'); }
        modal(null); busy = false; step(1); z.reset();
      };
      ph.addEventListener('click', e => {
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'like' && !busy) {
          if (a.getAttribute('aria-pressed') === 'true') { say('Already recommended on this visit.'); return; }
          busy = true; step(2);
          modal(`<div class="kp-sheet2 is-small" data-zone="2"><p class="kp-checking">${I.pin}<b>Checking in…</b></p><small>Making sure you’re at Good Harvest</small></div>`);
          setTimeout(() => {
            if (!here) { step(3); modal(`<div class="kp-sheet2" data-zone="3"><button type="button" class="kp-x" data-act="close" aria-label="Close">${I.x}</button><span class="kp-ico is-pink">${I.pin}</span><b>Can’t recommend yet</b><p>You’re too far from Good Harvest. Only diners who’ve been here can recommend a dish.</p><button type="button" class="kp-btn is-red" data-act="save">Save to Want to try</button><button type="button" class="kp-btn" data-act="close">Got it</button></div>`); return; }
            if (used >= 3) { step(4); modal(`<div class="kp-sheet2"><button type="button" class="kp-x" data-act="close" aria-label="Close">${I.x}</button><span class="kp-ico is-grey">${I.check}</span><b>3 of 3 used</b><p>You’ve recommended 3 dishes on this visit. Picking makes a rec mean something.</p><button type="button" class="kp-btn" data-act="close">Done</button></div>`); return; }
            used += 1; step(4);
            const like = scr().querySelector('.kp-like'); like.setAttribute('aria-pressed', 'true'); const n = like.querySelector('span'); n.textContent = (parseInt(n.textContent.replace(/,/g, ''), 10) + 1).toLocaleString('en-US');
            modal(`<div class="kp-sheet2" data-zone="4"><button type="button" class="kp-x" data-act="close" aria-label="Close">${I.x}</button><span class="kp-ico is-red">${I.check}</span><b>Recommended</b><p>Checked in at Good Harvest. You can recommend up to 3 dishes per visit.</p><div class="kp-count">${counter()}</div><button type="button" class="kp-btn" data-act="close">Done</button>${used < 3 ? `<button type="button" class="kp-btn is-ghost" data-act="next">Try another dish ›</button>` : ''}</div>`);
          }, 1100);
        } else if (act === 'close') { modal(null); busy = false; step(1); }
        else if (act === 'save') { modal(null); busy = false; step(1); say('Saved to Want to try. It comes back when you’re nearby at mealtime.'); }
        else if (act === 'next') reset(true);
        else if (act === 'back') say('Back to the place page.');
        else if (ctaMsg[act]) say(ctaMsg[act]);
        else if (e.target.closest('[data-dish]')) { /* handled below */ }
      });
      ph.addEventListener('click', e => { const d = e.target.closest('.kp-tile[data-dish]'); if (d && !busy) { i = order.indexOf(d.dataset.dish) - 1; reset(true); } });
      wrap.querySelector('[data-act="reset"]').addEventListener('click', () => { used = 0; i = -1; reset(true); });
      setWhere(true); step(1);
    },

    /* After the meal: notification → one-tap dish picker */
    ask(wrap) {
      const host = wrap.querySelector('[data-proto-phone]');
      const picks = ['lotus', 'frog', 'fish', 'pork', 'mapo', 'noodle'];
      host.innerHTML = phone(`<div class="kp-scr kp-lock is-on" data-scr="lock"><div class="kp-lockbg">${img('lotus')}</div>${status('9:41')}<p class="kp-date">Saturday, November 7</p><p class="kp-time">9:41</p>
          <button type="button" class="kp-notif" data-act="open"><span class="kp-app"></span><span><small>TikTok · now</small><b>How was Good Harvest?</b>Tap the dishes you had. No writing needed, takes 2 seconds.<span class="kp-nimgs">${img('lotus')}${img('frog')}${img('fish')}</span></span></button><p class="kp-lockhint">Tap the notification</p></div>
        <div class="kp-scr kp-pick" data-scr="pick">${status('9:41', true)}<div class="kp-menuhead"><button type="button" class="kp-cir is-grey" data-act="lock" aria-label="Back">${I.back}</button><b>Good Harvest · Doraville</b><span></span></div>
          <div class="kp-scroll"><p class="kp-promo">Write 50 more characters and add 1 photo to get $1 Promote coupon</p>
          <section class="kp-pickcard"><header><b>What did you order?</b><small><span data-count>0</span>/3 ${I.thumb}</small></header><p class="kp-small is-mute">Tap to recommend. You can submit with just this.</p>
          <div class="kp-pickgrid">${picks.map(k => `<button type="button" data-pick="${k}" aria-pressed="false">${img(D[k].img, '', D[k].name)}<span>${D[k].name}</span><i>${I.check}</i></button>`).join('')}</div></section>
          <section class="kp-rate"><b>Rate your experience</b><p class="kp-starbtns">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('')}</p><p class="kp-fake">Add a few words (optional)</p></section></div>
          <div class="kp-submitbar"><button type="button" class="kp-btn is-red" data-act="submit" disabled>Submit · 0 dishes</button></div></div>
        <div class="kp-scr kp-done" data-scr="done"><span class="kp-ico is-red">${I.check}</span><b>Thanks!</b><p data-done></p><button type="button" class="kp-btn" data-act="lock">Back to start</button></div>`);
      const ph = host.firstElementChild;
      const sel = new Set(), btn = ph.querySelector('[data-act="submit"]'), cnt = ph.querySelector('[data-count]'), say = toastIn(ph);
      const upd = () => { cnt.textContent = sel.size; btn.disabled = !sel.size; btn.textContent = `Submit · ${sel.size} dish${sel.size === 1 ? '' : 'es'}`; ph.querySelectorAll('[data-pick]').forEach(b => b.setAttribute('aria-pressed', String(sel.has(b.dataset.pick)))); };
      ph.addEventListener('click', e => {
        const p = e.target.closest('[data-pick]');
        if (p) { const k = p.dataset.pick; if (sel.has(k)) sel.delete(k); else if (sel.size < 3) sel.add(k); else say('Up to 3 dishes per visit.'); upd(); return; }
        const s = e.target.closest('[data-star]');
        if (s) { ph.querySelectorAll('[data-star]').forEach(b => b.classList.toggle('is-on', +b.dataset.star <= +s.dataset.star)); return; }
        const a = e.target.closest('[data-act]'); if (!a) return;
        if (a.dataset.act === 'open') setScreen(ph, 'pick');
        else if (a.dataset.act === 'lock') { sel.clear(); upd(); ph.querySelectorAll('[data-star]').forEach(b => b.classList.remove('is-on')); setScreen(ph, 'lock'); }
        else if (a.dataset.act === 'submit') { ph.querySelector('[data-done]').textContent = `${sel.size} visit-verified rec${sel.size === 1 ? '' : 's'} added to ${[...sel].map(k => D[k].name).join(', ')}.`; setScreen(ph, 'done'); }
      });
      upd();
    }
  };

  /* Scenario cards: static renders of the same screens, with the table’s numbers */
  const scenarios = () => {
    const sheetCant = `<div class="kp-sheet2" data-mark="6"><span class="kp-x">${I.x}</span><span class="kp-ico is-pink">${I.pin}</span><b>Can’t recommend yet</b><p>You’re too far from Good Harvest. Only diners who’ve been here can recommend a dish.</p><span class="kp-btn is-red">Save to Want to try</span><span class="kp-btn">Got it</span></div>`;
    const sheetOk = `<div class="kp-sheet2" data-mark="6"><span class="kp-x">${I.x}</span><span class="kp-ico is-red">${I.check}</span><b>Recommended</b><p>Checked in at Good Harvest. You can recommend up to 3 dishes per visit.</p><div class="kp-count" data-mark="7"><span class="kp-progress"><i class="is-on"></i><i></i><i></i></span><small>1 of 3 for this visit</small></div><span class="kp-btn">Done</span></div>`;
    const withModal = (html) => scrDetail('lotus').replace('<div class="kp-dim" hidden></div><div class="kp-modal" hidden></div>', `<div class="kp-dim"></div><div class="kp-modal">${html}</div>`);
    const map = {
      A1: scrHalf({ m1: '1', m2: '2', mAll: '4', mTile: '5' }),
      A2: scrHalf({ noDishes: true }),
      B1: withModal(sheetCant),
      B2: withModal(sheetOk)
    };
    document.querySelectorAll('[data-scen]').forEach(el => {
      el.innerHTML = `<div class="kp-mini">${phone(map[el.dataset.scen].replace('class="kp-scr', 'class="kp-scr is-on'), 'is-static')}</div>`;
      el.querySelectorAll('button').forEach(b => { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); });
      const tile = el.querySelector('[data-mark-tile] .kp-tile'); if (tile) tile.setAttribute('data-mark', el.querySelector('[data-mark-tile]').dataset.markTile);
    });
    // table rows light up the matching numbers
    document.querySelectorAll('.tk-actions tbody tr').forEach((tr, i) => {
      const n = String(i + 1);
      const on = (v) => document.querySelectorAll(`.tk-scen [data-mark="${n}"]`).forEach(m => m.classList.toggle('is-pulse', v));
      tr.addEventListener('pointerenter', () => on(true)); tr.addEventListener('pointerleave', () => on(false));
    });
  };

  document.querySelectorAll('[data-proto]').forEach(w => { const f = modules[w.dataset.proto]; if (f) { try { f(w); w.classList.add('is-live'); } catch (err) { console.error(err); } } });
  scenarios();
})();
