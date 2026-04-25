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

  // ── Val-regal: questionaire ──────────────────────────────────────────
  var giftQuiz   = document.getElementById('gift-quiz');
  var giftResult = document.getElementById('gift-result');

  if (giftQuiz && giftResult) {
    var giftDataEl  = document.getElementById('gift-data');
    var giftCourses = giftDataEl ? JSON.parse(giftDataEl.textContent) : [];
    var giftTally   = giftQuiz.dataset.tally || null;
    var giftEmail   = giftQuiz.dataset.email || '';
    var qHistory = [];

    var STEPS = {
      start: {
        step: 1, total: 2,
        q: 'La persona que rep el regal...',
        opts: [
          { label: 'No ha tocat mai una càmera analògica',           hint: 'Partim de zero, perfecte',     next: 'q_camera' },
          { label: 'Ja ha fet algun taller o revela de tant en tant', hint: 'Vol aprofundir',               next: 'q_world'  },
          { label: 'És fotògraf analògic i busca un repte nou',       hint: 'Anem a fons',                  next: 'q_challenge' }
        ]
      },
      q_camera: {
        step: 2, total: 2,
        q: 'Té càmera analògica?',
        opts: [
          { label: 'Sí, ja en té una',  hint: 'Perfecte, ja pot disparar',    slugs: 'revelat-bn,revelat-i-positivat' },
          { label: 'No, o no ho sé',    hint: 'No cal tenir-ne per aprendre', slugs: 'fonaments-iniciacio-puntual,fotogrames-cianotipia' }
        ]
      },
      q_world: {
        step: 2, total: 2,
        q: 'Quin món li crida més?',
        opts: [
          { label: 'Laboratori i química del revelat',        hint: 'Mans a la cubeta',              slugs: 'revelat-i-positivat,copies-en-paper,introduccio-al-positivat' },
          { label: 'Processos creatius sense cambra fosca',   hint: 'Llum solar i paper fotogràfic', slugs: 'cianotipia,fotografia-estenopeica,fotogrames-cianotipia' },
          { label: 'Càmeres especials i mig o gran format',  hint: 'La física de l\'objectiu',      slugs: 'hasselblad-500,introduccio-gran-format,retrat-6x6' }
        ]
      },
      q_challenge: {
        step: 2, total: 2,
        q: 'Quin repte vol afrontar?',
        opts: [
          { label: 'Fer el seu propi revelador des de zero',  hint: 'Química artesanal',           slugs: 'reveladors-artesanals,guinneol,copies-beers-developer' },
          { label: 'La càmera de plànxes i el gran format',  hint: 'Una fotografia, una plànxa',  slugs: 'gran-format-4x5,introduccio-gran-format' },
          { label: 'El retrat analògic amb profunditat',      hint: 'Llum, model i decisió',       slugs: 'retrat-analogic,retrat-6x6,hasselblad-500' }
        ]
      }
    };

    function getCourse(slug) {
      return giftCourses.find(function(c) { return c.slug === slug; });
    }

    function renderStep(key) {
      var step = STEPS[key];
      var html = '<div class="gift-step">';
      if (step.step) html += '<p class="gift-step__counter">' + step.step + ' / ' + step.total + '</p>';
      html += '<h2 class="gift-step__question">' + step.q + '</h2>';
      html += '<div class="gift-step__options">';
      step.opts.forEach(function(opt) {
        html += '<button class="gift-option"'
          + (opt.next  ? ' data-next="'  + opt.next  + '"' : '')
          + (opt.slugs ? ' data-slugs="' + opt.slugs + '"' : '')
          + '>';
        html += '<span class="gift-option__label">' + opt.label + '</span>';
        if (opt.hint) html += '<span class="gift-option__hint">' + opt.hint + '</span>';
        html += '</button>';
      });
      html += '</div>';
      if (qHistory.length > 0) html += '<button class="gift-back">← Torna enrere</button>';
      html += '</div>';
      giftQuiz.innerHTML = html;

      giftQuiz.querySelectorAll('.gift-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (this.dataset.next) {
            qHistory.push(key);
            renderStep(this.dataset.next);
          } else if (this.dataset.slugs) {
            qHistory.push(key);
            showResult(this.dataset.slugs.split(','));
          }
        });
      });

      var back = giftQuiz.querySelector('.gift-back');
      if (back) back.addEventListener('click', function() { renderStep(qHistory.pop()); });
    }

    function showResult(slugs) {
      var courses = slugs.map(getCourse).filter(Boolean).slice(0, 3);
      giftQuiz.setAttribute('hidden', '');
      giftResult.removeAttribute('hidden');

      var html = '<div class="gift-result__header">'
        + '<h2 class="gift-result__title">El taller ideal</h2>'
        + '<p class="gift-result__sub">Aquí tens les nostres recomanacions. Pots regalar-ne qualsevol —'
        + ' o deixar que la persona triï el dia que el vingui a fer.</p>'
        + '</div>';
      html += '<div class="gift-result__courses">';

      courses.forEach(function(c, i) {
        var subject = encodeURIComponent('Val regal — ' + c.title);
        var cta = giftTally
          ? '<a href="https://tally.so/r/' + giftTally + '?curs=' + encodeURIComponent(c.title) + '" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">Regala aquest taller</a>'
          : '<a href="mailto:' + giftEmail + '?subject=' + subject + '" class="btn btn--primary btn--sm">Regala aquest taller</a>';

        html += '<div class="gift-course-card' + (i === 0 ? ' gift-course-card--featured' : '') + '">';
        if (i === 0) html += '<div class="gift-course-card__badge">Recomanació principal</div>';
        html += '<h3 class="gift-course-card__title">' + c.title + '</h3>';
        if (c.lead) html += '<p class="gift-course-card__lead">' + c.lead + '</p>';
        if (c.preu_1) html += '<p class="gift-course-card__price">Des de <strong>' + c.preu_1 + '€</strong> per persona</p>';
        html += '<div class="gift-course-card__actions">' + cta
          + '<a href="' + c.url + '" class="btn btn--ghost btn--sm">Veure fitxa</a>'
          + '</div>';
        html += '</div>';
      });

      html += '</div>';
      html += '<button class="gift-restart">Tornar a començar</button>';
      giftResult.innerHTML = html;

      giftResult.querySelector('.gift-restart').addEventListener('click', function() {
        giftResult.setAttribute('hidden', '');
        giftQuiz.removeAttribute('hidden');
        qHistory = [];
        renderStep('start');
      });
    }

    var tallerParam = new URLSearchParams(window.location.search).get('taller');
    if (tallerParam) {
      showResult([tallerParam]);
    } else {
      renderStep('start');
    }
  }

  // ── Cerca interna ────────────────────────────────────────────────────
  var searchToggle  = document.querySelector('.search-toggle');
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput   = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchClose   = document.querySelector('.search-close');

  if (searchToggle && searchOverlay && searchInput) {
    var searchData = null;

    function loadSearchData(cb) {
      if (searchData) { cb(); return; }
      fetch(window.__searchURL)
        .then(function(r) { return r.json(); })
        .then(function(data) { searchData = data; cb(); })
        .catch(function() { searchData = []; cb(); });
    }

    function openSearch() {
      searchOverlay.removeAttribute('hidden');
      searchToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      loadSearchData(function() { searchInput.focus(); });
    }

    function closeSearch() {
      searchOverlay.setAttribute('hidden', '');
      searchToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      searchInput.value = '';
      searchResults.innerHTML = '';
    }

    function runSearch(q) {
      searchResults.innerHTML = '';
      if (!q || q.length < 2) return;
      var term = q.toLowerCase();
      var hits = (searchData || []).filter(function(p) {
        return (p.title || '').toLowerCase().indexOf(term) !== -1 ||
               (p.lead  || '').toLowerCase().indexOf(term) !== -1;
      }).slice(0, 8);

      if (!hits.length) {
        searchResults.setAttribute('data-empty', 'Cap resultat per a "' + q + '"');
        return;
      }
      searchResults.removeAttribute('data-empty');
      hits.forEach(function(p) {
        var li = document.createElement('li');
        li.className = 'search-result';
        li.innerHTML =
          '<a href="' + p.url + '">' +
            '<div class="search-result__type">' + (p.type === 'blog' ? 'Blog' : 'Taller') + '</div>' +
            '<div class="search-result__title">' + p.title + '</div>' +
            (p.lead ? '<div class="search-result__lead">' + p.lead + '</div>' : '') +
          '</a>';
        searchResults.appendChild(li);
      });
    }

    searchToggle.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) closeSearch();
    });

    searchInput.addEventListener('input', function() {
      runSearch(this.value.trim());
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !searchOverlay.hasAttribute('hidden')) closeSearch();
    });
  }

})();
