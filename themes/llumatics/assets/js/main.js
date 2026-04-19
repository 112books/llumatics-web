// ═══════════════════════════════════════════════════════════════════════
// Llumàtics — JavaScript principal
// ═══════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Menú mòbil ──────────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav   = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Tanca al clicar un enllaç
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // Tanca amb Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }

  // ── Destacar l'enllaç actiu al nav ──────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  // ── Lazy loading d'imatges ───────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ── Formulari newsletter (si no es fa servir Tally embed) ───────────
  const newsletterForm = document.querySelector('.newsletter-form--native');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = newsletterForm.querySelector('[type="email"]').value;
      const btn   = newsletterForm.querySelector('[type="submit"]');
      const msg   = newsletterForm.querySelector('.newsletter-form__msg');

      btn.disabled = true;
      btn.textContent = '...';

      // Aquí connectaríem amb l'API de Brevo o el webhook de Tally
      // Per ara simulem resposta OK
      setTimeout(() => {
        msg.textContent = 'Subscripció confirmada. Gràcies!';
        msg.style.color = '#C8A96E';
        btn.style.display = 'none';
      }, 800);
    });
  }

})();
