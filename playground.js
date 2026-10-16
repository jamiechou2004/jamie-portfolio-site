(()=>{
const $=s=>document.querySelector(s);
const space=$('#pg-space'),turn=$('#pg-turn'),paths=document.querySelectorAll('.pg-ribbon path');
function shape(){const n=Number(space.value),angle=Number(turn.value);paths[0].style.transform='translate('+(-n/2)+'px,'+(-n/3)+'px) rotate('+(-n/2)+'deg)';paths[1].style.transform='translate('+(n/2)+'px,'+(n/3)+'px) rotate('+(n/2)+'deg)';$('.pg-ribbon').style.transform='rotate('+angle+'deg)';$('#pg-space-value').value=n;$('#pg-turn-value').value=angle+'°';}
space.addEventListener('input',shape);turn.addEventListener('input',shape);$('#pg-shape-reset').onclick=()=>{space.value=turn.value=0;shape()};
const a=$('#pg-color-a'),b=$('#pg-color-b'),angle=$('#pg-angle');const palettes={blue:['#a8d5ff','#8c80ee'],warm:['#ffd19b','#e28ea8'],green:['#d8e8cd','#81a69c']};
function color(){const x=Number(angle.value);$('#pg-color-stage').style.background='linear-gradient('+x+'deg,'+a.value+','+b.value+')';$('#pg-angle-value').value=x+'°';document.querySelectorAll('[data-palette]').forEach(btn=>btn.setAttribute('aria-pressed',String(palettes[btn.dataset.palette][0]===a.value&&palettes[btn.dataset.palette][1]===b.value)));}
[a,b,angle].forEach(el=>el.addEventListener('input',color));document.querySelectorAll('[data-palette]').forEach(btn=>btn.onclick=()=>{[a.value,b.value]=palettes[btn.dataset.palette];color()});$('#pg-color-reset').onclick=()=>{[a.value,b.value]=palettes.blue;angle.value=135;color()};
let timer;const action=$('#pg-action'),status=$('#pg-status');
function reset(){clearTimeout(timer);action.disabled=false;action.dataset.state='ready';action.textContent='Try interaction ↗';status.textContent='Ready when you are.';}
function run(){clearTimeout(timer);action.disabled=true;action.dataset.state='working';action.textContent='Working…';status.textContent='A brief pause, with a clear state.';const success=$('input[name="pg-outcome"]:checked').value==='success';timer=setTimeout(()=>{action.disabled=false;action.dataset.state=success?'success':'error';action.textContent=success?'Done ✓ · Try again':'Try again ↻';status.textContent=success?'Complete. The interface confirms what happened.':'That didn’t work. You can retry or change the outcome.';},1100)}
action.addEventListener('click',run);$('#pg-response-reset').onclick=reset;document.querySelectorAll('[name="pg-outcome"]').forEach(el=>el.addEventListener('change',reset));window.addEventListener('pagehide',reset);
})();
