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
    $('.hf-next').setAttribute('aria-label', zh() ? '下一个' : 'Next theme');
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
  $('.hf-next').addEventListener('click', () => step3(1));
  let sx = null, sy = 0;
  card.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; });
  card.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) step3(dx < 0 ? 1 : -1);
  });
  card.addEventListener('pointercancel', () => { sx = null; });
  pills.forEach((p, i) => {
    p.addEventListener('click', () => pick(i, active < 0 ? 0 : i > active ? 1 : -1));
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
    setTimeout(() => { location.href = href; }, 380);
  });

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


  /* ---- Tap the hello: hand-drawn flowers bloom where you tapped ---- */
  const bloom = $('.hf-bloom'), title = $('#home-title');
  const INK = '#2a2a2a';
  const FLOWERS = [
    // daisy
    (c) => `<svg viewBox="0 0 80 110"><path class="st" d="M40 58c-2 16 3 32-1 48"/><path class="lf" fill="${c.leaf}" d="M39 86c-10-2-17-9-18-17 9 0 16 6 18 17z"/>${[0,51,103,154,206,257,309].map(a=>`<g transform="rotate(${a} 40 38)"><ellipse class="pt" fill="${c.petal}" cx="40" cy="22" rx="7.5" ry="15"/></g>`).join('')}<circle class="ct" fill="${c.mid}" cx="40.5" cy="38.5" r="7"/></svg>`,
    // tulip
    (c) => `<svg viewBox="0 0 80 110"><path class="st" d="M40 52c1 18-3 36 1 54"/><path class="lf" fill="${c.leaf}" d="M41 92c4-14 14-20 24-21-2 11-11 19-24 21z"/><path class="pt" fill="${c.petal}" d="M22 22c2 18 8 30 18 30s17-12 18-30c-6 4-10 8-12 13-2-8-4-15-6-19-3 4-5 11-6 19-3-6-7-10-12-13z"/></svg>`,
    // loopy five-petal
    (c) => `<svg viewBox="0 0 80 110"><path class="st" d="M40 56c-3 14 2 30-2 50"/><path class="lf" fill="${c.leaf}" d="M39 80c-12 1-19-5-21-13 10-1 18 4 21 13z"/><path class="pt" fill="${c.petal}" d="M40 37c-9-11-6-27 1-27s10 15-1 27c10-8 26-6 27 2s-15 11-27 1c11 9 9 25 2 26s-12-13-2-26c-8 11-24 13-26 6s9-14 26-9c-13-1-19-12-15-17s15-1 15 17z"/><circle class="ct" fill="${c.mid}" cx="40" cy="38" r="5"/></svg>`,
    // sprig with buds
    (c) => `<svg viewBox="0 0 80 110"><path class="st" d="M38 106c4-26 0-52 6-82M41 70c-9-6-14-14-15-24M42 52c8-5 13-12 14-22"/><circle class="pt" fill="${c.petal}" cx="44" cy="18" r="8"/><circle class="pt" fill="${c.mid}" cx="25" cy="42" r="6"/><circle class="pt" fill="${c.petal}" cx="57" cy="27" r="6"/><path class="lf" fill="${c.leaf}" d="M40 88c-11-3-15-10-15-17 9 2 14 8 15 17z"/></svg>`,
  ];
  const PALETTES = [
    { petal: '#f6b7a6', mid: '#f2c94c', leaf: '#a9c49a' },
    { petal: '#f2a65a', mid: '#f7dd8a', leaf: '#9fbf8f' },
    { petal: '#c9b8ef', mid: '#f2c94c', leaf: '#b3cfa1' },
    { petal: '#f7d774', mid: '#ee9a5d', leaf: '#a9c49a' },
    { petal: '#9dc3e6', mid: '#f7dd8a', leaf: '#9fbf8f' },
  ];
  let bloomCount = 0;
  const plant = (x, y) => {
    const host = root.querySelector('.hf-intro').getBoundingClientRect();
    const n = 3 + Math.floor(Math.random() * 2);
    for (let k = 0; k < n; k++) {
      const f = document.createElement('span');
      f.className = 'hf-flower';
      const pal = PALETTES[(bloomCount + k) % PALETTES.length];
      f.innerHTML = FLOWERS[(bloomCount + k * 3) % FLOWERS.length](pal);
      const size = 46 + Math.random() * 30;
      const spread = (k - (n - 1) / 2) * 34 + (Math.random() * 16 - 8);
      f.style.cssText = `left:${x - host.left + spread}px;top:${y - host.top}px;--s:${size}px;--r:${(Math.random() * 36 - 18).toFixed(1)}deg;--d:${k * 70}ms;--fall:${(18 + Math.random() * 24).toFixed(0)}px`;
      f.querySelectorAll('path,circle,ellipse').forEach((el) => { el.setAttribute('stroke', INK); });
      bloom.append(f);
      setTimeout(() => f.remove(), 2600 + k * 70);
    }
    bloomCount += n;
    if (bloom.childElementCount > 40) [...bloom.children].slice(0, 12).forEach((c) => c.remove());
  };
  title.addEventListener('click', (e) => { if (!reduce.matches) plant(e.clientX, e.clientY); });

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
