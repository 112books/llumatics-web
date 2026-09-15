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
  // AVISA'M — toggle + submit via PHP handler
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.js-avisa-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const form = document.getElementById(btn.dataset.target);
      if (!form) return;
      const isHidden = form.style.display === 'none';
      form.style.display = isHidden ? 'block' : 'none';
      if (isHidden) form.querySelector('[type="email"]').focus();
    });
  });

  document.querySelectorAll('[data-avisa-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const gracies = form.dataset.gracies || '/gracies/?from=avisa';
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const res = await fetch('/form-handler.php', { method: 'POST', body: new FormData(form) });
        const json = await res.json();
        if (json.ok) { window.location.href = gracies; return; }
      } catch (_) {}
      // fail open: redirigeix igualment (no volem bloquejar l'usuari)
      window.location.href = gracies;
    });
  });

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
        var cta = '<button class="btn btn--primary btn--sm gift-regala-btn"'
          + ' data-title="' + c.title.replace(/"/g, '&quot;') + '"'
          + ' data-preu="' + (c.preu_1 || '') + '"'
          + '>Regala aquest taller</button>';

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
      html += '<div class="gift-wip-notice">'
        + '<p>⚠️ El sistema de pagament en línia està en preparació.</p>'
        + '<p>Si vols regalar un curs ja ara, <a href="/contacte/">contacta\'ns directament</a> i ho gestionem a mà en menys de 24h.</p>'
        + '</div>';
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

  // ── Back to top amb progrés de scroll ───────────────────────────────
  var bttBtn      = document.getElementById('js-back-to-top');
  var bttProgress = document.getElementById('js-btt-progress');

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


  // ─────────────────────────────────────────────────────────────
  // LIGHTBOX DE GALERIA
  // ─────────────────────────────────────────────────────────────
  var lb        = document.getElementById('js-lightbox');
  var lbImg     = document.getElementById('js-lb-img');
  var lbPrev    = document.getElementById('js-lb-prev');
  var lbNext    = document.getElementById('js-lb-next');
  var lbClose   = document.getElementById('js-lb-close');
  var lbCounter = document.getElementById('js-lb-counter');

  if (lb && lbImg) {
    var galleries = {};
    var lbCurrent = { gallery: null, index: 0 };

    document.querySelectorAll('.js-lightbox-trigger').forEach(function(btn) {
      var gName = btn.dataset.gallery || 'default';
      if (!galleries[gName]) galleries[gName] = [];
      galleries[gName].push(btn);
    });

    function lbShow(galleryName, index) {
      var items = galleries[galleryName];
      if (!items || !items.length) return;
      lbCurrent.gallery = galleryName;
      lbCurrent.index   = index;
      var src = items[index].dataset.src;
      lbImg.src         = src;
      lbImg.alt         = items[index].querySelector('img') ? items[index].querySelector('img').alt : '';
      lbCounter.textContent = (index + 1) + ' / ' + items.length;
      lbPrev.style.display  = items.length > 1 ? '' : 'none';
      lbNext.style.display  = items.length > 1 ? '' : 'none';
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function lbHide() {
      lb.style.display = 'none';
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    function lbNav(dir) {
      var items = galleries[lbCurrent.gallery];
      if (!items) return;
      lbCurrent.index = (lbCurrent.index + dir + items.length) % items.length;
      lbShow(lbCurrent.gallery, lbCurrent.index);
    }

    Object.keys(galleries).forEach(function(gName) {
      galleries[gName].forEach(function(btn, idx) {
        btn.addEventListener('click', function() { lbShow(gName, idx); });
      });
    });

    lbClose.addEventListener('click', lbHide);
    lbPrev.addEventListener('click', function() { lbNav(-1); });
    lbNext.addEventListener('click', function() { lbNav(1); });

    lb.addEventListener('click', function(e) {
      if (e.target === lb) lbHide();
    });

    document.addEventListener('keydown', function(e) {
      if (lb.style.display === 'none') return;
      if (e.key === 'Escape')    lbHide();
      if (e.key === 'ArrowLeft') lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // RECORREGUT ACORDIÓ
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.recorregut-aline__header').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var line = this.closest('.recorregut-aline');
      var isOpen = line.classList.toggle('is-open');
      this.setAttribute('aria-expanded', isOpen);
    });
  });

})();