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
