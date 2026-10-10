/* Optional presentation-language layer. Original English DOM is preserved in memory.
   Does not rewrite product screenshots, embedded experiences, URLs or product UI. */
(() => {
 'use strict';
 const dict=window.JAMIE_ZH||{}, key='jamie-portfolio-language';
 const supported=v=>v==='en'||v==='zh';
 const read=()=>{const q=new URL(location.href).searchParams.get('lang');if(supported(q))return q;try{const s=localStorage.getItem(key);if(supported(s))return s;}catch{}return 'en';};
 let language=read();
 const originals=new WeakMap(), attributes=new WeakMap();
 const normalize=s=>s.replace(/\s+/g,' ').trim();
 const skip='script,style,svg,code,pre,iframe,[translate="no"],[data-language-switch]';
 function translated(value){const k=normalize(value);if(!Object.hasOwn(dict,k))return value;return value.replace(k,dict[k])===value?dict[k]:value.replace(k,dict[k]);}
 function text(node){
   if(!node.parentElement||node.parentElement.closest(skip)||!node.nodeValue.trim())return;
   let saved=originals.get(node);const current=node.nodeValue;
   if(!saved||current!==saved.en&&current!==saved.zh){saved={en:current,zh:translated(current)};originals.set(node,saved);}
   const next=saved[language];if(current!==next)node.nodeValue=next;
 }
 function attr(el,name){
   if(!el.hasAttribute(name))return;
   let saved=attributes.get(el);if(!saved){saved={};attributes.set(el,saved);}
   const current=el.getAttribute(name);let pair=saved[name];
   if(!pair||current!==pair.en&&current!==pair.zh)pair=saved[name]={en:current,zh:translated(current)};
   if(current!==pair[language])el.setAttribute(name,pair[language]);
 }
 function visit(root){
   if(root.nodeType===Node.TEXT_NODE){text(root);return;}
   if(root.nodeType!==Node.ELEMENT_NODE||root.matches(skip))return;
   for(const name of ['aria-label','title','placeholder','alt','data-label'])attr(root,name);
   for(const node of root.childNodes)visit(node);
 }
 function syncLinks(){
  for(const a of document.querySelectorAll('a[href]')){
   const raw=a.getAttribute('href');if(!raw||raw.startsWith('#')||a.hasAttribute('download'))continue;
   const u=new URL(raw,location.href);
   if(u.origin!==location.origin||!/(?:\/|\/index.html|\/work.html|\/homepage.html|\/about.html|\/lab.html|\/chance.html|\/axel.html|\/honda.html|\/deloitte.html)$/.test(u.pathname))continue;
   u.searchParams.set('lang',language);const next=u.pathname+u.search+u.hash;if(next!==raw)a.setAttribute('href',next);
  }
 }
 function controls(){
  document.documentElement.lang=language==='zh'?'zh-CN':'en';document.documentElement.dataset.language=language;
  document.querySelectorAll('[data-set-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setLanguage===language)));
 }
 let observer;
 function apply(){observer?.disconnect();visit(document.body);visit(document.querySelector('title'));controls();syncLinks();observer?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt','data-label']});}
 function choose(next){
  if(!supported(next))return;language=next;
  try{localStorage.setItem(key,next);}catch{}
  const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(history.state,'',url);apply();
  document.querySelector('[data-language-status]').textContent=next==='zh'?'已切换至中文':'Switched to English';
 }
 function start(){
  const bar=document.createElement('div');bar.className='language-switch';bar.dataset.languageSwitch='';bar.setAttribute('role','group');bar.setAttribute('aria-label','Language / 语言');
  bar.innerHTML='<button type="button" lang="en" data-set-language="en" aria-label="English">EN</button><button type="button" lang="zh-CN" data-set-language="zh" aria-label="切换至中文">中文</button><span class="language-status" data-language-status role="status" aria-live="polite"></span>';
  document.body.append(bar);bar.addEventListener('click',e=>{const b=e.target.closest('[data-set-language]');if(b)choose(b.dataset.setLanguage);});
  observer=new MutationObserver(records=>{
   observer.disconnect();for(const r of records){if(r.type==='childList')r.addedNodes.forEach(visit);else if(r.type==='characterData')text(r.target);else visit(r.target);}
   observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt','data-label']});
  });apply();
  window.addEventListener('popstate',()=>{language=read();apply();});
  window.addEventListener('pageshow',()=>{language=read();apply();});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
