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

  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Panama', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const updateClock = () => {
      const now = new Date();
      clock.textContent = formatter.format(now);
      clock.dateTime = now.toISOString();
    };
    updateClock();
    window.setInterval(updateClock, 1000);
  }

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
