(() => {
  const section = document.querySelector('#home');
  const friend = document.querySelector('.home-companion');
  if (!section || !friend) return;
  const message = friend.querySelector('.companion-message');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, timer, x = 0, y = 0, tx = 0, ty = 0, visible = false;
  function paint() {
    x += (tx - x) * .16; y += (ty - y) * .16;
    friend.style.left = `${x}px`; friend.style.top = `${y}px`;
    if (visible && (Math.abs(tx-x) + Math.abs(ty-y) > .2)) frame = requestAnimationFrame(paint);
    else frame = 0;
  }
  function position(event, snap = false) {
    const bounds = section.getBoundingClientRect();
    tx = Math.max(8, Math.min(bounds.width - 120, event.clientX - bounds.left + 24));
    ty = Math.max(8, Math.min(bounds.height - 148, event.clientY - bounds.top + 12));
    if (snap || reduced.matches) {x = tx; y = ty;}
    if (!frame) paint();
  }
  function show(event) {
    visible = true; message.textContent = 'Hello there!';
    position(event, true); friend.classList.add('is-visible');
  }
  function hide() {
    visible = false; friend.classList.remove('is-visible');
    cancelAnimationFrame(frame); frame = 0;
  }
  function mode() {
    hide(); section.classList.toggle('has-cursor-companion', fine.matches);
    section.classList.toggle('has-tap-companion', !fine.matches);
    friend.tabIndex = fine.matches ? -1 : 0;
    if (!fine.matches) {friend.style.left = '';friend.style.top = '';message.textContent = 'Tap to say hello';}
  }
  section.addEventListener('pointerenter', event => {if (fine.matches && event.pointerType !== 'touch') show(event);});
  section.addEventListener('pointermove', event => {if (fine.matches && visible) position(event);});
  section.addEventListener('pointerleave', () => {if (fine.matches) hide();});
  section.addEventListener('pointerdown', event => {
    if (fine.matches) return;
    clearTimeout(timer);friend.classList.add('is-visible');message.textContent = 'Hello there!';
    timer = setTimeout(() => {friend.classList.remove('is-visible');message.textContent = 'Tap to say hello';}, 2200);
  });
  friend.addEventListener('click', () => {if (!fine.matches) {friend.classList.add('is-visible');message.textContent = 'Hello there!';}});
  section.addEventListener('keydown', event => {if(event.key === 'Escape') hide();});
  fine.addEventListener('change', mode);window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => {if(document.hidden)hide();});
  mode();
})();
