/* TikTok case study: part tabs scrollspy + honest-limit dot grid. */
(() => {
  const grid = document.querySelector('.tk-dotgrid');
  if (grid) {
    const miss = new Set([7, 23, 44, 58, 71]);
    for (let i = 0; i < 80; i++) {
      const d = document.createElement('i');
      if (miss.has(i)) d.className = 'is-miss';
      grid.appendChild(d);
    }
  }

  const links = [...document.querySelectorAll('.tk-tabs a')];
  const parts = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = parts[0];
    parts.forEach(p => { if (p.getBoundingClientRect().top + window.scrollY <= y) current = p; });
    links.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();

/* Interactive place page: notes and screen zones highlight each other; buttons explain themselves. */
(() => {
  const root = document.querySelector('[data-tp]');
  if (!root) return;
  const card = root.closest('.tk-today');
  const zones = [...root.querySelectorAll('.tp-zone')];
  const notes = [...card.querySelectorAll('.tp-notes li')];
  const toast = root.querySelector('.tp-toast');
  let locked = null, timer;
  const show = (n) => {
    root.classList.toggle('is-focus', !!n);
    zones.forEach(z => z.classList.toggle('is-on', z.dataset.zone === n));
    notes.forEach(l => l.classList.toggle('is-on', l.dataset.zone === n));
  };
  const say = (t) => { toast.textContent = t; toast.classList.add('is-on'); clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('is-on'), 2600); };
  const msg = {
    '1': 'Full screen: the video that made you hungry has stopped.',
    '2': 'Website · Map · Call · Review all look the same. Which one is the next step?'
  };
  [...notes, ...root.querySelectorAll('.tp-mark')].forEach(el => {
    el.addEventListener('pointerenter', () => { if (!locked) show(el.dataset.zone); });
    el.addEventListener('pointerleave', () => { if (!locked) show(null); });
    el.addEventListener('focus', () => show(el.dataset.zone));
    el.addEventListener('blur', () => { locked = null; show(null); });
    el.addEventListener('click', () => { locked = locked === el.dataset.zone ? null : el.dataset.zone; show(locked); if (locked) say(msg[locked]); });
  });
  root.querySelectorAll('.tp-btns button').forEach(b => b.addEventListener('click', () => {
    b.classList.add('is-tapped'); setTimeout(() => b.classList.remove('is-tapped'), 400);
    locked = '2'; show('2'); say(b.textContent + ' is one of four equal buttons. No primary action, no next step.');
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { locked = null; show(null); } });
})();
