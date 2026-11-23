(function(){
  // section tabs
  var tabs=[].slice.call(document.querySelectorAll('.sw-tabs a'));
  var targets=tabs.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function spy(){var y=window.scrollY+120,on=-1;targets.forEach(function(t,i){if(t&&t.getBoundingClientRect().top+window.scrollY<=y)on=i;});
    tabs.forEach(function(a,i){a.classList.toggle('is-on',i===on);});}
  window.addEventListener('scroll',spy,{passive:true});spy();

  // flows: steps on the left, screen on the right
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('[data-flow]'),function(flow){
    var steps=[].slice.call(flow.querySelectorAll('.sw-step'));
    var shots=[].slice.call(flow.querySelectorAll('.sw-shot'));
    var i=0,timer=null,auto=!reduce,visible=false;
    function show(n){i=(n+steps.length)%steps.length;
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===i);s.setAttribute('aria-pressed',k===i?'true':'false');});
      shots.forEach(function(s,k){s.classList.toggle('is-on',k===i);if(Math.abs(k-i)<=1)s.loading='eager';});}
    function tick(){clearInterval(timer);if(auto&&visible)timer=setInterval(function(){show(i+1);},2200);}
    steps.forEach(function(s,k){s.addEventListener('click',function(){auto=false;clearInterval(timer);show(k);});});
    flow.addEventListener('mouseenter',function(){clearInterval(timer);});
    flow.addEventListener('mouseleave',tick);
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;
      if(visible)shots.forEach(function(s){s.loading='eager';});tick();},{threshold:.35}).observe(flow);}
  });
})();
