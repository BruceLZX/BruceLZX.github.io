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
    if (reduce.matches) {
      backdrop.style.setProperty('--bg-y', '0px');
      backdrop.style.setProperty('--bg-scale', '1');
      return;
    }
    const offset = Math.max(-200, Math.min(0, -window.scrollY * 0.07));
    const scale = 1 + Math.min(0.08, window.scrollY * 0.00005);
    backdrop.style.setProperty('--bg-y', `${offset.toFixed(1)}px`);
    backdrop.style.setProperty('--bg-scale', scale.toFixed(3));
  };

  window.addEventListener('scroll', () => {
    if (backdropFrame) return;
    backdropFrame = requestAnimationFrame(paintBackdrop);
  }, { passive: true });
  paintBackdrop();

  const backdropImage = document.querySelector('.atlas-bg img');
  const finePointer = window.matchMedia('(pointer: fine)');

  if (backdropImage && finePointer.matches) {
    window.addEventListener('pointermove', (event) => {
      if (reduce.matches || narrow.matches) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 32;
      const y = (event.clientY / window.innerHeight - 0.5) * 22;
      backdropImage.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      backdropImage.style.translate = '0px 0px';
    });
  }

  /* ---------- work index ---------- */
  const pieces = [...document.querySelectorAll('.piece')];
  const indexLinks = [...document.querySelectorAll('.work-index a')];
  let indexFrame = 0;

  const paintIndex = () => {
    indexFrame = 0;
    if (!pieces.length || !indexLinks.length) return;
    const navHeight = nav ? nav.offsetHeight : 68;
    const line = navHeight + window.innerHeight * 0.24;
    let current = pieces[0];
    pieces.forEach((piece) => {
      if (piece.getBoundingClientRect().top <= line) current = piece;
    });
    indexLinks.forEach((link) => {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  window.addEventListener('scroll', () => {
    if (indexFrame) return;
    indexFrame = requestAnimationFrame(paintIndex);
  }, { passive: true });
  paintIndex();

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


