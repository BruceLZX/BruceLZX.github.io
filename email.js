document.querySelectorAll('.js-email').forEach((link) => {
  const reverse = (value = '') => [...value].reverse().join('');
  const address = `${reverse(link.dataset.localRev)}@${reverse(link.dataset.domainRev)}`;
  link.href = `mailto:${address}`;
  link.textContent = link.dataset.label || address;
});
