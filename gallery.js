(() => {
  const card = document.querySelector('.jeti-card');
  if (!card) return;
  const button = card.querySelector('button');
  const caption = card.querySelector('figcaption');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  button.addEventListener('pointermove', (event) => {
    if (reduced.matches || event.pointerType === 'touch') return;
    const bounds = button.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.setProperty('--jeti-x', `${x * 14}px`);
    card.style.setProperty('--jeti-y', `${y * 8}px`);
    card.style.setProperty('--jeti-r', `${x * 8}deg`);
  });
  button.addEventListener('pointerleave', () => {
    ['--jeti-x', '--jeti-y', '--jeti-r'].forEach(p => card.style.removeProperty(p));
  });
  button.addEventListener('click', () => {
    if (card.classList.contains('is-greeting')) return;
    clearTimeout(timer);
    card.classList.add('is-greeting');
    caption.textContent = 'Hello, human.';
    timer = setTimeout(() => {
      card.classList.remove('is-greeting');
      caption.textContent = 'Meet Jeti.';
    }, 1400);
  });
  new IntersectionObserver(entries => {
    card.classList.toggle('is-paused', !entries[0].isIntersecting);
  }).observe(card);
})();
