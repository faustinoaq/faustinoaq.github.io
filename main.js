(() => {
  'use strict';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const toggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const currentTheme = () => root.dataset.theme || (preference.matches ? 'dark' : 'light');
  function updateThemeControl() {
    const dark = currentTheme() === 'dark';
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
      toggle.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
    }
    const sym = toggle && toggle.querySelector('.theme-symbol');
    if (sym) sym.innerHTML = dark
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'
      : '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>';
    if (themeColor) themeColor.content = dark ? '#0b1218' : '#eaf2f6';
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const theme = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = theme;
      try { localStorage.setItem('theme', theme); } catch (error) { /* Storage is optional. */ }
      updateThemeControl();
    });
  }
  preference.addEventListener('change', updateThemeControl);
  window.addEventListener('storage', event => {
    if (event.key !== 'theme' && event.key !== null) return;
    if (event.newValue === 'dark' || event.newValue === 'light') root.dataset.theme = event.newValue;
    else delete root.dataset.theme;
    updateThemeControl();
  });
  updateThemeControl();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      // Never hide content already visible on the initial screen.
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        observer.disconnect();
        document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
      }
    });
  }
})();

/* Obfuscated e-mail: the address is not in the HTML source and is only decoded and shown when someone clicks "Show email". */
(function(){
  function dec(v){try{return atob(v).split('').reverse().join('')}catch(e){return ''}}
  document.querySelectorAll('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(a.getAttribute('href')&&a.getAttribute('href').indexOf('mailto:')===0)return;
      e.preventDefault();
      var addr=dec(a.getAttribute('data-mail'));if(!addr)return;
      var t=a.querySelector('.mail-text');if(t)t.textContent=addr;
      a.setAttribute('href','mailto:'+addr);a.setAttribute('aria-label','Email '+addr);
    });
  });
})();

(function(){var v=document.querySelector('.bg-video video');if(v&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();}})();

document.querySelectorAll('.places figure').forEach(f => {
  f.addEventListener('click', () => { const o = f.classList.contains('open'); document.querySelectorAll('.places figure.open').forEach(x => x.classList.remove('open')); if (!o) f.classList.add('open'); });
  f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.click(); } });
});
(() => {
  'use strict';
  document.querySelectorAll('[data-open]').forEach(btn => {
    const dlg = document.getElementById(btn.dataset.open);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    btn.hidden = false;
    btn.addEventListener('click', () => { dlg.showModal(); document.body.style.overflow = 'hidden'; });
    dlg.addEventListener('close', () => { document.body.style.overflow = ''; btn.focus(); });
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  });
})();
(() => {
  'use strict';
  // Places: photos are dimmed; hover, focus, press or a tap on touch screens brings one to full color.
  const figs = [...document.querySelectorAll('.places figure')];
  figs.forEach(f => f.addEventListener('click', () => {
    const on = f.classList.contains('open');
    figs.forEach(x => x.classList.remove('open'));
    if (!on) f.classList.add('open');
  }));
  // Arrows below the strip for mouse users; hidden when everything fits.
  const strip = document.querySelector('.places');
  if (!strip) return;
  const nav = document.createElement('div');
  nav.className = 'places-nav';
  const mk = (dir, d) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'places-arrow';
    b.setAttribute('aria-label', dir === -1 ? 'Previous photos' : 'Next photos');
    b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
    b.addEventListener('click', () => {
      const step = (strip.querySelector('figure') || strip).getBoundingClientRect().width + 24;
      strip.scrollBy({ left: dir * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    return b;
  };
  const prev = mk(-1, 'M19 12H5M11 6l-6 6 6 6'), next = mk(1, 'M5 12h14M13 6l6 6-6 6');
  nav.append(prev, next);
  strip.insertAdjacentElement('afterend', nav);
  const sync = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    nav.hidden = max <= 2;
    prev.disabled = strip.scrollLeft <= 2;
    next.disabled = strip.scrollLeft >= max - 2;
  };
  strip.addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  addEventListener('load', sync);
  sync();
})();
