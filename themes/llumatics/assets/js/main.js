// ═══════════════════════════════════════════════════════════════════════
// Llumàtics — JavaScript principal (refactor estable)
// ═══════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  /* ── Traduccions ──────────────────────────────────────────────────
     Les claus venen del partial js-i18n.html, que les serialitza des
     de l'i18n de Hugo segons l'idioma de la pàgina. El text català
     queda com a valor per defecte: si el blob no hi és (o hi falta una
     clau), la pàgina continua llegible en comptes de trencar-se. */
  var I18N = {};
  try {
    var i18nEl = document.getElementById('llum-i18n');
    if (i18nEl) I18N = JSON.parse(i18nEl.textContent) || {};
  } catch (e) { /* sense traduccions: es queda el català */ }
  window.LLUM_I18N = I18N;
  window.T = function (key, fallback) {
    return I18N[key] || fallback || key;
  };

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
      /* Les URL /gracies/ existeixen en els tres idiomes. Sense això,
         un visitant d'/es/ o /en/ aterria a la pàgina en català. */
      const lang = document.documentElement.lang;
      const base = lang && lang !== 'ca' ? '/' + lang : '';
      const gracies = form.dataset.gracies || base + '/gracies/?from=avisa';
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
    btn.textContent = T('contact_sending', 'Enviant…');

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
      alert(T('contact_error', 'Error enviant el formulari'));
      btn.disabled = false;
      btn.textContent = T('contact_send', 'Enviar');
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
        q: T('gift_quiz_q_recipient', 'La persona que rep el regal…'),
        opts: [
          { label: T('gift_quiz_a_never'), hint: T('gift_quiz_a_never_h'),     next: 'q_camera' },
          { label: T('gift_quiz_a_some'), hint: T('gift_quiz_a_some_h'),               next: 'q_world'  },
          { label: T('gift_quiz_a_pro'), hint: T('gift_quiz_a_pro_h'),                  next: 'q_challenge' }
        ]
      },
      q_camera: {
        step: 2, total: 2,
        q: T('gift_quiz_q_camera', 'Té càmera analògica?'),
        opts: [
          { label: T('gift_quiz_cam_yes'), hint: T('gift_quiz_cam_yes_h'),    slugs: 'revelat-bn,revelat-i-positivat' },
          { label: T('gift_quiz_cam_no'), hint: T('gift_quiz_cam_no_h'), slugs: 'fonaments-iniciacio-puntual,fotogrames-cianotipia' }
        ]
      },
      q_world: {
        step: 2, total: 2,
        q: T('gift_quiz_q_world', 'Quin món li crida més?'),
        opts: [
          { label: T('gift_quiz_world_lab'), hint: T('gift_quiz_world_lab_h'),              slugs: 'revelat-i-positivat,copies-en-paper,introduccio-al-positivat' },
          { label: T('gift_quiz_world_alt'), hint: T('gift_quiz_world_alt_h'), slugs: 'cianotipia,fotografia-estenopeica,fotogrames-cianotipia' },
          { label: T('gift_quiz_world_cam'), hint: T('gift_quiz_world_cam_h'),      slugs: 'hasselblad-500,introduccio-gran-format,retrat-6x6' }
        ]
      },
      q_challenge: {
        step: 2, total: 2,
        q: T('gift_quiz_q_challenge', 'Quin repte vol afrontar?'),
        opts: [
          { label: T('gift_quiz_ch_own'), hint: T('gift_quiz_ch_own_h'),           slugs: 'reveladors-artesanals,guinneol,copies-beers-developer' },
          { label: T('gift_quiz_ch_sheet'), hint: T('gift_quiz_ch_sheet_h'),  slugs: 'gran-format-4x5,introduccio-gran-format' },
          { label: T('gift_quiz_ch_portrait'), hint: T('gift_quiz_ch_portrait_h'),       slugs: 'retrat-analogic,retrat-6x6,hasselblad-500' }
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
      if (qHistory.length > 0) html += '<button class="gift-back">' + T('gift_quiz_back', '← Torna enrere') + '</button>';
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
        + '<h2 class="gift-result__title">' + T('gift_quiz_result_title') + '</h2>'
        + '<p class="gift-result__sub">' + T('gift_quiz_result_sub') + '</p>'
        + '</div>';
      html += '<div class="gift-result__courses">';

      courses.forEach(function(c, i) {
        var cta = '<button class="btn btn--primary btn--sm gift-regala-btn"'
          + ' data-title="' + c.title.replace(/"/g, '&quot;') + '"'
          + ' data-preu="' + (c.preu_1 || '') + '"'
          + '>' + T('gift_quiz_cta', 'Regala aquest taller') + '</button>';

        html += '<div class="gift-course-card' + (i === 0 ? ' gift-course-card--featured' : '') + '">';
        if (i === 0) html += '<div class="gift-course-card__badge">' + T('gift_quiz_badge') + '</div>';
        html += '<h3 class="gift-course-card__title">' + c.title + '</h3>';
        if (c.lead) html += '<p class="gift-course-card__lead">' + c.lead + '</p>';
        if (c.preu_1) html += '<p class="gift-course-card__price">' + T('gift_quiz_price_from') + ' <strong>' + c.preu_1 + '€</strong> ' + T('gift_quiz_price_per') + '</p>';
        html += '<div class="gift-course-card__actions">' + cta
          + '<a href="' + c.url + '" class="btn btn--ghost btn--sm">' + T('gift_quiz_see', 'Veure fitxa') + '</a>'
          + '</div>';
        html += '</div>';
      });

      html += '</div>';
      html += '<button class="gift-restart">' + T('gift_quiz_restart') + '</button>';
      html += '<div class="gift-wip-notice">'
        + '<p>⚠️ ' + T('gift_quiz_wip_title') + '</p>'
        + '<p>' + T('gift_quiz_wip_text').replace('{link}',
             '<a href="' + T('gift_quiz_wip_link_url') + '">' + T('gift_quiz_wip_link') + '</a>') + '</p>'
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