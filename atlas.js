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
    item.style.setProperty('--d', `${Math.min(index % 3, 2) * 80}ms`);
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
    }, { rootMargin: '0px 0px -10%', threshold: 0.1 });
    revealItems.forEach((item) => observer.observe(item));
  }

  /* ---------- scroll-driven map ---------- */
  const map = document.querySelector('.atlas-map');
  const pieces = [...document.querySelectorAll('.piece')];
  const points = [
    [0.36, 0.62],
    [0.44, 0.30],
    [0.52, 0.72],
    [0.62, 0.42],
    [0.72, 0.58],
    [0.82, 0.26],
  ];
  let mapFrame = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const paintMap = () => {
    mapFrame = 0;
    if (!map) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mw = map.offsetWidth;
    const mh = map.offsetHeight;

    let px = points[0][0];
    let py = points[0][1];

    if (!reduce.matches && pieces.length) {
      const line = window.scrollY + vh * 0.5;
      const centers = pieces.map((piece) => piece.offsetTop + piece.offsetHeight * 0.5);

      if (line >= centers[centers.length - 1]) {
        px = points[points.length - 1][0];
        py = points[points.length - 1][1];
      } else if (line > centers[0]) {
        for (let index = 0; index < centers.length - 1; index += 1) {
          if (line > centers[index + 1]) continue;
          const t = (line - centers[index]) / (centers[index + 1] - centers[index]);
          px = points[index][0] + (points[index + 1][0] - points[index][0]) * t;
          py = points[index][1] + (points[index + 1][1] - points[index][1]) * t;
          break;
        }
      }
    }

    const centerX = vw * (narrow.matches ? 0.5 : 0.64);
    const centerY = vh * (narrow.matches ? 0.24 : 0.5);
    const x = clamp(centerX - px * mw, vw - mw, vw * 0.12);
    const y = clamp(centerY - py * mh, vh - mh, vh * 0.12);

    map.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  window.addEventListener('scroll', () => {
    if (mapFrame) return;
    mapFrame = requestAnimationFrame(paintMap);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (mapFrame) return;
    mapFrame = requestAnimationFrame(paintMap);
  }, { passive: true });

  paintMap();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!mapFrame) paintMap();
    });
  }

  window.addEventListener('load', paintMap);

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



