/* Chance AI · 09 Full case study: turn the board accordion into capsules + one viewer. */
(() => {
  const list = document.querySelector('#design-boards .cc-board-list');
  if (!list) return;
  const items = [...list.querySelectorAll(':scope > details')].map(d => ({
    label: d.querySelector('summary').textContent.trim(),
    figure: d.querySelector('figure')
  })).filter(i => i.figure);
  if (!items.length) return;

  const pills = document.createElement('div');
  pills.className = 'cb-pills';
  pills.setAttribute('role', 'tablist');
  pills.setAttribute('aria-label', 'Design boards');

  const viewer = document.createElement('div');
  viewer.className = 'cb-viewer';
  viewer.id = 'cb-viewer';
  viewer.setAttribute('role', 'tabpanel');
  viewer.hidden = true;
  viewer.innerHTML = '<div class="cb-viewer-bar"><strong></strong><span><a target="_blank" rel="noopener">Open full size</a><button type="button">Close</button></span></div><div class="cb-slot"></div>';
  const title = viewer.querySelector('strong');
  const full = viewer.querySelector('a');
  const slot = viewer.querySelector('.cb-slot');

  const buttons = items.map((item, i) => {
    const m = item.label.match(/^(\d+)\s*\/\s*(.+)$/);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cb-pill';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('aria-controls', 'cb-viewer');
    b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = m ? '<b></b><span></span>' : '<span></span>';
    if (m) { b.querySelector('b').textContent = m[1]; b.querySelector('span').textContent = m[2]; }
    else b.querySelector('span').textContent = item.label;
    pills.appendChild(b);
    return b;
  });

  let current = -1;
  const show = (i) => {
    if (i === current || i < 0) {
      current = -1; viewer.hidden = true;
      buttons.forEach(b => b.setAttribute('aria-selected', 'false'));
      return;
    }
    current = i;
    buttons.forEach((b, j) => { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    slot.replaceChildren(items[i].figure);
    const link = items[i].figure.querySelector('a');
    full.href = link ? link.href : '#';
    full.hidden = !link;
    title.textContent = buttons[i].querySelector('span').textContent;
    viewer.hidden = false;
    items[i].figure.scrollTop = 0;
  };

  buttons.forEach((b, i) => {
    b.addEventListener('click', () => show(i));
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = (i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
      buttons[n].focus();
    });
  });
  viewer.querySelector('button').addEventListener('click', () => { const b = buttons[current]; show(-1); if (b) b.focus(); });

  list.classList.add('is-enhanced');
  list.after(pills, viewer);
})();
