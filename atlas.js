(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 900px)');

  /* ---------- theme ---------- */
  const themeButton = document.querySelector('[data-theme-toggle]');

  const paintTheme = (theme) => {
    root.dataset.theme = theme;
    if (!themeButton) return;
    const dark = theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  paintTheme(root.dataset.theme || 'light');

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        paintTheme(next);
        try { localStorage.setItem('atlas-theme', next); } catch (error) {}
      };
      if (document.startViewTransition && !reduce.matches) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    });
  }

  /* ---------- navigation ---------- */
  const nav = document.querySelector('[data-nav]');
  let navFrame = 0;

  const paintNav = () => {
    navFrame = 0;
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  window.addEventListener('scroll', () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(paintNav);
  }, { passive: true });
  paintNav();

  /* ---------- reveals ---------- */
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  revealItems.forEach((item, index) => {
    item.style.setProperty('--d', `${Math.min(index % 4, 3) * 70}ms`);
  });

  if (reduce.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8%', threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  /* ---------- background drift ---------- */
  const backdrop = document.querySelector('.atlas-bg');
  let backdropFrame = 0;

  const paintBackdrop = () => {
    backdropFrame = 0;
    if (!backdrop) return;
    if (reduce.matches || narrow.matches) {
      backdrop.style.setProperty('--bg-y', '0px');
      return;
    }
    const offset = Math.max(-90, Math.min(0, -window.scrollY * 0.035));
    backdrop.style.setProperty('--bg-y', `${offset.toFixed(1)}px`);
  };

  window.addEventListener('scroll', () => {
    if (backdropFrame) return;
    backdropFrame = requestAnimationFrame(paintBackdrop);
  }, { passive: true });
  paintBackdrop();

  /* ---------- nav spy ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a')];

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -50%', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => spy.observe(section));
  }
})();
