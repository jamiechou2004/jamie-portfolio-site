(()=>{'use strict';
const root=document.querySelector('.ha-hero');if(!root)return;
const actor=root.querySelector('.gg-character'),home=root.querySelector('.ha-home-slot'),homeBubble=root.querySelector('.ha-home-bubble'),grid=root.querySelector('.ha-cards'),cards=[...root.querySelectorAll('.ha-card')],fx=window.GalleryGuideEffects,reduce=matchMedia('(prefers-reduced-motion: reduce)');
let previewIndex=-1,suppressFocus=false;
const docks=cards.map(c=>{const d=document.createElement('div');d.className='ha-preview-dock';c.append(d);return d;});
const states=['Curious','Celebrating','Happy'];
const data=[{text:['Orders, priorities, and daily decisions. Finding a clearer structure is where I start.','订单、优先级和日常决策。我从梳理清晰的结构开始。'],cta:['See it in Axel','看看 Axel'],href:'axel.html'}, {text:['Sometimes a working experiment says more than another page of ideas.','有时，一个能动手玩的实验比一页想法更有说服力。'],cta:['Open the Gallery','探索 Gallery'],href:'lab.html'}, {text:['Selection, waiting, and failure states deserve the same care as the main flow.','选择、等待和失败状态，值得与主流程同样的关注。'],cta:['Explore the details','看看细节'],href:'chance.html#followup'}];
let active=-1,serial=0,motion=null,timer=null,taps=0,lastTap=0,tapMotion=null;const zh=()=>document.documentElement.dataset.language==='zh';
function state(s){fx.set(actor,s)}
function look(i){const r=cards[i].getBoundingClientRect();fx.gaze(actor,r.left+r.width/2,r.top+r.height/2)}
function clearHover(){cards.forEach(c=>c.classList.remove('is-hover'))}
function travelPreview(destination){
 const ticket=++serial,before=actor.getBoundingClientRect();if(motion)motion.cancel();if(tapMotion)tapMotion.cancel();destination.append(actor);
 const after=actor.getBoundingClientRect(),dx=before.left-after.left,dy=before.top-after.top;
 if(reduce.matches){motion=null;return;}
 motion=actor.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:`translate(${dx*.5}px,${dy*.5-40}px)`,offset:.5},{transform:'translate(0,0) scale(1.05,.94)',offset:.86},{transform:'translate(0,0)'}],{duration:420,easing:'ease-out'});
 motion.finished.then(()=>{if(ticket===serial)motion=null;}).catch(()=>{});
}
function restoreBubble(){cards.forEach(c=>c.querySelector('.ha-bubble').style.visibility='');}
function preview(i){
 if(suppressFocus||previewIndex===i)return;
 if(i===active){resetPreview();return;}
 previewIndex=i;clearHover();cards[i].classList.add('is-hover');homeBubble.hidden=true;
 // Keep the confirmed layout stable, but hide its speech while the guide previews elsewhere.
 if(active>=0)cards[active].querySelector('.ha-bubble').style.visibility='hidden';
 actor.tabIndex=-1;travelPreview(docks[i]);if(taps<5)state(states[i]);look(i);
}
function resetPreview(){
 clearHover();if(previewIndex>=0){previewIndex=-1;travelPreview(active>=0?cards[active].querySelector('.ha-slot'):home);}
 actor.tabIndex=0;restoreBubble();homeBubble.hidden=active>=0;
 if(taps<5)state(active>=0?states[active]:'Waiting');fx.resetGaze(actor);
}
async function select(i,focus=false){
 restoreBubble();const ticket=++serial;clearTimeout(timer);taps=0;lastTap=0;if(tapMotion)tapMotion.cancel();language();const before=actor.getBoundingClientRect();if(motion)motion.cancel();root.classList.add('is-travelling');clearHover();const prev=active;active=i;previewIndex=-1;actor.tabIndex=0;
 // Move the single actor before hiding the previous disclosure.
 const destination=i<0?home:cards[i].querySelector('.ha-slot');destination.append(actor);
 cards.forEach((c,n)=>{const open=n===i;c.classList.toggle('is-open',open);c.querySelector('.ha-trigger').setAttribute('aria-expanded',String(open));c.querySelector('.ha-panel').hidden=!open});
 if(i<0)delete grid.dataset.open;else grid.dataset.open=String(i);homeBubble.hidden=i>=0;state(i<0?'Waiting':states[i]);fx.resetGaze(actor);actor.setAttribute('aria-label',i<0?(zh()?'和小向导打招呼':'Say hello to the little guide'):(zh()?'让小向导返回':'Return the guide home'));
 const after=actor.getBoundingClientRect(),dx=before.left-after.left,dy=before.top-after.top;
 if(!reduce.matches){motion=actor.animate([{transform:`translate(${dx}px,${dy}px) scale(1)`},{transform:`translate(${dx*.5}px,${dy*.5-70}px) rotate(${dx>0?-7:7}deg)`,offset:.46},{transform:'translate(0,0) scale(1.08,.9)',offset:.85},{transform:'translate(0,0) scale(1)'}],{duration:580,easing:'cubic-bezier(.22,.7,.35,1)'});try{await motion.finished}catch{}}
 if(ticket!==serial)return;root.classList.remove('is-travelling');motion=null;root.querySelector('.ha-status').textContent=i<0?(zh()?'小向导回来了。':'The guide is back.'):(zh()?'已展开介绍。':'Introduction opened.');if(focus&&prev>=0){suppressFocus=true;cards[prev].querySelector('.ha-trigger').focus({preventScroll:true});suppressFocus=false;}
}
cards.forEach((c,i)=>{const b=c.querySelector('.ha-trigger');c.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')preview(i)});c.addEventListener('pointerleave',resetPreview);b.addEventListener('focus',()=>{if(b.matches(':focus-visible'))preview(i)});b.addEventListener('blur',resetPreview);c.addEventListener('click',e=>{if(e.target.closest('a,.gg-character'))return;select(active===i?-1:i)});});
function homeCopy(){const z=zh();homeBubble.querySelector('p').textContent=taps>=10?(z?'好啦，好啦。':'Okay, okay.'):taps>=5?(z?'给我一点空间？':'A little space?'):taps>0?(z?'选一张卡片，我带你看看。':'Pick a card. I’ll show you around.'):(z?'关于 Jamie 的三件小事。选一个，我带你看看。':'Three things about Jamie. Pick one, I’ll walk you there.');}
actor.addEventListener('click',()=>{
 if(active>=0){select(-1,true);return;}
 if(root.classList.contains('is-travelling'))return;
 clearTimeout(timer);const now=performance.now();if(now-lastTap>3000)taps=0;lastTap=now;taps++;
 if(tapMotion)tapMotion.cancel();if(!reduce.matches)tapMotion=fx.tap(actor);
 state(taps>=10?'Grumpy':taps>=5?'Impatient':'Responding');homeCopy();
 timer=setTimeout(()=>{taps=0;lastTap=0;if(active<0){state('Waiting');homeCopy();}},3000);
});
actor.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')fx.gaze(actor,e.clientX,e.clientY)});actor.addEventListener('pointerleave',()=>fx.resetGaze(actor));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(active>=0){e.preventDefault();select(-1,true)}else if(previewIndex>=0){e.preventDefault();resetPreview()}}});
function language(){const z=zh();root.querySelector('#home-title').textContent=z?'把复杂的系统，变成清晰、好用，也有点好玩的体验。':'I turn complex systems into clear, useful — and a little playful — experiences.';root.querySelector('.ha-eyebrow').textContent=z?'产品设计师':'PRODUCT DESIGNER';homeBubble.querySelector('p').textContent=z?'关于 Jamie 的三件小事。选一个，我带你看看。':'Three things about Jamie. Pick one, I’ll walk you there.';const nums=z?['01 / 我的思考方式','02 / 我的探索方式','03 / 我注意到的事']:['01 / HOW I THINK','02 / HOW I EXPLORE','03 / WHAT I NOTICE'];const titles=z?['理清<br>复杂的事。','在动手中<br>思考。','小小的细节<br>也很重要。']:['I untangle<br>things.','I think by<br>making.','The little things<br>matter.'];const invites=z?['找到线索','打开一个实验','再仔细看看']:['Find the thread','Open an experiment','Look a little closer'];cards.forEach((c,i)=>{c.querySelector('.ha-number').textContent=nums[i];c.querySelector('.ha-title').innerHTML=titles[i];c.querySelector('.ha-invite').textContent=invites[i];c.querySelector('.ha-bubble p').textContent=data[i].text[+z];const a=c.querySelector('a');a.textContent=data[i].cta[+z];const u=new URL(data[i].href,location.href);u.searchParams.set('lang',z?'zh':'en');a.href=u.href;});}
const updateLanguage=()=>{language();homeCopy();};
new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});language();
})();
