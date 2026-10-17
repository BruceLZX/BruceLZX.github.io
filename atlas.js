(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  root.classList.add('reveal-ready');

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

  /* ---------- nav ---------- */
  const nav = document.querySelector('[data-nav]');
  let navFrame = 0;

  const paintNav = () => {
    navFrame = 0;
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  window.addEventListener('scroll', () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(paintNav);
  }, { passive: true });
  paintNav();

  /* ---------- reveal ---------- */
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  revealItems.forEach((item, index) => {
    if (!item.style.getPropertyValue('--d')) {
      item.style.setProperty('--d', `${Math.min(index % 5, 4) * 55}ms`);
    }
  });

  if (reduce.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8%', threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- counters ---------- */
  const counters = [...document.querySelectorAll('[data-count]')];
  const formatValue = (value, node) => {
    const decimals = Number(node.dataset.decimals || 0);
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: node.dataset.group === 'true',
    });
    return formatter.format(value) + (node.dataset.suffix || '');
  };

  const runCounter = (node) => {
    const target = Number(node.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reduce.matches) {
      node.textContent = formatValue(target, node);
      return;
    }
    const duration = 1000;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      node.textContent = formatValue(target * eased, node);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach((node) => counterObserver.observe(node));
    }
  }

  /* ---------- scrollspy ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const mapPoints = [...document.querySelectorAll('.point')];

  const setCurrent = (id) => {
    navLinks.forEach((link) => {
      const active = link.hash === `#${id}`;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    mapPoints.forEach((point) => {
      point.classList.toggle('is-current', point.hash === `#${id}`);
    });
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrent(visible.target.id);
    }, { rootMargin: '-42% 0px -48%', threshold: [0, 0.2, 0.6] });
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- map parallax + route progress ---------- */
  const mapImage = document.querySelector('.map img');
  const route = document.querySelector('[data-route]');
  let scrollFrame = 0;

  const paintScroll = () => {
    scrollFrame = 0;
    if (reduce.matches) return;
    if (mapImage) {
      const offset = Math.max(-18, Math.min(18, window.scrollY * 0.04));
      mapImage.style.setProperty('--map-y', `${offset.toFixed(1)}px`);
    }
    if (route) {
      const rect = route.getBoundingClientRect();
      const start = window.innerHeight * 0.82;
      const end = window.innerHeight * 0.2;
      const progress = (start - rect.top) / (rect.height + start - end);
      route.style.setProperty('--route', Math.max(0, Math.min(1, progress)).toFixed(3));
    }
  };

  const requestScrollPaint = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(paintScroll);
  };

  window.addEventListener('scroll', requestScrollPaint, { passive: true });
  window.addEventListener('resize', requestScrollPaint, { passive: true });
  if (reduce.matches && route) route.style.setProperty('--route', '1');
  paintScroll();

  /* ---------- magnetic email ---------- */
  const magnetic = document.querySelector('[data-magnetic]');
  if (magnetic && finePointer.matches && !reduce.matches) {
    magnetic.addEventListener('pointermove', (event) => {
      const rect = magnetic.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      magnetic.style.transform = `translate(${(x * 7).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`;
    });
    magnetic.addEventListener('pointerleave', () => {
      magnetic.style.transform = '';
    });
  }

  /* ---------- index dialog ---------- */
  const dialog = document.querySelector('#index-dialog');
  const openButton = document.querySelector('[data-open-index]');
  const closeButton = document.querySelector('[data-close-index]');

  if (dialog && openButton) {
    openButton.addEventListener('click', () => dialog.showModal());
    if (closeButton) closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => dialog.close());
    });
  }

  /* ---------- reveal fallback ---------- */
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      if (!root.classList.contains('reveal-ready')) return;
      const hidden = revealItems.filter((item) => !item.classList.contains('is-in'));
      const anyVisible = hidden.some((item) => item.getBoundingClientRect().top < window.innerHeight);
      if (anyVisible) hidden.forEach((item) => item.classList.add('is-in'));
    }, 2400);
  });
})();
