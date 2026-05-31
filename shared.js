/**
 * TEH LOGISTICS — SHARED JAVASCRIPT
 * The Eleventh Hour Logistics, Inc.  |  tehlogistics.com
 *
 * TABLE OF CONTENTS
 * ─────────────────────────────────────────────────────────
 * 1.  NAV SCROLL         — frosted glass on scroll
 * 2.  MOBILE MENU        — hamburger toggle
 * 3.  ACTIVE NAV LINK    — highlights current page
 * 4.  SCROLL REVEAL      — IntersectionObserver fade-in
 * 5.  SMOOTH ANCHOR      — smooth scroll for #hash links
 * 6.  TICK SOUND         — Web Audio API clock tick
 * 7.  FORM HANDLER       — Formspree submission + validation
 * 8.  PORTAL HOOKS       — stubs for Appscrip SSO / redirects
 * 9.  CLOCK LOADER       — "Eleventh Hour" splash screen
 *
 * FOR APPSCRIP DEVELOPERS
 * ─────────────────────────────────────────────────────────
 * Section 8 (window.TEH.portal) is your integration point.
 * Replace stub functions with real SSO/redirect logic.
 * Do not modify sections 1–7 — shared UI behaviour.
 * ─────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     1. NAV SCROLL
     Adds .nav--scrolled to <nav class="nav"> after 40px.
     Change THRESHOLD to adjust trigger point.
  ═══════════════════════════════════════════════════════ */
  var THRESHOLD = 40;

  function initNavScroll() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('nav--scrolled', window.scrollY > THRESHOLD);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ═══════════════════════════════════════════════════════
     2. MOBILE MENU
     Toggles .is-open on .mob-menu and .nav-hamburger.
     Locks body scroll when menu is open.
  ═══════════════════════════════════════════════════════ */
  var _menuOpen = false;

  function initMobileMenu() {
    var btn = document.getElementById('navHamburger');
    var menu = document.getElementById('mobMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      _menuOpen = !_menuOpen;
      btn.classList.toggle('is-open', _menuOpen);
      menu.classList.toggle('is-open', _menuOpen);
      document.body.style.overflow = _menuOpen ? 'hidden' : '';
      btn.setAttribute('aria-expanded', _menuOpen ? 'true' : 'false');
    });
  }

  // Exposed globally so mobile links can call closeMenu() onclick
  window.TEH = window.TEH || {};

  window.TEH.closeMenu = function () {
    _menuOpen = false;
    var btn = document.getElementById('navHamburger');
    var menu = document.getElementById('mobMenu');
    if (btn) {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    if (menu) {
      menu.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  };

  /* ═══════════════════════════════════════════════════════
     3. ACTIVE NAV LINK
     Matches current page filename to nav link hrefs.
     Adds .nav-link--active and .mob-link--active.
  ═══════════════════════════════════════════════════════ */
  function initActiveLink() {
    var page = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link, .mob-link').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop().split('#')[0];
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add(
          link.classList.contains('nav-link') ? 'nav-link--active' : 'mob-link--active'
        );
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     4. SCROLL REVEAL
     Observes all .teh-reveal elements.
     Adds .teh-reveal--visible when they enter viewport.
     Once visible, element is unobserved (one-shot).
  ═══════════════════════════════════════════════════════ */
  function initReveal() {
    var els = document.querySelectorAll('.teh-reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately for old browsers
      els.forEach(function (el) {
        el.classList.add('teh-reveal--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('teh-reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════
     5. SMOOTH ANCHOR SCROLL
     Intercepts all href="#..." clicks.
     Offsets by nav height so content is not hidden under fixed nav.
  ═══════════════════════════════════════════════════════ */
  function initSmoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--teh-nav-h'),
          10
        ) || 72;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
        window.TEH.closeMenu();
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     6. TICK SOUND
     Generates a subtle clock tick using Web Audio API.
  ═══════════════════════════════════════════════════════ */
  window.TEH.playTick = function () {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = 1200; // Hz — raise for higher pitch

      gain.gain.setValueAtTime(0.20, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Silently fail if AudioContext is unavailable
    }
  };

  /* ═══════════════════════════════════════════════════════
     7. FORM HANDLER
     Formspree submission + validation
  ═══════════════════════════════════════════════════════ */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_YOUR_ID';

  window.TEH.submitForm = function (e, formId, btnId) {
    e.preventDefault();

    var form = document.getElementById(formId);
    var btn = document.getElementById(btnId);
    if (!form || !btn) return;

    // --- Client-side validation ---
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      field.style.outline = '';
      if (!field.value.trim()) {
        field.style.outline = '1px solid #EF4444';
        valid = false;
      }
      if (field.type === 'email' && field.value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.style.outline = '1px solid #EF4444';
        valid = false;
      }
    });

    if (!valid) {
      var orig = btn.textContent;
      btn.textContent = 'Please fill in all required fields';
      setTimeout(function () {
        btn.textContent = orig;
      }, 3000);
      return;
    }

    // --- Submit ---
    var originalLabel = btn.dataset.label || btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
      .then(function (res) {
        if (res.ok) {
          window.TEH.playTick();
          btn.textContent = '✓ Sent — we\'ll respond within 24 hours';
          btn.style.background = '#16A34A';
          btn.style.borderColor = '#16A34A';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Error — please try again';
        btn.style.background = '#DC2626';
        btn.style.borderColor = '#DC2626';
        setTimeout(function () {
          btn.textContent = originalLabel;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3500);
      });
  };

  /* ═══════════════════════════════════════════════════════
     8. PORTAL HOOKS  (FOR APPSCRIP DEVELOPERS)
  ═══════════════════════════════════════════════════════ */
  window.TEH.portal = {
    carrier: function (e) {
      if (e) e.preventDefault();
      console.info('[TEH] carrier portal hook — awaiting Appscrip integration');
    },
    agent: function (e) {
      if (e) e.preventDefault();
      console.info('[TEH] agent portal hook — awaiting Appscrip integration');
    },
    tracking: function (e) {
      if (e) e.preventDefault();
      console.info('[TEH] tracking portal hook — awaiting Appscrip integration');
    },
    hub: function (e) {
      if (e) e.preventDefault();
      console.info('[TEH] hub portal hook — awaiting Appscrip integration');
    }
  };

  function initPortalLinks() {
    document.querySelectorAll('[data-portal]').forEach(function (el) {
      var key = el.dataset.portal;
      if (window.TEH.portal[key]) {
        el.addEventListener('click', window.TEH.portal[key]);
      }
    });
  }

/* ═══════════════════════════════════════════════════════
     9. CLOCK LOADER (VIDEO ANIMATION ENGINE)
  ═══════════════════════════════════════════════════════ */
  function initClockLoader() {
    const loader = document.getElementById("loader");
    const video = document.getElementById("loaderVideo");

    if (!loader || !video) return;

    // 1. Ticking Audio Sync Engine
    let tickInterval;
    function startTicking() {
      tickInterval = setInterval(() => {
        if (typeof window.TEH.playTick === 'function') {
          //window.TEH.playTick();
        }
      }, 500); // 2 ticks per second matching standard temporal pacing
    }

    // 2. Clear out and reveal structural viewport content
    function revealPage() {
      if (loader.classList.contains("loader--hidden")) return;
      
      clearInterval(tickInterval);
      
      setTimeout(() => {
        loader.classList.add("loader--hidden");
        document.body.style.overflow = ''; // Unlocks browser view frame scrolling
        if (typeof window.TEH.initClockAlert === "function") {
          window.TEH.initClockAlert();
        }
      }, 400); // Visual settling threshold padding
    }

    // 3. Thread triggers
    startTicking();

    // Fires precisely when the mp4 rendering reaches total completion
    video.addEventListener("ended", revealPage);

    // Fail-safe: In case raw system permissions block video initialization
    setTimeout(revealPage, 5500); 
  }

  /* ═══════════════════════════════════════════════════════
     INIT — run all modules on DOM ready
  ═══════════════════════════════════════════════════════ */
  function init() {
    // FIX: Lock the scroll here instantly on payload start
    document.body.style.overflow = 'hidden';

    initNavScroll();
    initMobileMenu();
    initActiveLink();
    initReveal();
    initSmoothAnchor();
    initPortalLinks();
    
    // Remember to uncomment this line to plug your loader back in!
    initClockLoader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());