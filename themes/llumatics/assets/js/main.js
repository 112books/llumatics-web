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
      btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
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
      const errEl = document.getElementById('contact-form-error');
      if (errEl) { errEl.textContent = T('contact_error', 'Error enviant el formulari'); errEl.removeAttribute('hidden'); }
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

    /* A9: si hi ha la configuració a data/quiz.yaml (mateix fitxer que el recomanador),
       l'usem; si no, es manté el mapping de dalt com a fallback. */
    var giftConfigEl = document.getElementById('gift-config');
    if (giftConfigEl) {
      try {
        var gc = JSON.parse(giftConfigEl.textContent);
        if (gc && gc.passos && gc.passos.length) {
          var fromCfg = {};
          gc.passos.forEach(function(p) {
            fromCfg[p.id] = {
              step: p.step, total: p.total,
              q: T(p.i18n_q),
              opts: (p.opcions || []).map(function(o) {
                return {
                  label: T(o.i18n),
                  hint: o.i18n_h ? T(o.i18n_h) : '',
                  next: o.next || null,
                  slugs: (o.slugs || []).join(',')
                };
              })
            };
          });
          if (fromCfg.start) STEPS = fromCfg;
        }
      } catch (e) {}
    }

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
// ═══════════════════════════════════════════════════════════════════════
// POP-UP D'EFEMÈRIDE
// ═══════════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  var popup = document.getElementById('efemeride-popup');
  var tab   = document.getElementById('efemeride-tab');
  if (!popup) return;

  var key = popup.dataset.key || 'efemeride';
  var dismissed = false;
  try { dismissed = sessionStorage.getItem(key) === '1'; } catch (e) {}
  if (dismissed) return;

  var collapseTimer = null, hideTimer = null;

  function open() {
    clearTimeout(hideTimer);
    popup.hidden = false;
    requestAnimationFrame(function () { popup.classList.add('is-open'); });
    if (tab) tab.hidden = true;
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(collapse, parseInt(popup.dataset.ttl || '8000', 10));
  }
  function collapse() {
    clearTimeout(collapseTimer);
    popup.classList.remove('is-open');
    hideTimer = setTimeout(function () {
      if (!popup.classList.contains('is-open')) {
        popup.hidden = true;
        if (tab) tab.hidden = false;
      }
    }, 500);
  }
  function close() {
    try { sessionStorage.setItem(key, '1'); } catch (e) {}
    clearTimeout(collapseTimer);
    popup.classList.remove('is-open');
    hideTimer = setTimeout(function () { popup.hidden = true; }, 500);
    if (tab) tab.hidden = true;
  }

  setTimeout(open, 3000);

  var closeBtn = popup.querySelector('[data-efemeride-close]');
  if (closeBtn) closeBtn.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation(); close();
  });
  if (tab) tab.addEventListener('click', open);
  window.addEventListener('scroll', function () {
    if (popup.classList.contains('is-open')) collapse();
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) collapse();
  });
})();

// ═══════════════════════════════════════════════════════════════════════
// RECOMANADOR "QUIN CURS EM CONVÉ?"
// ═══════════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  var dataEl = document.getElementById('quiz-data');
  var app = document.getElementById('quiz-app');
  if (!dataEl || !app) return;

  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var T = data.t || {};
  var quiz = data.quiz || {};
  var courses = data.courses || [];
  var contact = data.contact || '/contacte/';
  var tutoriaSlug = data.tutoriaSlug || 'tutoria-fotografica';

  function t(k, d) { var v = T[k]; return (v != null && v !== '') ? v : (d || k); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtProgress(tpl, n, total) {
    var i = 0;
    return tpl.replace(/%d/g, function () { return i++ === 0 ? n : total; });
  }

  var passos = quiz.passos || [];
  var nivells = (passos[0] && passos[0].nivells) || {};
  var blocs = (passos[1] && passos[1].blocs) || [];
  var formatOpts = (passos[2] && passos[2].opcions) || [];
  var linies = quiz.linies || {};
  var regles = quiz.regles || {};

  var OPT = {};
  blocs.forEach(function (b) { (b.opcions || []).forEach(function (o) { OPT[o.id] = o; }); });
  formatOpts.forEach(function (o) { OPT[o.id] = o; });

  var NIV = ['n0', 'n1', 'n2', 'n3', 'n4'];
  var state = { step: 0, nivell: null, interessa: [], format: null };

  function visibleBlocs() {
    return blocs.filter(function (b) {
      var vis = b.visible_nivells;
      return !vis || state.nivell === null || vis.indexOf(state.nivell) >= 0;
    });
  }

  var quizRenderedOnce = false;
  function scrollQuizTop() {
    if (!quizRenderedOnce) { quizRenderedOnce = true; return; }
    if (app && app.scrollIntoView) app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function render() {
    if (state.step === 0) renderNivell();
    else if (state.step === 1) renderInteressos();
    else if (state.step === 2) renderFormat();
    else renderResult();
    scrollQuizTop();
  }

  app.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-goto]') : null;
    if (!el || el.disabled) return;
    var idx = parseInt(el.getAttribute('data-goto'), 10);
    if (!canGoTo(idx)) return;
    state.step = idx;
    render();
  });

  function canGoTo(idx) {
    if (idx === 0) return true;
    if (idx === 1) return state.nivell !== null;
    if (idx === 2) return state.nivell !== null && state.interessa.length > 0;
    return false;
  }

  function progress() {
    var defs = [
      t('quiz_step_short_nivell', 'Nivell'),
      t('quiz_step_short_interessos', 'Interessos'),
      t('quiz_step_short_format', 'Format')
    ];
    var h = '<div class="quiz__head">';
    h += '<p class="quiz__progress">' + esc(fmtProgress(t('quiz_progress', 'Pas %d de %d'), state.step + 1, 3)) + '</p>';
    h += '<nav class="quiz__steps" aria-label="' + esc(t('quiz_steps_nav', 'Passos')) + '">';
    defs.forEach(function (label, i) {
      var cls = 'quiz__step';
      if (i === state.step) cls += ' is-current';
      else if (i < state.step) cls += ' is-done';
      var dis = !canGoTo(i) ? ' disabled' : '';
      h += '<button type="button" class="' + cls + '" data-goto="' + i + '"' + dis + ' aria-current="' + (i === state.step ? 'step' : 'false') + '">';
      h += '<span class="quiz__step-num">' + (i + 1) + '</span><span class="quiz__step-label">' + esc(label) + '</span></button>';
      if (i < defs.length - 1) h += '<span class="quiz__step-line" aria-hidden="true"></span>';
    });
    h += '</nav></div>';
    return h;
  }

  function renderNivell() {
    var h = progress() + '<h2 class="quiz__q">' + esc(t('quiz_step_nivell')) + '</h2>';
    h += '<p class="quiz__hint">' + esc(t('quiz_single_hint')) + '</p><div class="quiz__options">';
    NIV.forEach(function (id) {
      h += '<button type="button" class="quiz__option" data-niv="' + id + '">' + esc(t('quiz_' + id)) + '</button>';
    });
    h += '</div>';
    app.innerHTML = h;
    app.querySelectorAll('[data-niv]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.nivell = nivells[this.getAttribute('data-niv')] || 0;
        state.step = 1;
        render();
      });
    });
  }

  function renderInteressos() {
    var h = progress() + '<h2 class="quiz__q">' + esc(t('quiz_step_interessos')) + '</h2>';
    h += '<p class="quiz__hint">' + esc(t('quiz_multiple_hint')) + '</p>';
    visibleBlocs().forEach(function (b) {
      if (!(b.opcions || []).length) return;
      h += '<div class="quiz__group">';
      h += '<h3 class="quiz__group-title">' + esc(t('quiz_block_' + b.id, b.id)) + '</h3>';
      h += '<div class="quiz__options quiz__options--multi">';
      (b.opcions || []).forEach(function (o) {
        var on = state.interessa.indexOf(o.id) >= 0;
        h += '<button type="button" class="quiz__option' + (on ? ' is-on' : '') + '" data-int="' + o.id + '" aria-pressed="' + on + '">' + esc(t('quiz_' + o.id)) + '</button>';
      });
      h += '</div></div>';
    });
    h += '<div class="quiz__nav">';
    h += '<button type="button" class="btn btn--ghost" data-back>' + esc(t('quiz_back')) + '</button>';
    h += '<button type="button" class="btn btn--primary" data-next' + (state.interessa.length ? '' : ' disabled') + '>' + esc(t('quiz_next')) + '</button>';
    h += '</div>';
    app.innerHTML = h;
    app.querySelectorAll('[data-int]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = this.getAttribute('data-int');
        var i = state.interessa.indexOf(id);
        if (i >= 0) { state.interessa.splice(i, 1); this.classList.remove('is-on'); this.setAttribute('aria-pressed', 'false'); }
        else if (state.interessa.length < (passos[1].maxim || 3)) { state.interessa.push(id); this.classList.add('is-on'); this.setAttribute('aria-pressed', 'true'); }
        var next = app.querySelector('[data-next]');
        if (next) next.disabled = state.interessa.length === 0;
      });
    });
    app.querySelector('[data-back]').addEventListener('click', function () { state.step = 0; render(); });
    app.querySelector('[data-next]').addEventListener('click', function () { state.step = 2; render(); });
  }

  function renderFormat() {
    var h = progress() + '<h2 class="quiz__q">' + esc(t('quiz_step_format')) + '</h2>';
    h += '<p class="quiz__hint">' + esc(t('quiz_single_hint')) + '</p><div class="quiz__options">';
    ['f1', 'f2', 'f3', 'f4'].forEach(function (id) {
      h += '<button type="button" class="quiz__option" data-fmt="' + id + '">' + esc(t('quiz_' + id)) + '</button>';
    });
    h += '</div><div class="quiz__nav"><button type="button" class="btn btn--ghost" data-back>' + esc(t('quiz_back')) + '</button></div>';
    app.innerHTML = h;
    app.querySelectorAll('[data-fmt]').forEach(function (b) {
      b.addEventListener('click', function () { state.format = this.getAttribute('data-fmt'); state.step = 3; render(); });
    });
    app.querySelector('[data-back]').addEventListener('click', function () { state.step = 1; render(); });
  }

  function compute() {
    var scores = {}, contrib = {};
    courses.forEach(function (c) { scores[c.slug] = 0; contrib[c.slug] = []; });
    var lv = state.nivell == null ? 0 : state.nivell;

    state.interessa.forEach(function (id) {
      var o = OPT[id]; if (!o) return;
      if (o.slugs) Object.keys(o.slugs).forEach(function (s) {
        if (scores[s] != null) { scores[s] += o.slugs[s]; contrib[s].push(id); }
      });
      if (o.linies) Object.keys(o.linies).forEach(function (l) {
        (linies[l] || []).forEach(function (s) {
          if (scores[s] != null) { scores[s] += o.linies[l]; contrib[s].push(id); }
        });
      });
    });

    var f = OPT[state.format];
    if (f && f.formats) courses.forEach(function (c) {
      if (f.formats.indexOf(c.format) >= 0) { scores[c.slug] += (regles.bonus_format || 2); contrib[c.slug].push(state.format); }
    });

    courses.forEach(function (c) {
      var nm = c.nivell_minim || 0;
      if (nm > lv + 1) scores[c.slug] = scores[c.slug] / 2;
      if (nm === 0 && lv === 4) scores[c.slug] -= 2;
    });

    var ranked = courses.filter(function (c) { return scores[c.slug] > 0; }).sort(function (a, b) {
      if (scores[b.slug] !== scores[a.slug]) return scores[b.slug] - scores[a.slug];
      return (a.nivell_minim || 0) - (b.nivell_minim || 0);
    });
    return { scores: scores, contrib: contrib, ranked: ranked };
  }

  function motiveFor(slug, contrib) {
    var ids = contrib[slug] || [], frases = [], seen = {};
    ids.forEach(function (id) {
      if (id.charAt(0) === 'f' || seen[id]) return; seen[id] = 1;
      frases.push(t('quiz_' + id).replace(/\.$/, ''));
    });
    if (!frases.length) return '';
    var txt = frases.slice(0, 2).map(function (f) { return '«' + f + '»'; });
    return t('quiz_motive_prefix') + ' ' + txt.join(' ' + t('quiz_motive_and') + ' ') + '.';
  }

  function renderResult() {
    var r = compute();
    var top = r.ranked.slice(0, regles.max_resultats || 3);
    var tut = null;
    courses.forEach(function (c) { if (c.slug === tutoriaSlug) tut = c; });

    var h = '<h2 class="quiz__q quiz__q--result">' + esc(t('quiz_result_title')) + '</h2>';
    var best = r.ranked.length ? r.scores[r.ranked[0].slug] : 0;
    var tutFirst = state.format === 'f4' || !top.length || best < (regles.llindar_minim || 4);

    function tutBlock(extra) {
      if (!tut) return '';
      return '<div class="quiz__tutoria' + (extra || '') + '"><h3>' + esc(t('quiz_result_tutoria_title')) + '</h3>'
        + '<p>' + esc(t('quiz_result_tutoria_text')) + '</p>'
        + '<a class="btn btn--primary btn--sm" href="' + esc(tut.url) + '">' + esc(t('quiz_result_see')) + '</a></div>';
    }

    if (tutFirst) h += tutBlock(' quiz__tutoria--first');

    if (top.length) {
      h += '<div class="quiz__cards">';
      top.forEach(function (c, i) {
        h += '<article class="quiz__card">';
        if (i === 0) h += '<p class="quiz__card-badge">' + esc(t('quiz_result_badge')) + '</p>';
        h += '<h3 class="quiz__card-title"><a href="' + esc(c.url) + '">' + esc(c.title) + '</a></h3>';
        var mot = motiveFor(c.slug, r.contrib);
        if (mot) h += '<p class="quiz__card-motive">' + esc(mot) + '</p>';
        h += '<div class="quiz__card-foot">';
        if (c.preu_1) h += '<span class="quiz__card-price">' + esc(t('quiz_result_price_from')) + ' ' + c.preu_1 + ' €</span>';
        h += '<a class="btn btn--primary btn--sm" href="' + esc(c.url) + '">' + esc(t('quiz_result_see')) + '</a>';
        h += '</div></article>';
      });
      h += '</div>';
    }

    if (top.length >= 2 && top[0].linia && top[0].linia === top[1].linia && (state.format === 'f2' || state.format === 'f3')) {
      var slugs = linies[top[0].linia] || [];
      if (slugs.length) {
        h += '<div class="quiz__recorregut"><h3>' + esc(t('quiz_result_recorregut_title')) + '</h3><ol>';
        slugs.forEach(function (s) {
          var c = null; courses.forEach(function (x) { if (x.slug === s) c = x; });
          if (c) h += '<li><a href="' + esc(c.url) + '">' + esc(c.title) + '</a></li>';
        });
        h += '</ol></div>';
      }
    }

    if (!tutFirst && tut) h += '<p class="quiz__tutoria-final">' + esc(t('quiz_result_tutoria_text')) + ' <a href="' + esc(tut.url) + '">' + esc(t('quiz_result_tutoria_title')) + '</a></p>';

    var prep = data.prep || [];
    if (prep.length) {
      h += '<div class="quiz__prep"><h3>' + esc(t('quiz_result_preparacio_title')) + '</h3><ul>';
      prep.slice(0, 4).forEach(function (p) {
        h += '<li><span class="quiz__prep-title">' + esc(p.title) + '</span><span class="quiz__prep-date">' + esc(p.date) + '</span><a class="quiz__prep-cta" href="' + esc(contact + '?taller=' + p.slug + '#formulari') + '">' + esc(t('quiz_interest_cta')) + '</a></li>';
      });
      h += '</ul></div>';
    }

    var contactUrl = contact;
    if (top.length) {
      var rec = top.map(function (c) { return c.title; }).join(' · ');
      contactUrl = contact + '?taller=' + encodeURIComponent(top[0].slug) + '&missatge=' + encodeURIComponent(t('quiz_result_contact_title') + ' ' + rec) + '#formulari';
    }
    h += '<div class="quiz__contact"><h3>' + esc(t('quiz_result_contact_title')) + '</h3>'
      + '<p>' + esc(t('quiz_result_contact_text')) + '</p>'
      + '<a class="btn btn--secondary" href="' + esc(contactUrl) + '">' + esc(t('quiz_result_contact_cta')) + '</a></div>';
    h += '<div class="quiz__nav"><button type="button" class="btn btn--ghost" data-restart>' + esc(t('quiz_result_restart')) + '</button></div>';

    app.innerHTML = h;
    app.querySelector('[data-restart]').addEventListener('click', function () {
      state = { step: 0, nivell: null, interessa: [], format: null };
      render();
    });
  }

  render();
})();
