/* Gallery hero (Nov 28 2026): the homepage's capsule flow, pointed at the experiments.
   Tap the capsule → the guide types → Play / Reflect / Decide grow out under it → pick one → the guide answers
   and the page glides down to that experiment. The guide stays in the capsule. */
(() => {
  'use strict';
  const root = document.querySelector('.gl');
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const cap = $('.hf-capsule'), talk = $('.hf-talk'), line = $('.hf-line'), text = $('.hf-text'), fold = $('.hf-fold');
  const actor = $('.gg-character'), pillsBox = $('.hf-sub'), dock = $('.hf-dock'), pills = [...root.querySelectorAll('.hf-pill')], status = $('.ha-status');
  const fx = window.GalleryGuideEffects || { set(a, s) { a.dataset.state = s; }, gaze() {}, resetGaze() {}, tap() { return null; } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const zh = () => document.documentElement.dataset.language === 'zh';
  const L = (p) => p[zh() ? 1 : 0];

  const copy = {
    eyebrow: ['Gallery / Small experiments', 'Gallery / 小小实验'],
    idle: ['Ask my guide where to start', '问问小向导从哪开始'],
    hello: ['Pick one. I’ll take you there.', '选一个，我带你过去。'],
    tap: ['Hehe, that tickles.', '嘿嘿，好痒。'],
    impatient: ['A little space?', '给我一点空间？'],
    grumpy: ['Okay, okay.', '好啦，好啦。'],
    fold: ['Fold the guide away', '收起小向导'],
  };
  const items = [
    { verb: ['Play', '玩一玩'], name: ['The Awakening Loop', 'The Awakening Loop'], state: 'Happy', say: ['Let’s play!', '一起玩吧！'], intro: 'awakening.html', play: 'https://the-awakening-loop.vercel.app/', playLabel: ['Play the game', '直接玩游戏'] },
    { verb: ['Reflect', '想一想'], name: ['MoodLog', 'MoodLog'], state: 'Celebrating', say: ['Time to slow down.', '慢下来想一想。'], intro: 'moodlog.html', play: 'experiments/moodlog/', playLabel: ['Try the app', '直接试用'] },
  ];

  let step = 'idle', active = -1, current = copy.idle, sayTicket = 0, widthAnim = null, tapAnim = null, taps = 0, lastTap = 0, tapTimer = null;

  const squash = () => { if (!reduce.matches) cap.animate([{ transform: 'scale(1)' }, { transform: 'scale(.95,.9)', offset: .25 }, { transform: 'scale(1.015,1.02)', offset: .65 }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.22,.8,.3,1)' }); };
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
  const say = (pair, { typing = true } = {}) => {
    const ticket = ++sayTicket;
    if (!typing || reduce.matches) { write(pair); return Promise.resolve(); }
    morph(() => cap.classList.add('is-typing'));
    return new Promise((res) => setTimeout(() => { if (ticket === sayTicket) write(pair); res(); }, 520));
  };
  const mood = (s) => { if (taps < 5) fx.set(actor, s); };
  const lookAt = (el) => { const r = el.getBoundingClientRect(); fx.gaze(actor, r.left + r.width / 2, r.top + r.height / 2); };

  const open = async () => {
    if (step !== 'idle') { squash(); return; }
    step = 'choose'; root.dataset.step = step;
    squash();
    if (!reduce.matches) { if (tapAnim) tapAnim.cancel(); tapAnim = fx.tap(actor); }
    mood('Responding');
    await say(copy.hello);
    if (step !== 'choose') return;
    mood('Waiting');
    morph(() => { pillsBox.classList.remove('is-leaving'); pillsBox.hidden = false; fold.hidden = false; dock.dataset.open = 'true'; });
    talk.setAttribute('aria-expanded', 'true');
    status.textContent = zh() ? '已展开三个实验。' : 'Three experiments opened.';
  };
  const close = async () => {
    active = -1; step = 'idle'; root.dataset.step = step;
    pills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
    resetChoice(); choice.hidden = true;
    talk.setAttribute('aria-expanded', 'false');
    mood('Waiting'); fx.resetGaze(actor);
    if (!pillsBox.hidden) {
      if (reduce.matches) { pillsBox.hidden = true; dock.dataset.open = 'false'; }
      else { pillsBox.classList.add('is-leaving'); await new Promise((r) => setTimeout(r, 300)); morph(() => { pillsBox.hidden = true; pillsBox.classList.remove('is-leaving'); dock.dataset.open = 'false'; }); }
    }
    fold.hidden = true;
    if (step === 'idle') say(copy.idle, { typing: false });
    talk.focus({ preventScroll: true });
  };
  // After a pick: two ways in (read the intro page, or play it now). Choose one → it gets a tick → confirm appears.
  const choice = document.createElement('div');
  choice.className = 'gl-choice'; choice.hidden = true; choice.setAttribute('role', 'group');
  choice.innerHTML = `<button type="button" class="gl-opt" data-way="intro" aria-pressed="false"><span class="gl-box"><svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg></span><span class="gl-opt-icon"><svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor"><path d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z"/></svg></span><span class="gl-opt-label"></span></button>`
    + `<button type="button" class="gl-opt" data-way="play" aria-pressed="false"><span class="gl-box"><svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg></span><span class="gl-opt-icon"><svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"/></svg></span><span class="gl-opt-label"></span></button>`
    + `<a class="gl-go" hidden><span class="gl-go-label"></span><span class="gl-go-icon"><svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg></span></a>`;
  dock.after(choice);
  const opts = [...choice.querySelectorAll('.gl-opt')], go = choice.querySelector('.gl-go');
  let way = null;
  const fillChoice = () => {
    if (active < 0) return;
    const it = items[active];
    opts[0].querySelector('.gl-opt-label').textContent = zh() ? '看项目介绍' : 'See the project';
    opts[1].querySelector('.gl-opt-label').textContent = L(it.playLabel);
    go.querySelector('.gl-go-label').textContent = zh() ? '确认' : 'Confirm';
    choice.setAttribute('aria-label', zh() ? `怎么进入 ${L(it.name)}` : `How to open ${L(it.name)}`);
    if (way) {
      const href = way === 'intro' ? it.intro : it.play;
      go.href = href;
      const external = /^https?:/.test(href);
      if (external) { go.target = '_blank'; go.rel = 'noopener'; } else { go.removeAttribute('target'); go.removeAttribute('rel'); }
    }
  };
  const choose = (w) => {
    way = w;
    opts.forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.way === w)));
    fillChoice();
    if (go.hidden) { go.hidden = false; }
    mood('Celebrating');
    say(w === 'intro' ? ['Read the story first?', '先看看介绍？'] : ['Straight in!', '直接上手！'], { typing: false });
  };
  const resetChoice = () => { way = null; opts.forEach((o) => o.setAttribute('aria-pressed', 'false')); go.hidden = true; };
  opts.forEach((o) => {
    o.addEventListener('click', (e) => { if (e.detail) o.blur(); choose(o.dataset.way); });
    o.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') lookAt(o); });
    o.addEventListener('pointerleave', () => fx.resetGaze(actor));
  });
  go.addEventListener('pointerenter', () => { lookAt(go); mood('Celebrating'); });
  go.addEventListener('click', () => { mood('Guiding'); say(['Let’s go!', '出发！'], { typing: false }); squash(); });

  const pick = (i) => {
    if (i === active) return;
    active = i; step = 'pick'; root.dataset.step = step;
    pills.forEach((p, n) => p.setAttribute('aria-pressed', String(n === i)));
    mood(items[i].state);
    say(items[i].say);
    status.textContent = L(items[i].name);
    resetChoice(); fillChoice();
    if (choice.hidden) { choice.hidden = false; } else if (!reduce.matches) { choice.animate([{ opacity: .3, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  };

  talk.addEventListener('click', open);
  fold.addEventListener('click', close);
  pills.forEach((p, i) => {
    p.addEventListener('click', (e) => { if (e.detail) p.blur(); pick(i); });
    const preview = () => { lookAt(p); if (active < 0) mood(items[i].state); };
    const leave = () => { fx.resetGaze(actor); mood(active < 0 ? 'Waiting' : items[active].state); };
    p.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') preview(); });
    p.addEventListener('pointerleave', leave);
    p.addEventListener('focus', () => { if (p.matches(':focus-visible')) preview(); });
    p.addEventListener('blur', leave);
  });

  // Tapping the guide: tickled → needs space → grumpy, said in the capsule.
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
      fx.set(actor, active >= 0 ? items[active].state : 'Waiting');
      say(active >= 0 ? items[active].say : step === 'idle' ? copy.idle : copy.hello, { typing: false });
    }, 2400);
  });
  // Eyes follow the pointer anywhere in the hero.
  root.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') fx.gaze(actor, e.clientX, e.clientY); });
  root.addEventListener('pointerleave', () => fx.resetGaze(actor));

  const language = () => {
    $('.gl-eyebrow').textContent = L(copy.eyebrow);
    const curiosity = `<span class="gl-mark gl-mark-circle">${zh() ? '好奇心' : 'curiosity'}<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M150 8C110 1 40 3 14 18 -4 30 12 50 70 54s118-4 124-22C199 16 160 6 120 7"/></svg></span>`;
    const next = `<span class="gl-mark gl-mark-line">${zh() ? '下一次点击' : 'next click'}<svg viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 9c14-5 25 3 39-1s24-5 38-1 22 3 37-2"/></svg></span>`;
    $('.gl-hello').innerHTML = zh() ? `一点${curiosity}。<br>从${next}开始<span class="gl-dot">。</span>` : `A little ${curiosity}.<br>Your ${next}<span class="gl-dot">.</span>`;
    $('.gl-sub').textContent = zh() ? '选一个实验，我带你逛逛。' : 'Pick an experiment. I’ll show you around.';
    pills.forEach((p, i) => { p.querySelector('small').textContent = L(items[i].verb); p.querySelector('.hf-pill-label-name').textContent = L(items[i].name); p.querySelector('.hf-pill-short').textContent = L(items[i].verb); });
    fold.setAttribute('aria-label', L(copy.fold));
    actor.setAttribute('aria-label', zh() ? '和小向导打招呼' : 'Say hello to the little guide');
    text.textContent = L(current);
    if (active >= 0) fillChoice();
    // card copy the old gallery guide used to translate
    const tt = document.querySelector('[data-tt-card]');
    if (tt) tt.textContent = zh() ? '在 TikTok 上发现餐厅，却要离开去做决定。一个让决定留在 TikTok 里的店铺页。' : 'People find restaurants on TikTok, then leave to decide. A place page that keeps the decision in the app.';
    const summary = document.querySelector('.moodlog-overview>div:last-child>p:first-child');
    if (summary) summary.textContent = zh() ? '一个记录心情、留出反思空间的小应用。' : 'A small space to track your mood and reflect.';
  };
  new MutationObserver(language).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  language();
})();
