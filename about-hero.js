/* About hero (Nov 28 2026): hand-drawn marks on the lede + the résumé capsule.
   Tap the capsule: the guide reacts, "types", answers, then the capsule grows to fill the screen, then opens the résumé (Google Drive). */
(() => {
  'use strict';
  const intro = document.querySelector('.ab-intro');
  if (!intro) return;
  const zh = () => document.documentElement.dataset.language === 'zh';
  const L = (p) => p[zh() ? 1 : 0];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const h1 = intro.querySelector('h1'), lede = intro.querySelector('.ab-lede');
  const cap = intro.querySelector('.ah-cap'), line = cap && cap.querySelector('.ah-line'), text = cap && cap.querySelector('.ah-text');
  const actor = cap && cap.querySelector('.gg-character');
  const fx = window.GalleryGuideEffects || { set(a, s) { a.dataset.state = s; }, gaze() {}, resetGaze() {} };
  const copy = { idle: ['See my résumé', '看看我的简历'], go: ['On my way!', '这就带你去！'], to: ['Taking you to', '小向导带你去'], dest: ['Résumé', '简历'] };
  let busy = false;

  const language = () => {
    h1.innerHTML = zh() ? '你好，<br>我是 Jamie<span class="ah-dot">。</span>' : 'Hello,<br>I’m Jamie<span class="ah-dot">.</span>';
    const complex = `<span class="ah-mark ah-mark-complex">${zh() ? '复杂的系统' : 'complex systems'}<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M150 8C110 1 40 3 14 18 -4 30 12 50 70 54s118-4 124-22C199 16 160 6 120 7"/></svg></span>`;
    const simple = `<span class="ah-mark ah-mark-simple">${zh() ? '简单好用' : 'feel simple'}<svg viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 9c14-5 25 3 39-1s24-5 38-1 22 3 37-2"/></svg></span>`;
    lede.innerHTML = zh() ? `我是产品设计师，擅长把${complex}变得${simple}。` : `I’m a product designer who makes ${complex} ${simple}.`;
    if (cap && !busy) text.textContent = L(copy.idle);
  };
  new MutationObserver(language).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  language();
  if (!cap) return;

  const write = (pair) => { cap.classList.remove('is-typing'); text.textContent = L(pair); line.classList.remove('is-writing'); void line.offsetWidth; line.classList.add('is-writing'); };
  const squash = () => { if (!reduce.matches) cap.animate([{ transform: 'scale(1)' }, { transform: 'scale(.95,.9)', offset: .25 }, { transform: 'scale(1.015,1.02)', offset: .65 }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.22,.8,.3,1)' }); };

  cap.addEventListener('pointerenter', () => { if (!busy) fx.set(actor, 'Curious'); });
  cap.addEventListener('pointerleave', () => { if (!busy) { fx.set(actor, 'Waiting'); fx.resetGaze(actor); } });

  const travel = (href) => {
    if (reduce.matches) { location.href = href; return; }
    const W = innerWidth, H = innerHeight, r = cap.getBoundingClientRect(), av = actor.getBoundingClientRect();
    const ov = document.createElement('div');
    ov.className = 'ah-travel';
    ov.innerHTML = `<div class="ah-veil"></div><div class="ah-sheet"></div><div class="ah-label"><span>${L(copy.to)}</span><strong>${L(copy.dest)}</strong></div>`;
    const sheet = ov.querySelector('.ah-sheet'), label = ov.querySelector('.ah-label');
    Object.assign(sheet.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const g = actor.cloneNode(true); g.setAttribute('aria-hidden', 'true'); g.dataset.state = 'Happy'; g.style.scale = '1';
    ov.append(g); document.body.append(ov); cap.style.visibility = 'hidden';
    ov.querySelector('.ah-veil').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    const size = 160, s0 = av.width / size;
    const pos = (x, y, sc, extra = '') => `translate(${x - size / 2}px, ${y - size / 2}px) scale(${sc}) ${extra}`;
    const sx = av.left + av.width / 2, sy = av.top + av.height / 2;
    // the capsule swells into a black page; the guide (now white) rides to the middle
    const sc = Math.hypot(W, H) / Math.min(r.width, r.height) * 1.1;
    sheet.animate([
      { transform: 'none', borderRadius: '999px' },
      { transform: 'scale(1.06,1.12)', borderRadius: '999px', offset: .2 },
      { transform: `translate(${W / 2 - r.left - r.width / 2}px, ${H / 2 - r.top - r.height / 2}px) scale(${sc})`, borderRadius: '0px' },
    ], { duration: 820, easing: 'cubic-bezier(.7,0,.25,1)', fill: 'forwards' });
    g.animate([
      { transform: pos(sx, sy, s0) },
      { transform: pos(sx + 20, sy - 60, s0 * 1.3, 'rotate(-8deg)'), offset: .3 },
      { transform: pos(W / 2, H / 2 - 120, .9, 'rotate(6deg)'), offset: .75 },
      { transform: pos(W / 2, H / 2 - 100, .9) },
    ], { duration: 900, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
    setTimeout(() => { label.style.top = `${H / 2 - 20}px`; label.classList.add('is-on'); g.dataset.state = 'Guiding'; }, 700);
    setTimeout(() => { location.href = href; }, 1650);
    addEventListener('pageshow', (ev) => { if (ev.persisted) { ov.remove(); cap.style.visibility = ''; busy = false; fx.set(actor, 'Waiting'); text.textContent = L(copy.idle); } }, { once: true });
  };

  cap.addEventListener('click', (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busy) return;
    busy = true;
    squash(); fx.set(actor, 'Celebrating');
    if (reduce.matches) { location.href = cap.href; return; }
    cap.classList.add('is-typing');
    setTimeout(() => { write(copy.go); fx.set(actor, 'Guiding'); }, 520);
    setTimeout(() => travel(cap.href), 1150);
  });
  // eyes follow the pointer around the hero
  intro.addEventListener('pointermove', (e) => { if (!busy) fx.gaze(actor, e.clientX, e.clientY); });
})();
