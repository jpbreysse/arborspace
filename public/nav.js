// Main menu: dropdowns on desktop, collapsible panel on mobile.
// Kept as a plain file so the Content-Security-Policy (script-src 'self') allows it.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const triggers = [...document.querySelectorAll('.nav-trigger')];

  const closeAll = (except) => {
    triggers.forEach((t) => { if (t !== except) t.setAttribute('aria-expanded', 'false'); });
  };

  triggers.forEach((t) => {
    t.addEventListener('click', () => {
      const open = t.getAttribute('aria-expanded') === 'true';
      closeAll(t);
      t.setAttribute('aria-expanded', String(!open));
    });
  });

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-group')) closeAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
    closeAll();
    open?.focus();
  });
})();
