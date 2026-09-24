/* Full-size original UI viewer; ordinary links remain usable without JS. */
(() => {
  const comparison = document.getElementById('structure');
  document.querySelectorAll('[data-compare-button]').forEach(button => {
    button.addEventListener('click', () => {
      comparison.dataset.compare = button.dataset.compareButton;
      comparison.querySelectorAll('[data-compare-button]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    });
  });
  const dialog = document.querySelector('.cp-full-dialog');
  if (!dialog || !dialog.showModal) return;
  let trigger;
  document.querySelectorAll('.chance-page a[href$=".png"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      const img = dialog.querySelector('img');
      img.src = link.href;
      img.alt = link.querySelector('img')?.alt || 'Complete original interface';
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => trigger?.focus({preventScroll:true}));
})();
