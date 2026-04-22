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

  // ── Formulari newsletter → web3forms ────────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form--native');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var email = newsletterForm.querySelector('[type="email"]').value;
      var btn   = newsletterForm.querySelector('[type="submit"]');
      var msg   = newsletterForm.querySelector('.newsletter-form__msg');

      btn.disabled = true;
      btn.textContent = '...';

      try {
        var body = new FormData();
        body.append('access_key',  newsletterForm.dataset.key);
        body.append('email',       email);
        body.append('subject',     'Nova subscripció al butlletí — Llumàtics');
        body.append('from_name',   'Web Llumàtics');

        var res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: body });
        var data = await res.json();

        if (data.success) {
          msg.textContent  = 'Subscripció confirmada. Gràcies!';
          msg.style.color  = '#C8A96E';
          btn.style.display = 'none';
        } else {
          throw new Error('error');
        }
      } catch (_) {
        msg.textContent = 'Alguna cosa ha fallat. Prova-ho de nou.';
        btn.disabled    = false;
        btn.textContent = 'Subscriu-me';
      }
    });
  }

  // ── Lightbox amb navegació ───────────────────────────────────────────
  const lb        = document.getElementById('js-lightbox');
  const lbImg     = document.getElementById('js-lb-img');
  const lbPrev    = document.getElementById('js-lb-prev');
  const lbNext    = document.getElementById('js-lb-next');
  const lbClose   = document.getElementById('js-lb-close');
  const lbCounter = document.getElementById('js-lb-counter');

  if (lb && lbImg) {
    let gallery = [];
    let current = 0;

    function openLightbox(images, index) {
      gallery = images;
      current = index;
      showImage();
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    }

    function showImage() {
      lbImg.src = gallery[current];
      lbImg.alt = '';
      if (lbCounter) lbCounter.textContent = (current + 1) + ' / ' + gallery.length;
      if (lbPrev) lbPrev.style.visibility = gallery.length > 1 ? 'visible' : 'hidden';
      if (lbNext) lbNext.style.visibility = gallery.length > 1 ? 'visible' : 'hidden';
    }

    function navigate(dir) {
      current = (current + dir + gallery.length) % gallery.length;
      showImage();
    }

    // Clic en qualsevol trigger
    document.addEventListener('click', function(e) {
      const trigger = e.target.closest('.js-lightbox-trigger');
      if (!trigger) return;
      e.preventDefault();

      const groupId = trigger.dataset.gallery;
      let images;
      if (groupId) {
        images = Array.from(
          document.querySelectorAll('.js-lightbox-trigger[data-gallery="' + groupId + '"]')
        ).map(el => el.dataset.src);
      } else {
        images = [trigger.dataset.src];
      }
      const index = images.indexOf(trigger.dataset.src);
      openLightbox(images, index >= 0 ? index : 0);
    });

    // Botons
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click',  function(e) { e.stopPropagation(); navigate(-1); });
    if (lbNext)  lbNext.addEventListener('click',  function(e) { e.stopPropagation(); navigate(1); });

    // Clic al fons tanca
    lb.addEventListener('click', function(e) {
      if (e.target === lb || e.target === lbImg) closeLightbox();
    });

    // Teclat
    document.addEventListener('keydown', function(e) {
      if (lb.style.display !== 'flex') return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // ── Seccions collapsibles (biblioteca, FAQ-style) ────────────────────────
  document.querySelectorAll('.collapsible-sections').forEach(function(container) {
    container.querySelectorAll('h2').forEach(function(h2) {
      var panel = document.createElement('div');
      panel.className = 'collapsible__panel';
      var next = h2.nextElementSibling;
      while (next && next.tagName !== 'H2') {
        var sibling = next;
        next = next.nextElementSibling;
        panel.appendChild(sibling);
      }
      h2.parentNode.insertBefore(panel, h2.nextElementSibling);
      h2.addEventListener('click', function() {
        this.classList.toggle('is-open');
        panel.classList.toggle('is-open');
      });
    });
  });

})();
