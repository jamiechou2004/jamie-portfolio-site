/* Chance AI case study · v2: hide explanation text behind a + toggle.
   Without JS everything stays visible (the CSS only hides text under html.cv2). */
(() => {
  const page = document.querySelector('.chance-page');
  if (!page) return;
  const zh = () => document.documentElement.lang === 'zh-CN' || document.documentElement.lang === 'zh';
  const label = open => open ? (zh() ? '收起说明' : 'Hide details') : (zh() ? '展开说明' : 'Show details');

  const groups = [
    ['.delivery-grid article', 'h3', ':scope > p'],
    ['.cp-notes article', 'h3', ':scope > p'],
    ['.re-feature-copy', 'h3', ':scope > p:not(.cc-kicker)'],
    ['.re-lessons article', 'h3', ':scope > p:not(.cc-kicker), :scope > small'],
    ['.re-next li', 'h4', ':scope > div > p']
  ];

  let n = 0;
  for (const [itemSel, titleSel, bodySel] of groups) {
    for (const item of page.querySelectorAll(itemSel)) {
      const title = item.querySelector(titleSel);
      const bodies = [...item.querySelectorAll(bodySel)];
      if (!title || !bodies.length) continue;
      const id = `cv2-body-${++n}`;
      bodies.forEach((b, i) => { b.classList.add('cv2-body'); if (!i) b.id = id; });

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cv2-toggle';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', id);
      button.setAttribute('aria-label', label(false));

      const row = document.createElement('div');
      row.className = 'cv2-row';
      title.replaceWith(row);
      row.append(title, button);
      item.classList.add('cv2-item');

      const toggle = () => {
        const open = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', label(open));
      };
      button.addEventListener('click', e => { e.stopPropagation(); toggle(); });
      row.addEventListener('click', toggle);
    }
  }
  // Headlines that used <br> for stacking now sit on one line: keep a space instead.
  page.querySelectorAll('.re-feature-copy h3 br, .re-next h3 br').forEach(br => br.replaceWith(document.createTextNode(' ')));
  document.documentElement.classList.add('cv2');
})();
