/* Scoped preview enhancement: ordinary images, states and links remain readable without JS. */
(()=>{
 const rail=document.querySelector('.portfolio-rail');
 if(rail){const group=document.createElement('div');group.className='portfolio-rail__section portfolio-rail__section--projects';group.innerHTML='<p class="portfolio-rail__section-title">Product design</p><nav class="portfolio-rail__nav" aria-label="Other case studies"><a class="portfolio-rail__link" href="axel.html" data-label="Axel SaaS"><span class="portfolio-rail__label">Axel SaaS</span></a><a class="portfolio-rail__link" href="chance.html" data-label="Chance AI"><span class="portfolio-rail__label">Chance AI</span></a><a class="portfolio-rail__link" href="deloitte.html" data-label="Deloitte x SCADpro"><span class="portfolio-rail__label">Deloitte x SCADpro</span></a></nav>';rail.append(group);}
 const isPreview=location.pathname.includes('/previews/axel-editorial/');
 if(isPreview) document.querySelectorAll('.portfolio-rail a,.mobile-menu-panel a').forEach(a=>{const h=a.getAttribute('href');if(h&&!h.startsWith('#')&&!h.startsWith('/')&&!/^[a-z]+:/i.test(h))a.href='/'+h;});
 document.querySelectorAll('[data-state-study]').forEach(study=>{
  const controls=study.querySelector('.ax-state-controls'),buttons=[...controls.querySelectorAll('button')],panels=[...study.querySelectorAll('[data-panel]')];
  const select=(key)=>{buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.state===key)));panels.forEach(p=>p.hidden=p.dataset.panel!==key);};
  controls.hidden=false;study.classList.add('is-enhanced');select('preview');buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.state)));
 });
 // Scroll follows normal document flow; only the current step and a gentle entrance respond.
 const scenes=[...document.querySelectorAll('.ax-scene')],storyLinks=[...document.querySelectorAll('.ax-story-nav a')];
 if(scenes.length){
  let queued=false;
  const updateStory=()=>{queued=false;const line=innerHeight*.38;let active=scenes[0];for(const scene of scenes){if(scene.getBoundingClientRect().top<=line)active=scene;}storyLinks.forEach(a=>{if(a.hash==='#'+active.id)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});};
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateStory);}},{passive:true});addEventListener('resize',updateStory);updateStory();
  if('IntersectionObserver' in window){const seen=new WeakSet();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||seen.has(entry.target))return;seen.add(entry.target);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)entry.target.animate([{transform:'translateY(12px)'},{transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'});observer.unobserve(entry.target);}),{threshold:.12});scenes.forEach(s=>observer.observe(s.querySelector('.ax-scene-visual')));}
 }
 // Shared cursor labels stay consistent for both SVG and raster originals.
 window.addEventListener('pointermove',e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const a=e.target.closest?.('[data-ax-image]');if(!a)return;const cursor=document.querySelector('[data-portfolio-cursor]');if(cursor){cursor.querySelector('[data-portfolio-cursor-label]').textContent='View image';cursor.dataset.hasLabel='true';}},{passive:true});
 const dialog=document.querySelector('.ax-dialog');if(!dialog?.showModal)return;
 const img=dialog.querySelector('img'),scroller=dialog.querySelector('.ax-dialog-scroll'),zoom=dialog.querySelector('[data-zoom]');let trigger;
 document.querySelectorAll('[data-ax-image]').forEach(a=>a.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();trigger=a;img.src=a.href;img.alt=a.querySelector('img')?.alt||'Original design';dialog.querySelector('[data-original]').href=a.href;dialog.classList.remove('is-zoomed');img.style.width='';zoom.setAttribute('aria-pressed','false');zoom.textContent='Zoom in';dialog.showModal();scroller.scrollTo(0,0);
 }));
 zoom.addEventListener('click',()=>{const active=dialog.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(active));zoom.textContent=active?'Fit width':'Zoom in';img.style.width=active?Math.max(img.naturalWidth,scroller.clientWidth*2)+'px':'';});
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
})();
