(() => {
  'use strict';
  document.documentElement.dataset.theme = 'light';
  document.querySelectorAll('.email').forEach(link => {
    const reverse = value => [...value].reverse().join('');
    const address = reverse(link.dataset.local) + '@' + reverse(link.dataset.domain);
    link.textContent = address;
    // Deters basic source scraping, not JavaScript-enabled crawlers.
    const activate = () => { link.href = 'mailto:' + address; };
    link.addEventListener('pointerenter', activate, { once: true });
    link.addEventListener('focus', activate, { once: true });
    link.addEventListener('click', activate);
  });
  const links = [...document.querySelectorAll('.site-nav nav a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = entry.target.id === 'research' ? 'current-research' : entry.target.id;
      links.forEach(link => {
        if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-20% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
})();
