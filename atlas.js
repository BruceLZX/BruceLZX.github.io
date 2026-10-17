(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 900px)');

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

  /* ---------- survey map ---------- */
  const frame = document.querySelector('[data-map]');
  const world = document.querySelector('[data-world]');
  const stops = [...document.querySelectorAll('.stop')];
  const entries = [...document.querySelectorAll('[data-entry]')];
  const routeSegments = [...document.querySelectorAll('.route-seg')];
  const hudKicker = document.querySelector('[data-map-kicker]');
  const hudTitle = document.querySelector('[data-map-title]');
  const hudCount = document.querySelector('[data-map-count]');
  const progress = [...document.querySelectorAll('.map-progress i')];
  const navLinks = [...document.querySelectorAll('.nav-links a')];

  if (!frame || !world || !stops.length || !entries.length) return;

  const typeName = { paper: 'Paper', product: 'Product', role: 'Role' };
  const points = stops.map((stop) => ({
    x: parseFloat(stop.style.getPropertyValue('--x')) / 100,
    y: parseFloat(stop.style.getPropertyValue('--y')) / 100,
  }));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let active = 0;
  let camera = { x: 0, y: 0, s: 1 };
  let target = { x: 0, y: 0, s: 1 };
  let cameraFrame = 0;

  const cameraFor = (index) => {
    const fw = frame.clientWidth;
    const fh = frame.clientHeight;
    const ww = world.offsetWidth;
    const wh = world.offsetHeight;
    const scale = 1.06;
    const px = points[index].x * ww;
    const py = points[index].y * wh;
    return {
      x: clamp(fw / 2 - px * scale, fw - ww * scale, 0),
      y: clamp(fh / 2 - py * scale, fh - wh * scale, 0),
      s: scale,
    };
  };

  const applyCamera = () => {
    world.style.transform = `translate3d(${camera.x.toFixed(2)}px, ${camera.y.toFixed(2)}px, 0) scale(${camera.s.toFixed(4)})`;
  };

  const settleCamera = () => {
    cameraFrame = 0;
    const ease = reduce.matches ? 1 : 0.15;
    camera.x += (target.x - camera.x) * ease;
    camera.y += (target.y - camera.y) * ease;
    camera.s += (target.s - camera.s) * ease;
    applyCamera();
    const delta = Math.abs(target.x - camera.x) + Math.abs(target.y - camera.y);
    if (delta > 0.4) cameraFrame = requestAnimationFrame(settleCamera);
  };

  const moveCamera = (index, immediate = false) => {
    target = cameraFor(index);
    if (immediate || reduce.matches) {
      camera = { ...target };
      applyCamera();
      return;
    }
    if (!cameraFrame) cameraFrame = requestAnimationFrame(settleCamera);
  };

  const formatCount = (index) => `${String(index + 1).padStart(2, '0')} / ${String(stops.length).padStart(2, '0')}`;

  const paintHud = (index) => {
    const stop = stops[index];
    if (!stop) return;
    if (hudKicker) hudKicker.textContent = `${formatCount(index)} · ${typeName[stop.dataset.type] || 'Stop'}`;
    if (hudTitle) hudTitle.textContent = stop.dataset.title || '';
    if (hudCount) hudCount.textContent = formatCount(index);
  };

  const setActive = (index, options = {}) => {
    const next = clamp(index, 0, stops.length - 1);
    const changed = next !== active;
    active = next;

    stops.forEach((stop, i) => {
      const on = i === active;
      stop.classList.toggle('is-active', on);
      if (on) stop.setAttribute('aria-current', 'true');
      else stop.removeAttribute('aria-current');
    });

    entries.forEach((entry, i) => entry.classList.toggle('is-active', i === active));
    progress.forEach((bar, i) => bar.classList.toggle('is-done', i <= active));

    if (routeSegments.length) {
      routeSegments.forEach((segment, i) => segment.classList.toggle('is-done', i < active));
    }

    paintHud(active);

    if (changed || options.force) moveCamera(active, options.immediate);
  };

  const scrollToEntry = (index) => {
    const entry = entries[index];
    if (!entry) return;
    const behavior = reduce.matches ? 'auto' : 'smooth';
    if (mobile.matches) {
      const navHeight = parseFloat(getComputedStyle(root).getPropertyValue('--nav')) || 60;
      const offset = navHeight + frame.offsetHeight + 14;
      const top = entry.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    } else {
      entry.scrollIntoView({ behavior, block: 'center' });
    }
  };

  stops.forEach((stop, index) => {
    stop.addEventListener('click', (event) => {
      event.preventDefault();
      setActive(index, { force: true });
      scrollToEntry(index);
    });
    stop.addEventListener('pointerenter', () => paintHud(index));
    stop.addEventListener('focus', () => paintHud(index));
    stop.addEventListener('pointerleave', () => paintHud(active));
    stop.addEventListener('blur', () => paintHud(active));
  });

  const activeLine = () => {
    const rect = frame.getBoundingClientRect();
    if (mobile.matches) {
      return rect.bottom + (window.innerHeight - rect.bottom) * 0.45;
    }
    return window.innerHeight * 0.45;
  };

  const findActive = () => {
    const line = activeLine();
    let best = null;
    let bestDistance = Infinity;
    entries.forEach((entry, index) => {
      const rect = entry.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - line);
      if (rect.top <= line && rect.bottom >= line) {
        best = index;
        bestDistance = -1;
      } else if (bestDistance >= 0 && distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    return best === null ? active : best;
  };

  let scrollFrame = 0;

  const onScroll = () => {
    scrollFrame = 0;
    const next = findActive();
    if (next !== active) setActive(next);
  };

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(onScroll);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (cameraFrame) cancelAnimationFrame(cameraFrame);
    cameraFrame = 0;
    moveCamera(active, true);
    onScroll();
  }, { passive: true });

  /* ---------- nav spy ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((records) => {
      const visible = records
        .filter((record) => record.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -50%', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- init ---------- */
  root.classList.add('map-ready');
  const start = () => {
    setActive(0, { immediate: true, force: true });
    onScroll();
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(start));
  } else {
    requestAnimationFrame(start);
  }
})();
