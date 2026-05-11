// ═══════════════════════════════════════════════════════════════════════
// Llumàtics — JavaScript principal (refactor estable)
// ═══════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // MENÚ MÒBIL
  // ─────────────────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // ACTIVE NAV LINK
  // ─────────────────────────────────────────────────────────────
  const currentPath = window.location.pathname;

  document.querySelectorAll('.site-nav__link').forEach(link => {
    const href = link.getAttribute('href');

    if (!href) return;

    if (href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    }

    if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  // ─────────────────────────────────────────────────────────────
  // LAZY IMAGES
  // ─────────────────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        observer.unobserve(img);
      });
    });

    images.forEach(img => observer.observe(img));
  }

  // ─────────────────────────────────────────────────────────────
  // NEWSLETTER FORM
  // ─────────────────────────────────────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form--native');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async e => {
      e.preventDefault();

      const email = newsletterForm.querySelector('[type="email"]').value;
      const btn = newsletterForm.querySelector('[type="submit"]');
      const msg = newsletterForm.querySelector('.newsletter-form__msg');

      btn.disabled = true;
      btn.textContent = '...';

      try {
        const body = new FormData();
        body.append('access_key', newsletterForm.dataset.key);
        body.append('email', email);
        body.append('subject', 'Nova subscripció al butlletí — Llumàtics');
        body.append('from_name', 'Web Llumàtics');

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body
        });

        const data = await res.json();

        if (data.success) {
          const base = document.documentElement.lang === 'ca'
            ? ''
            : '/' + document.documentElement.lang;

          window.location.href = base + '/gracies/?from=newsletter';
        } else {
          throw new Error('submit failed');
        }

      } catch (err) {
        if (msg) msg.textContent = 'Alguna cosa ha fallat. Prova-ho de nou.';
        btn.disabled = false;
        btn.textContent = 'Subscriu-me';
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
// CONTACT FORM (Web3Forms)
// ─────────────────────────────────────────────────────────────
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.textContent = 'Enviant...';

    try {
      const body = new FormData(contactForm);
      body.append('subject', 'Contacte Llumàtics');
      body.append('from_name', 'Web Llumàtics');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body
      });

      const data = await res.json();

      if (data.success) {
        const lang = document.documentElement.lang;
        const base = lang === 'ca' ? '' : '/' + lang;
        window.location.href = base + '/gracies/?from=contacte';
      } else {
        throw new Error('submit error');
      }

    } catch (err) {
      alert('Error enviant el formulari');
      btn.disabled = false;
      btn.textContent = 'Enviar';
    }
  });
}

  // ─────────────────────────────────────────────────────────────
  // BACK TO TOP
  // ─────────────────────────────────────────────────────────────
  const bttBtn = document.getElementById('js-back-to-top');
  const bttProgress = document.getElementById('js-btt-progress');

  if (bttBtn) {
    const circumference = 131.95;

    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      if (scrollTop > 150) {
        bttBtn.classList.add('is-visible');
      } else {
        bttBtn.classList.remove('is-visible');
      }

      if (bttProgress) {
        bttProgress.style.strokeDashoffset = circumference * (1 - progress);
      }
    }

    window.addEventListener('scroll', update, { passive: true });

    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();