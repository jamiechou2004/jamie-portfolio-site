/* Shared existing-guide effects, also used by the homepage exploration. */
window.GalleryGuideEffects={
 set(actor,state){actor.dataset.state=state;},
 gaze(actor,x,y){const r=actor.getBoundingClientRect();actor.style.setProperty('--gaze-x',Math.max(-5,Math.min(5,(x-r.left-r.width/2)/24))+'px');actor.style.setProperty('--gaze-y',Math.max(-4,Math.min(4,(y-r.top-r.height/2)/24))+'px');},
 resetGaze(actor){actor.style.setProperty('--gaze-x','0px');actor.style.setProperty('--gaze-y','0px');},
 tap(actor){return actor.animate([{transform:'scale(1)'},{transform:'scale(1.06,.91)',offset:.25},{transform:'translateY(-7px) scale(.98,1.04)',offset:.6},{transform:'scale(1)'}],{duration:360,easing:'ease-out'});}
};
(()=>{'use strict';
const root=document.querySelector('.gg-intro');if(!root)return;const actor=root.querySelector('.gg-character'),home=root.querySelector('.gg-home'),speech=root.querySelector('.gg-speech'),links=[...root.querySelectorAll('[data-project]')];let count=0,last=0,resetTimer,travelTimer,celebrateTimer,arrival=null,busy=false;
const recall=root.querySelector('.gg-recall');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');const zh=()=>document.documentElement.dataset.language==='zh';
const copy={away:['Out exploring.','正在探索中。'],recall:['Call back','召回小向导'],eyebrow:['Gallery / Small experiments','Gallery / 小小实验'],title:['A little <span class="gg-word">curiosity</span>.<br>Your next click.','一点<span class="gg-word">好奇心</span>。<br>从下一次点击开始。'],description:['Pick an experiment. I’ll show you around.','选一个实验，我带你逛逛。'],play:['Play','玩一玩'],reflect:['Reflect','想一想'],explore:['Explore','探索'],tonight:['Where Tonight','今晚去哪'],decide:['Decide','做决定'],hint:['Choose a project, or tap the little guide.','选一个项目，也可以戳戳小向导。']};
function set(state){actor.dataset.state=state;speech.textContent=state==='Impatient'?(zh()?'给我一点空间？':'A little space?'):state==='Grumpy'?(zh()?'好啦，好啦。':'Okay, okay.') : '';}
function language(){for(const [key,values]of Object.entries(copy)){const el=root.querySelector('[data-gg="'+key+'"]');if(el)el.innerHTML=values[zh()?1:0];}actor.setAttribute('aria-label',zh()?'和小向导打个招呼':'Say hello to the little guide');set(actor.dataset.state);updateTourLanguage();if(arrival)arrival.querySelector('p').textContent=zh()?'到了，试试看吧！':'You’re here. Take it for a spin.';}
function reset(){count=0;set('Waiting');}
let tapAnimations=[];
function tapFeedback(){
 tapAnimations.forEach(a=>a.cancel());
 const parts=[...actor.querySelectorAll('.gg-body,.gg-foot,.gg-eye,.gg-brows')];
 tapAnimations=parts.map(el=>el.animate(reduce.matches?[{opacity:1},{opacity:.65},{opacity:1}]:[{scale:'1 1',translate:'0 0'},{scale:'1.06 .90',translate:'0 4px',offset:.22},{scale:'.98 1.04',translate:'0 -7px',offset:.58},{scale:'1 1',translate:'0 0'}],{duration:reduce.matches?160:360,easing:'ease-out'}));
}
function gaze(e){
 if(e.pointerType==='touch')return;
 const r=actor.getBoundingClientRect();
 const x=Math.max(-5,Math.min(5,(e.clientX-r.left-r.width/2)/12));
 const y=Math.max(-4,Math.min(4,(e.clientY-r.top-r.height/2)/14));
 actor.style.setProperty('--gaze-x',x+'px');actor.style.setProperty('--gaze-y',y+'px');actor.dataset.tracking='true';
}
actor.addEventListener('pointermove',gaze);
actor.addEventListener('pointerleave',()=>{delete actor.dataset.tracking;actor.style.setProperty('--gaze-x','0px');actor.style.setProperty('--gaze-y','0px');});
actor.addEventListener('click',()=>{if(busy)return;tapFeedback();const now=performance.now();if(now-last>3000)count=0;last=now;count++;set(count>=10?'Grumpy':count>=5?'Impatient':'Responding');clearTimeout(resetTimer);resetTimer=setTimeout(reset,3000);});
const projectStates=['Happy','Celebrating','Curious','Happy'];
links.forEach(link=>{const expression=projectStates[Number(link.dataset.project)];const respond=()=>{if(!busy){root.dataset.typePreview=link.dataset.project;if(count<5)set(expression);}};link.addEventListener('pointerenter',respond);link.addEventListener('focus',respond);link.addEventListener('pointerleave',()=>{delete root.dataset.typePreview;if(!busy&&count<5)set('Waiting');});link.addEventListener('blur',()=>{delete root.dataset.typePreview;if(!busy&&count<5)set('Waiting');});link.addEventListener('click',e=>{delete root.dataset.typePreview;if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();bringHome();clearTimeout(resetTimer);clearTimeout(travelTimer);clearTimeout(celebrateTimer);count=0;busy=true;set('Guiding');const target=document.querySelector(link.hash);travelTimer=setTimeout(()=>{if(arrival){home.prepend(actor);arrival.remove();}arrival=document.createElement('div');arrival.className='gg-arrival';const note=document.createElement('p');note.setAttribute('role','status');note.textContent=zh()?'到了，试试看吧！':'You’re here. Take it for a spin.';arrival.append(actor,note);target.prepend(arrival);recall.hidden=false;history.pushState(null,'',link.hash);target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});const title=target.querySelector('h2');title.tabIndex=-1;title.focus({preventScroll:true});set(expression);celebrateTimer=setTimeout(()=>{set('Waiting');busy=false;},1800);},reduce.matches?0:260);});});
function bringHome(){closeTour();home.prepend(actor);delete root.dataset.typePreview;clearTimeout(resetTimer);clearTimeout(travelTimer);clearTimeout(celebrateTimer);tapAnimations.forEach(a=>a.cancel());busy=false;if(arrival){home.prepend(actor);arrival.remove();arrival=null;}recall.hidden=true;delete actor.dataset.tracking;actor.style.setProperty('--gaze-x','0px');actor.style.setProperty('--gaze-y','0px');reset();}
recall.querySelector('button').addEventListener('click',()=>{bringHome();actor.focus({preventScroll:true});tapFeedback();});
window.addEventListener('popstate',()=>{bringHome();clearTimeout(travelTimer);clearTimeout(celebrateTimer);busy=false;if(arrival){home.prepend(actor);arrival.remove();arrival=null;}reset();});
let activeTour=null;
const tours=[];
function closeTour(){if(!activeTour)return;activeTour.panel.hidden=true;activeTour.button.setAttribute('aria-expanded','false');activeTour=null;}
function updateTourLanguage(){for(const t of tours){t.button.textContent=zh()?'带我看看':'Show me around';t.intro.textContent=t.data.text[zh()?1:0];t.start.textContent=t.data.cta[zh()?1:0];t.close.textContent=zh()?'收起 ×':'Close ×';t.start.href=t.data.url+(t.data.id==='awakening'?'':zh()?(t.data.id==='moodlog'?'?lang=zh':''):'?lang=en');}
 const ttCard=document.querySelector('[data-tt-card]');if(ttCard)ttCard.textContent=zh()?'在 TikTok 上发现餐厅，却要离开去做决定。一个让决定留在 TikTok 里的店铺页。':'People find restaurants on TikTok, then leave to decide. A place page that keeps the decision in the app.';
 const summary=document.querySelector('.moodlog-overview>div:last-child>p:first-child');if(summary)summary.textContent=zh()?'一个记录心情、留出反思空间的小应用。':'A small space to track your mood and reflect.';
}
new MutationObserver(language).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});language();
})();