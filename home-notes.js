(() => {
 const section=document.querySelector('.personal-notes');
 const cards=[...section.querySelectorAll('.personal-note')];
 const friend=section.querySelector('.notes-companion');
 let pinned=null;
 function activate(card){
  cards.forEach(c=>{const open=c===card;c.classList.toggle('is-active',open);c.querySelector('button').setAttribute('aria-expanded',String(open));c.querySelector('.note-panel').hidden=!open;});
  section.classList.toggle('has-active',!!card);
  if(card)friend.style.left=`${card.offsetLeft+card.offsetWidth-85}px`;
 }
 cards.forEach(card=>{
  const button=card.querySelector('button');
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!pinned)activate(card);});
  card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!pinned)activate(null);});
  button.addEventListener('click',()=>{pinned=pinned===card?null:card;activate(pinned);});
 });
 section.addEventListener('keydown',e=>{if(e.key==='Escape'){const active=cards.find(c=>c.classList.contains('is-active'));pinned=null;activate(null);active?.querySelector('button').focus();}});
})();

// Keep the existing circular cursor throughout the navigation rail.
document.addEventListener('DOMContentLoaded', () => {
 const rail=document.querySelector('.portfolio-rail');
 rail?.addEventListener('pointerover',event=>{
  document.documentElement.classList.remove('np-native');
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const cursor=document.querySelector('[data-portfolio-cursor]');
  if(!cursor || event.target.closest('[data-work-in-progress]'))return;
  cursor.querySelector('span').textContent='';
  cursor.dataset.hasLabel='false';cursor.dataset.interactive=String(!!event.target.closest('a,button'));cursor.style.width='';
  cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;
  document.documentElement.classList.add('portfolio-cursor-active');
 });
});
