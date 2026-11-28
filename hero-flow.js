/* Homepage hero flow (Nov 28 2026)
   1. Tap the black capsule: it squashes, the guide reacts, "types", and its line wipes in left → right.
   2. Three split pills pop out underneath.
   3. Pick one: the guide answers in the capsule and the card (with its illustration) slides in.
   4. Confirm on the card to go to the case study.
   The guide stays in the capsule the whole time: it looks, changes expression and talks from there. */
(() => {
  'use strict';
  const root = document.querySelector('.hf');
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const cap = $('.hf-capsule'), talk = $('.hf-talk'), line = $('.hf-line'), text = $('.hf-text'), fold = $('.hf-fold');
  const actor = $('.gg-character'), pillsBox = $('.hf-sub'), dock = $('.hf-dock'), pills = [...root.querySelectorAll('.hf-pill')];
  const stage = $('.hf-stage'), card = $('.hf-card'), art = $('.hf-art img'), status = $('.ha-status');
  const fx = window.GalleryGuideEffects || { set(a, s) { a.dataset.state = s; }, gaze() {}, resetGaze() {}, tap() { return null; } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const zh = () => document.documentElement.dataset.language === 'zh';
  const L = (pair) => pair[zh() ? 1 : 0];

  const copy = {
    idle: ['Ask my guide about Jamie', '问问小向导关于 Jamie'],
    hello: ['Hi! Where should we start?', '嗨！想从哪里开始？'],
    again: ['Sure, pick another one.', '好呀，再选一个。'],
    tap: ['Hehe, that tickles.', '嘿嘿，好痒。'],
    impatient: ['A little space?', '给我一点空间？'],
    grumpy: ['Okay, okay.', '好啦，好啦。'],
    go: ['Let’s go!', '出发！'],
    pills: [['How I think', '我的思考方式'], ['How I explore', '我的探索方式'], ['What I notice', '我注意到的事']],
    short: [['Think', '思考'], ['Explore', '探索'], ['Notice', '细节']],
    fold: ['Fold the guide away', '收起小向导'],
  };
  const themes = [
    { state: 'Curious', say: ['First, I find the structure.', '先找到结构，再动手。'], num: ['01 / HOW I THINK', '01 / 我的思考方式'], title: ['I untangle things.', '理清复杂的事。'],
      text: ['Orders, priorities, and daily decisions. Finding a clearer structure is where I start.', '订单、优先级和日常决策。我从梳理清晰的结构开始。'],
      cta: ['See it in Axel', '看看 Axel'], href: 'axel.html', art: 'illustration-exploration/thread-guide-transparent-v2.png' },
    { state: 'Celebrating', say: ['I learn by building it.', '我在动手中思考。'], num: ['02 / HOW I EXPLORE', '02 / 我的探索方式'], title: ['I think by making.', '在动手中思考。'],
      text: ['Sometimes a working experiment says more than another page of ideas.', '有时，一个能动手玩的实验比一页想法更有说服力。'],
      cta: ['Open the Gallery', '探索 Gallery'], href: 'lab.html', art: 'illustration-exploration/making-guide-transparent-v2.png' },
    { state: 'Happy', say: ['The small states count too.', '小小的状态也很重要。'], num: ['03 / WHAT I NOTICE', '03 / 我注意到的事'], title: ['The little things matter.', '小小的细节也很重要。'],
      text: ['Selection, waiting, and failure states deserve the same care as the main flow.', '选择、等待和失败状态，值得与主流程同样的关注。'],
      cta: ['Explore the details', '看看细节'], href: 'chance.html#followup', art: 'illustration-exploration/detail-guide-transparent-v2.png' },
  ];

  let step = 'idle', active = -1, current = copy.idle, sayTicket = 0, widthAnim = null, tapAnim = null;
  let taps = 0, lastTap = 0, tapTimer = null;

  /* ---- motion helpers ---- */
  const squash = () => {
    if (reduce.matches) return;
    cap.animate([{ transform: 'scale(1)' }, { transform: 'scale(.95,.9)', offset: .25 }, { transform: 'scale(1.015,1.02)', offset: .65 }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(.22,.8,.3,1)' });
  };
  // The capsule (and the sub-pill under it) grows / shrinks smoothly to fit what the guide is saying.
  const morph = (change) => {
    const from = dock.getBoundingClientRect().width;
    if (widthAnim) widthAnim.cancel();
    change();
    const to = dock.getBoundingClientRect().width;
    if (reduce.matches || Math.abs(from - to) < 1) return;
    widthAnim = dock.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
    widthAnim.finished.then(() => { widthAnim = null; }).catch(() => {});
  };
  const write = (pair) => {
    current = pair;
    morph(() => { cap.classList.remove('is-typing'); text.textContent = L(pair); });
    line.classList.remove('is-writing'); void line.offsetWidth; line.classList.add('is-writing');
  };
  // Say a line: a short "typing" beat, then the words wipe in.
  const say = (pair, { typing = true } = {}) => {
    const ticket = ++sayTicket;
    if (!typing || reduce.matches) { write(pair); return Promise.resolve(); }
    morph(() => cap.classList.add('is-typing'));
    return new Promise((res) => setTimeout(() => { if (ticket === sayTicket) write(pair); res(); }, 520));
  };
  const mood = (s) => { if (taps < 5) fx.set(actor, s); };
  const lookAt = (el) => { const r = el.getBoundingClientRect(); fx.gaze(actor, r.left + r.width / 2, r.top + r.height / 2); };

  /* ---- steps ---- */
  const showPills = () => {
    morph(() => { pillsBox.classList.remove('is-leaving'); pillsBox.hidden = false; fold.hidden = false; dock.dataset.open = 'true'; });
    talk.setAttribute('aria-expanded', 'true');
  };
  const hidePills = () => new Promise((res) => {
    if (pillsBox.hidden) return res();
    if (reduce.matches) { pillsBox.hidden = true; dock.dataset.open = 'false'; return res(); }
    pillsBox.classList.add('is-leaving');
    setTimeout(() => { morph(() => { pillsBox.hidden = true; pillsBox.classList.remove('is-leaving'); dock.dataset.open = 'false'; }); res(); }, 300);
  });
  const fillCard = (i) => {
    const t = themes[i];
    card.dataset.i = String(i);
    art.src = t.art;
    $('.hf-number').textContent = L(t.num);
    $('.hf-title').textContent = L(t.title);
    $('.hf-copy').textContent = L(t.text);
    $('.hf-confirm-label').textContent = L(t.cta);
    const u = new URL(t.href, location.href); u.searchParams.set('lang', zh() ? 'zh' : 'en');
    $('.hf-confirm').href = u.href;
    root.querySelectorAll('.hf-dots i').forEach((d, n) => d.classList.toggle('is-on', n === i));
    const last = i === themes.length - 1, nx = $('.hf-next');
    nx.classList.toggle('is-back', last);
    nx.setAttribute('aria-label', last ? (zh() ? '回到第一个' : 'Back to the first theme') : (zh() ? '下一个' : 'Next theme'));
  };
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  const open = async () => {
    if (step !== 'idle') { squash(); return; }
    step = 'choose'; root.dataset.step = step;
    squash();
    if (!reduce.matches) { if (tapAnim) tapAnim.cancel(); tapAnim = fx.tap(actor); }
    mood('Responding');
    await say(copy.hello);
    if (step !== 'choose') return;
    mood('Waiting');
    showPills();
    status.textContent = zh() ? '已展开三个选项。' : 'Three options opened.';
  };
  const pick = (i, dir = 0) => {
    if (i === active) return;
    const first = active < 0;
    active = i; step = 'card'; root.dataset.step = step;
    pills.forEach((p, n) => p.setAttribute('aria-pressed', String(n === i)));
    mood(themes[i].state);
    say(themes[i].say);
    fillCard(i);
    stage.hidden = false;
    // First time: the card wipes in from the left (CSS default). Switching themes: a softer swap.
    card.classList.remove('is-swapping', 'from-left', 'from-right');
    if (!first) { void card.offsetWidth; card.classList.add('is-swapping'); if (dir) card.classList.add(dir > 0 ? 'from-right' : 'from-left'); }
    status.textContent = L(themes[i].title);
  };
  const unpick = () => {
    if (active < 0) return;
    active = -1; step = 'choose'; root.dataset.step = step;
    pills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
    stage.hidden = true;
    mood('Waiting');
    say(copy.again, { typing: false });
    pills[0].focus({ preventScroll: true });
  };
  const close = async () => {
    active = -1; step = 'idle'; root.dataset.step = step;
    stage.hidden = true;
    pills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
    talk.setAttribute('aria-expanded', 'false');
    mood('Waiting'); fx.resetGaze(actor);
    await hidePills();
    fold.hidden = true;
    if (step === 'idle') say(copy.idle, { typing: false });
    talk.focus({ preventScroll: true });
  };

  /* ---- wiring ---- */
  talk.addEventListener('click', open);
  fold.addEventListener('click', close);
  // Next arrow + swipe on the card cycle through the three themes.
  const step3 = (d) => pick((active + d + 3) % 3, d);
  $('.hf-next').addEventListener('click', (e) => {
    if (e.detail) e.currentTarget.blur(); // no lingering focus ring after a mouse/touch click
    if (active === themes.length - 1) pick(0, -1); else step3(1);
  });
  let sx = null, sy = 0;
  card.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; });
  card.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) step3(dx < 0 ? 1 : -1);
  });
  card.addEventListener('pointercancel', () => { sx = null; });
  pills.forEach((p, i) => {
    p.addEventListener('click', (e) => { if (e.detail) p.blur(); pick(i, active < 0 ? 0 : i > active ? 1 : -1); });
    const preview = () => { lookAt(p); if (active < 0) mood(themes[i].state); };
    const leave = () => { fx.resetGaze(actor); mood(active < 0 ? 'Waiting' : themes[active].state); };
    p.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') preview(); });
    p.addEventListener('pointerleave', leave);
    p.addEventListener('focus', () => { if (p.matches(':focus-visible')) preview(); });
    p.addEventListener('blur', leave);
  });
  const confirm = $('.hf-confirm');
  confirm.addEventListener('pointerenter', () => { lookAt(confirm); mood('Celebrating'); });
  confirm.addEventListener('pointerleave', () => { fx.resetGaze(actor); if (active >= 0) mood(themes[active].state); });
  confirm.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduce.matches) return;
    e.preventDefault();
    const href = confirm.href;
    mood('Celebrating'); say(copy.go, { typing: false }); squash();
    setTimeout(() => travel(href, active), 420);
  });

  /* ---- "Let's go": the card lifts and grows into the next page; the guide hops onto it and rides along ---- */
  const DEST = [['Axel', 'Axel'], ['Gallery', 'Gallery'], ['Chance AI · details', 'Chance AI · 细节']];
  const travelCard = (href, i) => {
    const W = innerWidth, H = innerHeight, r = card.getBoundingClientRect(), av = actor.getBoundingClientRect();
    const ov = document.createElement('div');
    ov.className = 'hf-travel hf-travel-d';
    ov.innerHTML = `<div class="hf-travel-veil"></div><div class="hf-sheet"></div><div class="hf-travel-label"><span>${zh() ? '小向导带你去' : 'Taking you to'}</span><strong>${L(DEST[i] || DEST[0])}</strong><span class="hf-travel-dots"><i></i><i></i><i></i></span></div>`;
    const sheet = ov.querySelector('.hf-sheet'), label = ov.querySelector('.hf-travel-label');
    Object.assign(sheet.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    sheet.append(card.cloneNode(true));
    const g = actor.cloneNode(true); g.tabIndex = -1; g.setAttribute('aria-hidden', 'true'); g.dataset.state = 'Happy'; g.className = 'gg-character hf-travel-guide';
    ov.append(g); document.body.append(ov); actor.style.visibility = 'hidden'; card.style.visibility = 'hidden';
    ov.querySelector('.hf-travel-veil').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    const size = 160, s0 = av.width / size, s1 = .7;
    const pos = (x, y, sc, extra = '') => `translate(${x - size / 2}px, ${y - size / 2}px) scale(${sc}) ${extra}`;
    const sx = av.left + av.width / 2, sy = av.top + av.height / 2;
    const perch = { x: r.right - 90, y: r.top - 40 };
    // guide hops onto the card's top edge
    g.animate([
      { transform: pos(sx, sy, s0) },
      { transform: pos((sx + perch.x) / 2, Math.min(sy, perch.y) - 110, s1 * .8, 'rotate(8deg)'), offset: .5 },
      { transform: pos(perch.x, perch.y, s1, 'scale(1.12,.86)'), offset: .85 },
      { transform: pos(perch.x, perch.y, s1) },
    ], { duration: 700, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' }).finished.then(() => {
      sheet.animate([{ transform: 'none' }, { transform: 'translateY(6px) scale(.99)' }, { transform: 'none' }], { duration: 260 });
      setTimeout(() => {
        // card grows into the next page; the guide rides up and out
        const sc = Math.max(W / r.width, H / r.height) * 1.05;
        sheet.animate([{ transform: 'none', borderRadius: '28px' }, { transform: `translate(${W / 2 - r.left - r.width / 2}px, ${H / 2 - r.top - r.height / 2}px) scale(${sc})`, borderRadius: '0px' }],
          { duration: 750, easing: 'cubic-bezier(.7,0,.25,1)', fill: 'forwards' });
        sheet.firstChild.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
        g.animate([{ transform: pos(perch.x, perch.y, s1) }, { transform: pos(W / 2, H / 2 - 120, 1, 'rotate(-6deg)'), offset: .6 }, { transform: pos(W / 2, H / 2 - 90, 1) }],
          { duration: 750, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
        setTimeout(() => { label.style.top = `${H / 2 - 10}px`; label.classList.add('is-on'); g.dataset.state = 'Guiding'; }, 650);
        try { sessionStorage.setItem('hf-arrive', String(Date.now())); } catch {}
        setTimeout(() => { location.href = href; }, 1700);
      }, 260);
    }).catch(() => { location.href = href; });
    addEventListener('pageshow', (ev) => { if (ev.persisted) { ov.remove(); actor.style.visibility = ''; card.style.visibility = ''; } }, { once: true });
  };

  const travel = travelCard;


  // Tapping the guide itself: the old escalation (tickled → needs space → grumpy), said in the capsule.
  actor.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = performance.now();
    if (now - lastTap > 3000) taps = 0;
    lastTap = now; taps++;
    if (tapAnim) tapAnim.cancel();
    if (!reduce.matches) tapAnim = fx.tap(actor);
    const s = taps >= 10 ? 'Grumpy' : taps >= 5 ? 'Impatient' : 'Responding';
    fx.set(actor, s);
    const back = current;
    say(s === 'Grumpy' ? copy.grumpy : s === 'Impatient' ? copy.impatient : copy.tap, { typing: false });
    current = back;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      taps = 0; lastTap = 0;
      fx.set(actor, active >= 0 ? themes[active].state : 'Waiting');
      say(active >= 0 ? themes[active].say : step === 'idle' ? copy.idle : copy.hello, { typing: false });
    }, 2400);
  });

  // The guide's eyes follow the pointer anywhere in the hero.
  let raf = 0, px = 0, py = 0;
  root.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || e.target.closest('.hf-pill,.hf-confirm')) return;
    px = e.clientX; py = e.clientY;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; fx.gaze(actor, px, py); });
  });
  root.addEventListener('pointerleave', () => fx.resetGaze(actor));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (step === 'card') { e.preventDefault(); unpick(); }
    else if (step === 'choose') { e.preventDefault(); close(); }
  });



  const language = () => {
    $('#home-title').innerHTML = zh() ? '你好，我是 Jamie<span class="hf-dot">。</span>' : 'Hi, I’m Jamie<span class="hf-dot">.</span>';
    const clear = `<span class="hf-mark hf-mark-clear">${zh() ? '清晰' : 'clear'}<svg viewBox="0 0 120 14" preserveAspectRatio="none"><path pathLength="1" d="M3 9c14-5 25 3 39-1s24-5 38-1 22 3 37-2"/></svg></span>`;
    const intuitive = `<span class="hf-mark hf-mark-intuitive">${zh() ? '直观' : 'intuitive'}<svg viewBox="0 0 200 60" preserveAspectRatio="none"><path pathLength="1" d="M150 8C110 1 40 3 14 18 -4 30 12 50 70 54s118-4 124-22C199 16 160 6 120 7"/></svg></span>`;
    $('.hf-subline').innerHTML = zh() ? `为复杂系统，设计${clear}、${intuitive}的体验。` : `Designing ${clear}, ${intuitive} experiences for complex systems.`;
    pills.forEach((p, i) => { p.querySelector('.hf-pill-label').textContent = L(copy.pills[i]); p.querySelector('.hf-pill-short').textContent = L(copy.short[i]); });
    fold.setAttribute('aria-label', L(copy.fold));
    actor.setAttribute('aria-label', zh() ? '和小向导打招呼' : 'Say hello to the little guide');
    text.textContent = L(current);
    if (active >= 0) fillCard(active);
  };
  new MutationObserver(language).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  language();
})();
