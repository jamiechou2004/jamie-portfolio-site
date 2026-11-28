/* Résumé page: title + buttons follow the site language. */
(() => {
  const zh = () => document.documentElement.dataset.language === 'zh';
  const t = document.querySelector('.rs-title'), pill = document.querySelector('.rs-pill span:last-child'), back = document.querySelector('.rs-back span:last-child');
  const lang = () => {
    t.innerHTML = zh() ? '简历<span class="ah-dot">。</span>' : 'Résumé<span class="ah-dot">.</span>';
    pill.textContent = zh() ? '下载 PDF' : 'Download PDF';
    back.textContent = zh() ? '关于我' : 'About';
  };
  new MutationObserver(lang).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
  lang();
})();
