/* Archived homepage 'Let's go' transitions (A portal, B picture, C capsule, E clay story).
   Not loaded anywhere. Live site uses D (travelCard in hero-flow.js). These functions ran inside
   hero-flow.js's closure (actor, card, say, mood, zh, L, DEST, TITLES, A, $o ...), kept here for reference. */

  /* ---- "Let's go" → the guide hops out of the capsule, leads you into a portal, the portal swallows the screen ---- */
  const travelPortal = (href, i) => {
    const av = actor.getBoundingClientRect();
    const W = innerWidth, H = innerHeight;
    const ov = document.createElement('div');
    ov.className = 'hf-travel';
    ov.innerHTML = `<div class="hf-travel-veil"></div><div class="hf-portal"></div><div class="hf-travel-label"><span>${zh() ? '小向导带你去' : 'Taking you to'}</span><strong>${L(DEST[i] || DEST[0])}</strong><span class="hf-travel-dots"><i></i><i></i><i></i></span></div>`;
    const g = actor.cloneNode(true);
    g.removeAttribute('id'); g.tabIndex = -1; g.setAttribute('aria-hidden', 'true'); g.dataset.state = 'Guiding';
    g.className = 'gg-character hf-travel-guide';
    ov.append(g);
    document.body.append(ov);
    actor.style.visibility = 'hidden';
    const size = 160, start = { x: av.left + av.width / 2, y: av.top + av.height / 2 };
    const portal = { x: W * 0.72, y: H * 0.56 };
    const s0 = av.width / size, s1 = Math.min(1.1, Math.max(.75, W / 1400));
    const at = (p, sc, extra = '') => `translate(${p.x - size / 2}px, ${p.y - size / 2}px) scale(${sc}) ${extra}`;
    const mid = (t, lift) => ({ x: start.x + (portal.x - start.x) * t, y: start.y + (portal.y - start.y) * t - lift });
    const pd = ov.querySelector('.hf-portal');
    pd.style.left = `${portal.x}px`; pd.style.top = `${portal.y + 34}px`;
    // 1. veil fades in, guide grows out of the capsule
    ov.querySelector('.hf-travel-veil').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    const hop = g.animate([
      { transform: at(start, s0), offset: 0 },
      { transform: at(mid(0, 40), s1 * .9, 'rotate(-6deg)'), offset: .14 },
      { transform: at(mid(.33, 0), s1, 'scale(1.08,.9)'), offset: .3 },
      { transform: at(mid(.55, 90), s1, 'rotate(6deg)'), offset: .44 },
      { transform: at(mid(.75, 0), s1, 'scale(1.08,.9)'), offset: .58 },
      { transform: at(mid(.9, 60), s1, 'rotate(-4deg)'), offset: .68 },
      { transform: at(portal, s1, 'scale(1.05,.94)'), offset: .78 },
      { transform: at({ x: portal.x, y: portal.y + 30 }, s1 * .2, 'rotate(20deg)'), offset: 1 },
    ], { duration: 1500, easing: 'cubic-bezier(.4,.1,.4,1)', fill: 'forwards' });
    // 2. portal opens on the floor while the guide is on its way
    pd.animate([{ transform: 'translate(-50%,-50%) scale(0,0)' }, { transform: 'translate(-50%,-50%) scale(1,.32)', offset: .6 }, { transform: 'translate(-50%,-50%) scale(1,.3)' }],
      { duration: 900, delay: 500, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'forwards' });
    // 3. guide jumps in, portal swallows the screen, label + loading dots
    hop.finished.then(() => {
      g.remove();
      const R = Math.hypot(Math.max(portal.x, W - portal.x), Math.max(portal.y, H - portal.y)) * 2.3 / 180;
      pd.animate([{ transform: 'translate(-50%,-50%) scale(1,.3)' }, { transform: 'translate(-50%,-50%) scale(1.25,.42)', offset: .25 }, { transform: `translate(-50%,-50%) scale(${R})` }],
        { duration: 650, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
      ov.classList.add('is-through');
      try { sessionStorage.setItem('hf-arrive', String(Date.now())); } catch {}
      setTimeout(() => { location.href = href; }, 1050);
    }).catch(() => { location.href = href; });
    // safety: if you come back with the back button, clean up
    addEventListener('pageshow', (ev) => { if (ev.persisted) { ov.remove(); actor.style.visibility = ''; } }, { once: true });
  };
  /* ---- "Let's go": the card's clay illustration lifts to centre stage, the guide hops out of the capsule
     into the picture (onto its clay twin), then the camera pushes in through the guide into black. ---- */
  const GUIDE_AT = [[.83, .56], [.87, .56], [.85, .6]]; // where the clay guide sits in each illustration
  const travelPicture = (href, i) => {
    const W = innerWidth, H = innerHeight;
    const from = art.getBoundingClientRect(), av = actor.getBoundingClientRect();
    const ratio = (art.naturalHeight || 1024) / (art.naturalWidth || 1536);
    const w = Math.min(W * (W < 700 ? .92 : .62), 920), h = w * ratio;
    const to = { left: (W - w) / 2, top: (H - h) / 2 - H * .04 };
    // object-fit: contain inside the card's art box → real drawn rect
    const fs = Math.min(from.width / (art.naturalWidth || 1536), from.height / (art.naturalHeight || 1024));
    const fw = (art.naturalWidth || 1536) * fs, fh = (art.naturalHeight || 1024) * fs;
    const fl = from.left + (from.width - fw) / 2, ft = from.top + (from.height - fh) / 2;

    const ov = document.createElement('div');
    ov.className = 'hf-travel hf-travel-b';
    ov.innerHTML = `<div class="hf-travel-veil"></div><div class="hf-scene"><img alt="" src="${art.src}"></div><div class="hf-hole"></div>
      <div class="hf-travel-label"><span>${zh() ? '小向导带你去' : 'Taking you to'}</span><strong>${L(DEST[i] || DEST[0])}</strong><span class="hf-travel-dots"><i></i><i></i><i></i></span></div>`;
    const scene = ov.querySelector('.hf-scene'), hole = ov.querySelector('.hf-hole'), label = ov.querySelector('.hf-travel-label');
    Object.assign(scene.style, { left: `${to.left}px`, top: `${to.top}px`, width: `${w}px`, height: `${h}px` });
    label.style.top = `${to.top + h + 8}px`;
    const g = actor.cloneNode(true);
    g.tabIndex = -1; g.setAttribute('aria-hidden', 'true'); g.dataset.state = 'Happy';
    g.className = 'gg-character hf-travel-guide';
    ov.append(g);
    document.body.append(ov);
    actor.style.visibility = 'hidden';
    art.style.visibility = 'hidden';

    const [gx, gy] = GUIDE_AT[i] || GUIDE_AT[0];
    const land = { x: to.left + w * gx, y: to.top + h * gy };
    const ease = 'cubic-bezier(.22,1,.36,1)';

    // 1. veil + the illustration lifts out of the card to centre stage
    ov.querySelector('.hf-travel-veil').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, fill: 'forwards' });
    scene.animate([
      { transform: `translate(${fl - to.left}px, ${ft - to.top}px) scale(${fw / w})`, borderRadius: '20px' },
      { transform: 'translate(0,0) scale(1.02)', offset: .8 },
      { transform: 'none' },
    ], { duration: 700, easing: ease, fill: 'both' });

    // 2. the guide hops out of the capsule into the picture, onto its clay twin
    const size = 160, s0 = av.width / size, s1 = (w * .13) / 80; // clay guide ≈ 13% of the picture's width
    const pos = (x, y, sc, extra = '') => `translate(${x - size / 2}px, ${y - size / 2}px) scale(${sc}) ${extra}`;
    const sx = av.left + av.width / 2, sy = av.top + av.height / 2;
    const hop = g.animate([
      { transform: pos(sx, sy, s0), opacity: 1 },
      { transform: pos(sx + (land.x - sx) * .3, Math.min(sy, land.y) - 120, s0 * 1.6, 'rotate(-8deg)'), offset: .35 },
      { transform: pos(sx + (land.x - sx) * .7, Math.min(sy, land.y) - 160, s1 * 1.1, 'rotate(8deg)'), offset: .65 },
      { transform: pos(land.x, land.y, s1, 'scale(1.12,.86)'), opacity: 1, offset: .9 },
      { transform: pos(land.x, land.y, s1), opacity: 0 },
    ], { duration: 900, delay: 380, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'both' });

    hop.finished.then(() => {
      g.remove();
      // the clay picture "catches" the guide
      scene.animate([{ transform: 'none' }, { transform: 'scale(1.025,.975)' }, { transform: 'none' }], { duration: 300, easing: 'ease-out' });
      label.classList.add('is-on');
      // 3. push in through the clay guide into black
      setTimeout(() => {
        label.classList.remove('is-on'); label.classList.add('is-off');
        scene.style.transformOrigin = `${gx * 100}% ${gy * 100}%`;
        scene.animate([{ transform: 'none', filter: 'blur(0)' }, { transform: 'scale(7)', filter: 'blur(2px)' }], { duration: 800, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
        Object.assign(hole.style, { left: `${land.x}px`, top: `${land.y}px` });
        const R = Math.hypot(Math.max(land.x, W - land.x), Math.max(land.y, H - land.y)) / 50;
        hole.animate([{ transform: 'translate(-50%,-50%) scale(0)' }, { transform: `translate(-50%,-50%) scale(${R})` }], { duration: 700, delay: 220, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
        try { sessionStorage.setItem('hf-arrive', String(Date.now())); } catch {}
        setTimeout(() => { location.href = href; }, 960);
      }, 650);
    }).catch(() => { location.href = href; });
    addEventListener('pageshow', (ev) => { if (ev.persisted) { ov.remove(); actor.style.visibility = ''; art.style.visibility = ''; } }, { once: true });
  };
  /* ---- C: the black capsule itself grows to fill the screen (Dynamic-Island style), the guide rides inside ---- */
  const travelCapsule = (href, i) => {
    const W = innerWidth, H = innerHeight, r = cap.getBoundingClientRect(), av = actor.getBoundingClientRect();
    const ov = document.createElement('div');
    ov.className = 'hf-travel hf-travel-c';
    ov.innerHTML = `<div class="hf-blob"></div><div class="hf-travel-label hf-on-dark"><span>${zh() ? '小向导带你去' : 'Taking you to'}</span><strong>${L(DEST[i] || DEST[0])}</strong><span class="hf-travel-dots"><i></i><i></i><i></i></span></div>`;
    const blob = ov.querySelector('.hf-blob'), label = ov.querySelector('.hf-travel-label');
    Object.assign(blob.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const g = actor.cloneNode(true); g.tabIndex = -1; g.setAttribute('aria-hidden', 'true'); g.dataset.state = 'Happy'; g.className = 'gg-character hf-travel-guide hf-guide-light';
    ov.append(g); document.body.append(ov); actor.style.visibility = 'hidden';
    const size = 160, s0 = av.width / size, s1 = Math.min(1.2, W / 1200);
    const pos = (x, y, sc, extra = '') => `translate(${x - size / 2}px, ${y - size / 2}px) scale(${sc}) ${extra}`;
    const sx = av.left + av.width / 2, sy = av.top + av.height / 2, cx = W / 2, cy = H / 2 - 40;
    // squash, then the pill swells to cover everything
    const sxS = W / r.width + .2, syS = H / r.height * 1.6;
    blob.animate([
      { transform: 'none', borderRadius: '999px' },
      { transform: 'scale(.97,.9)', borderRadius: '999px', offset: .12 },
      { transform: `translate(${cx - r.left - r.width / 2}px, ${cy - r.top - r.height / 2}px) scale(${Math.min(sxS, 3)}, ${Math.min(syS, 3)})`, borderRadius: '60px', offset: .5 },
      { transform: `translate(${cx - r.left - r.width / 2}px, ${H / 2 - r.top - r.height / 2}px) scale(${sxS}, ${syS})`, borderRadius: '0px' },
    ], { duration: 900, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
    g.animate([
      { transform: pos(sx, sy, s0) },
      { transform: pos(sx, sy, s0 * .9, 'scale(1.1,.85)'), offset: .12 },
      { transform: pos(cx, cy - 140, s1 * .9, 'rotate(-8deg)'), offset: .55 },
      { transform: pos(cx, cy - 70, s1, 'scale(1.1,.88)'), offset: .8 },
      { transform: pos(cx, cy - 70, s1) },
    ], { duration: 1100, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' }).finished.then(() => {
      g.dataset.state = 'Guiding'; label.style.top = `${cy + 30}px`; label.classList.add('is-on');
      try { sessionStorage.setItem('hf-arrive', String(Date.now())); } catch {}
      setTimeout(() => {
        g.animate([{ transform: pos(cx, cy - 70, s1) }, { transform: pos(W + 120, cy - 70, s1, 'rotate(10deg)') }], { duration: 500, easing: 'cubic-bezier(.6,0,.8,.4)', fill: 'forwards' });
        label.classList.add('is-off');
        setTimeout(() => { location.href = href; }, 420);
      }, 700);
    }).catch(() => { location.href = href; });
    addEventListener('pageshow', (ev) => { if (ev.persisted) { ov.remove(); actor.style.visibility = ''; } }, { once: true });
  };

  /* ---- E: Jamie's clay storyboard, animated: the clay guide (cut out of the frames) waddles in, a hole opens,
     it stops and peeks, squashes, leaps, dives head-first, its feet kick, clay bits pop, the hole swallows the screen,
     and it lands in the dark in front of the glowing project card. ---- */
  const TITLES = [['Axel', 'Axel'], ['Gallery', 'Gallery'], ['Chance AI', 'Chance AI']];
  const travelStory = (href, i) => {
    const W = innerWidth, H = innerHeight, src = (n) => `assets/transition/${n}`;
    const mh = Math.min(H * .3, W * .32, 250);           // mascot height
    const hw = mh * 1.55, hh = hw * .27;                 // hole size
    const hx = W * (W < 700 ? .62 : .58), hy = H * .64;  // hole centre
    const ground = hy - hh * .12;
    const ov = document.createElement('div');
    ov.className = 'hf-travel hf-travel-e';
    ov.innerHTML = `<div class="hf-travel-veil"></div>
      <div class="hf-e-hole"></div>
      <div class="hf-e-feet-clip"><img class="hf-e-feet" alt="" src="${src('guide-feet.png')}"></div>
      <div class="hf-e-clip"><div class="hf-e-shadow"></div><div class="hf-e-m"><div class="hf-e-body"><img class="hf-e-walk" alt="" src="${src('guide-walk.png')}"><img class="hf-e-peek" alt="" src="${src('guide-peek.png')}"></div><span class="hf-e-bang">!</span></div></div>
      <div class="hf-e-bits"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="hf-e-puffs"><i></i><i></i><i></i><i></i></div>
      <div class="hf-hole hf-e-swallow"></div>
      <div class="hf-f-dark"><div class="hf-e-scene"><img class="hf-f-arrive" alt="" src="${src('arrive.webp')}"><div class="hf-e-glow"></div>${i === 0 ? '' : `<div class="hf-f-sign">${L(TITLES[i] || TITLES[0])}</div>`}</div><span class="hf-travel-dots"><i></i><i></i><i></i></span></div>`;
    document.body.append(ov);
    actor.style.visibility = 'hidden';
    const $o = (c) => ov.querySelector(c), all = (c) => [...ov.querySelectorAll(c)];
    const A = (el, kf, o) => el.animate(kf, { fill: 'forwards', ...o });
    const set = (el, st) => Object.assign(el.style, st);
    const px = (v) => `${v}px`;

    // layout
    set($o('.hf-e-hole'), { left: px(hx - hw / 2), top: px(hy - hh / 2), width: px(hw), height: px(hh) });
    set($o('.hf-e-feet-clip'), { left: px(hx - hw / 2), top: px(hy - hh * 2.2), width: px(hw), height: px(hh * 2.32), overflow: 'hidden' });
    const fw = hw * .5; set($o('.hf-e-feet'), { width: px(fw), left: px(hw / 2 - fw / 2), top: px(hh * 2.32 - fw * .38) });
    $o('.hf-e-clip').style.clipPath = `inset(0 0 ${H - hy}px 0)`; // nothing shows below the hole's mouth
    const m = $o('.hf-e-m'), body = $o('.hf-e-body'), walk = $o('.hf-e-walk'), peek = $o('.hf-e-peek'), shadow = $o('.hf-e-shadow');
    const mw = mh * (406 / 410);
    set(m, { width: px(mw), height: px(mh), left: px(-mw / 2), top: px(-mh) });     // anchored at its feet
    const stopX = hx - hw / 2 - mw * .32;                  // where it stops, toes at the rim
    const startX = -mw;
    set(shadow, { width: px(mw * .8), height: px(mh * .07), left: px(-mw * .4), top: px(-mh * .035) });
    const place = (x, y) => `translate(${x}px, ${y}px)`;

    A($o('.hf-travel-veil'), [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });

    // 1. waddle in (outer moves; body bobs + tilts each step)
    const T0 = 150, walkMs = 1150, steps = 6;
    const track = [{ transform: place(startX, ground) }, { transform: place(stopX, ground) }];
    A(m, track, { duration: walkMs, delay: T0, easing: 'cubic-bezier(.3,.1,.4,1)' });
    A(shadow, track, { duration: walkMs, delay: T0, easing: 'cubic-bezier(.3,.1,.4,1)' });
    const bob = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps, up = k % 2 ? -mh * .07 : 0, rot = k % 2 ? (k % 4 === 1 ? -5 : 5) : 0;
      bob.push({ transform: `translateY(${up}px) rotate(${rot}deg) scale(${k % 2 ? '.98,1.03' : '1.03,.97'})`, offset: t });
    }
    bob[steps].transform = 'none';
    A(body, bob, { duration: walkMs, delay: T0, easing: 'ease-in-out', fill: 'none' });
    // dust puffs behind the feet
    all('.hf-e-puffs i').forEach((p, k) => {
      const t = T0 + walkMs * (.2 + k * .2), x = startX + (stopX - startX) * (.25 + k * .2) - mw * .2;
      set(p, { left: px(x), top: px(ground - 10) });
      A(p, [{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: .9, offset: .25 }, { transform: 'translate(-14px,-10px) scale(1.4)', opacity: 0 }], { duration: 600, delay: t, easing: 'ease-out' });
    });

    // 2. the hole opens in front of it
    A($o('.hf-e-hole'), [{ transform: 'scale(0,.2)' }, { transform: 'scale(1.08,1.1)', offset: .7 }, { transform: 'scale(1)' }], { duration: 520, delay: T0 + walkMs - 450, easing: 'cubic-bezier(.34,1.5,.64,1)' });

    // 3. stop, notice ("!"), swap to the peeking pose and lean over the edge
    const T1 = T0 + walkMs;
    A(body, [{ transform: 'none' }, { transform: 'scale(1.07,.92)' }, { transform: 'none' }], { duration: 220, delay: T1, easing: 'ease-out', fill: 'none' });
    A(walk, [{ opacity: 1 }, { opacity: 0 }], { duration: 90, delay: T1 + 120 });
    A(peek, [{ opacity: 0 }, { opacity: 1 }], { duration: 90, delay: T1 + 120 });
    A($o('.hf-e-bang'), [{ transform: 'translate(-50%,0) scale(0)', opacity: 0 }, { transform: 'translate(-50%,-10px) scale(1.2)', opacity: 1, offset: .3 }, { transform: 'translate(-50%,-6px) scale(1)', opacity: 1, offset: .75 }, { transform: 'translate(-50%,-6px) scale(1)', opacity: 0 }], { duration: 700, delay: T1 + 60 });
    A(body, [{ transform: 'none' }, { transform: 'rotate(6deg)', offset: .4 }, { transform: 'rotate(4deg)', offset: .6 }, { transform: 'rotate(8deg)' }], { duration: 650, delay: T1 + 220, easing: 'ease-in-out' });

    // 4. squash, leap, flip head-first into the hole (clipped at the hole's mouth)
    const T2 = T1 + 900;
    A(body, [{ transform: 'rotate(8deg)' }, { transform: 'rotate(4deg) scale(1.12,.84)' }], { duration: 160, delay: T2, easing: 'ease-in' });
    A(shadow, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: T2 + 160 });
    const apexX = (stopX + hx) / 2, apexY = ground - mh * .85;
    A(m, [
      { transform: place(stopX, ground) },
      { transform: `${place(apexX, apexY)} rotate(70deg)`, offset: .45 },
      { transform: `${place(hx, hy - mh * .2)} rotate(165deg)`, offset: .75 },
      { transform: `${place(hx, hy + mh * 1.3)} rotate(180deg)` },
    ], { duration: 720, delay: T2 + 160, easing: 'cubic-bezier(.3,0,.6,1)' });
    A(body, [{ transform: 'rotate(4deg) scale(1.12,.84)' }, { transform: 'rotate(0) scale(.9,1.14)', offset: .3 }, { transform: 'scale(.86,1.18)' }], { duration: 720, delay: T2 + 160 });

    // 5. splash: clay bits pop, the feet poke out and kick
    const T3 = T2 + 160 + 560;
    const cols = ['#2b2b2b', '#bdbdbd', '#6f9fd8', '#1f1f1f', '#9a9a9a'];
    all('.hf-e-bits i').forEach((b, k) => {
      const ang = -150 + k * 30, d = mh * (.45 + (k % 2) * .15);
      set(b, { left: px(hx), top: px(hy - hh * .2), background: cols[k] });
      A(b, [{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 },
        { transform: `translate(calc(-50% + ${Math.cos(ang * Math.PI / 180) * d}px), calc(-50% + ${Math.sin(ang * Math.PI / 180) * d}px)) rotate(${ang + 90}deg) scale(1)`, opacity: 1, offset: .45 },
        { transform: `translate(calc(-50% + ${Math.cos(ang * Math.PI / 180) * d * 1.15}px), calc(-50% + ${Math.sin(ang * Math.PI / 180) * d * .6 + mh * .35}px)) rotate(${ang + 150}deg) scale(.8)`, opacity: 0 }],
        { duration: 900, delay: T3 + k * 25, easing: 'cubic-bezier(.2,.8,.4,1)' });
    });
    const feet = $o('.hf-e-feet');
    A(feet, [{ transform: 'translateY(120%)' }, { transform: 'translateY(-6%) scaleY(1.08)', offset: .4 }, { transform: 'translateY(0)', offset: .55 },
      { transform: 'translateY(0) rotate(-6deg)', offset: .68 }, { transform: 'translateY(0) rotate(6deg)', offset: .8 }, { transform: 'translateY(0) rotate(0)', offset: .88 }, { transform: 'translateY(130%)' }],
      { duration: 1000, delay: T3, easing: 'ease-in-out' });

    // 6. the hole swallows the screen
    const T4 = T3 + 950;
    const sw = $o('.hf-e-swallow');
    set(sw, { left: px(hx), top: px(hy), width: px(hw), height: px(hh) });
    const big = Math.hypot(W, H) * 2.4 / hw;
    A(sw, [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(1.06,1.4)', offset: .2 }, { transform: `translate(-50%,-50%) scale(${big}, ${big * 3.6})`, opacity: 1 }],
      { duration: 650, delay: T4, easing: 'cubic-bezier(.7,0,.3,1)' });

    // 7. lands in the dark, the project card glows
    const T5 = T4 + 600;
    const R = 941 / 1672, narrow = W / H < 1, iw = narrow ? W / .52 : Math.max(W, H / R), ih = iw * R;  // cover; on portrait screens show the guide + card strip
    const scene = $o('.hf-e-scene'), arrive = scene;
    // phones: keep the card in view (anchor the crop on the card side)
    const ox = narrow ? -iw * .22 : (W - iw) / 2;
    set(scene, { left: px(ox), top: px((H - ih) / 2), width: px(iw), height: px(ih) });
    const sign = $o('.hf-f-sign');
    if (sign) set(sign, { left: '54.8%', top: '41.5%', width: '20.8%', height: '31%', borderRadius: px(ih * .03), fontSize: px(ih * (i === 2 ? .068 : .08)) });
    set($o('.hf-e-glow'), { left: '65%', top: '57%', width: px(iw * .5), height: px(iw * .5) });
    $o('.hf-f-dark .hf-travel-dots').style.top = px(H * .86);
    A($o('.hf-f-dark'), [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: T5 });
    A(arrive, [{ transform: 'scale(1.12) translateY(2%)' }, { transform: 'scale(1)' }], { duration: 1500, delay: T5, easing: 'cubic-bezier(.22,1,.36,1)' });
    A($o('.hf-e-glow'), [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.6)' }, { opacity: .9, transform: 'translate(-50%,-50%) scale(1.05)', offset: .5 }, { opacity: .55, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 1200, delay: T5 + 250, easing: 'ease-out' });
    try { sessionStorage.setItem('hf-arrive', String(Date.now() + 4000)); } catch {}
    setTimeout(() => { location.href = href; }, T5 + 1350);
    addEventListener('pageshow', (ev) => { if (ev.persisted) { ov.remove(); actor.style.visibility = ''; } }, { once: true });
  };

  // Which transition plays: ?transition=a|b|c|d (preview only), default D (card).
  const VARIANT = (new URLSearchParams(location.search).get('transition') || 'd').toLowerCase();
  const travel = (href, i) => {
    if (new URLSearchParams(location.search).has('transition')) { try { const u = new URL(href); u.searchParams.set('transition', VARIANT); href = u.href; } catch {} }
    ({ b: travelPicture, c: travelCapsule, d: travelCard, e: travelStory }[VARIANT] || travelPortal)(href, i);
  };
  // Small switcher while previewing
  if (new URLSearchParams(location.search).has('transition')) {
    const bar = document.createElement('div');
    bar.className = 'hf-variant-bar';
    bar.innerHTML = '<span>Transition</span>' + [['a', 'A · Portal'], ['b', 'B · Picture'], ['c', 'C · Capsule'], ['d', 'D · Card'], ['e', 'E · Clay story']].map(([k, n]) => `<a href="?transition=${k}" class="${k === VARIANT ? 'is-on' : ''}">${n}</a>`).join('');
    document.body.append(bar);
  }

