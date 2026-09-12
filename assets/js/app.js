/* nuno — theme toggles, typed masthead, table of contents, code copy.
   Deferred. Everything is feature-detected, so a failure in one block never
   takes the others down. */
(function () {
  'use strict';

  /* navigator.platform is deprecated. userAgentData.platform is the replacement
     but is Chromium-only, so fall back through it to the old property and then
     to the UA string — Safari and Firefox still need one of those two. */
  var IS_MAC = (function () {
    var uad = navigator.userAgentData;
    if (uad && typeof uad.platform === 'string' && uad.platform) {
      return /mac/i.test(uad.platform);
    }
    return /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  })();

  /* Strings come from i18n/*.toml via partials/scripts.html; the fallbacks keep
     the UI legible if that partial is ever missing. */
  var T = (window.NUNO && window.NUNO.i18n) || {};
  function t(key, fallback) { return T[key] || fallback; }

  var store = (function () {
    try {
      localStorage.setItem('nuno-t', '1');
      localStorage.removeItem('nuno-t');
      return localStorage;
    } catch (e) {
      return null;
    }
  })();

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* --- Theme + ground --------------------------------------------------- */

  function theme() { return root.getAttribute('data-theme'); }
  function ground() { return root.getAttribute('data-ground'); }

  function paintToggles() {
    var dark = theme() === 'dark';
    $$('[data-nuno-theme-glyph]').forEach(function (el) {
      el.textContent = dark ? '☾' : '☀';
    });
    $$('[data-nuno-theme-toggle]').forEach(function (el) {
      el.setAttribute('aria-label', dark
        ? t('toLight', 'Switch to light mode')
        : t('toDark', 'Switch to dark mode'));
    });
    var brown = ground() === 'brown';
    $$('[data-nuno-ground-label]').forEach(function (el) {
      el.textContent = brown
        ? t('toGreen', 'Switch to green')
        : t('toBrown', 'Switch to brown');
    });
  }

  $$('[data-nuno-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = theme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      root.style.colorScheme = next;
      if (store) store.setItem('nuno-theme', next);
      paintToggles();
    });
  });

  $$('[data-nuno-ground-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = ground() === 'brown' ? 'green' : 'brown';
      root.setAttribute('data-ground', next);
      if (store) store.setItem('nuno-ground', next);
      paintToggles();
    });
  });

  $$('[data-nuno-kbd]').forEach(function (el) {
    el.textContent = IS_MAC ? '⌘K' : 'Ctrl K';
  });

  paintToggles();

  /* --- Sticky nav hairline ---------------------------------------------- */

  (function stickyNav() {
    var nav = $('.nav');
    if (!nav) return;
    var ticking = false;
    var sync = function () {
      nav.classList.toggle('is-stuck', window.pageYOffset > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }, { passive: true });
    sync();
  })();

  /* --- Search: loaded on first use only --------------------------------- */

  var searchPromise = null;
  function loadSearch() {
    if (searchPromise) return searchPromise;
    searchPromise = new Promise(function (resolve, reject) {
      var cfg = window.NUNO || {};
      if (!cfg.search) return reject(new Error('no search bundle'));
      var s = document.createElement('script');
      s.src = cfg.search;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return searchPromise;
  }

  function openSearch() {
    loadSearch().then(function () {
      if (window.nunoSearch) window.nunoSearch.open();
    }).catch(function () { /* search is an enhancement; ignore */ });
  }

  $$('[data-nuno-search-open]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openSearch();
    });
  });

  document.addEventListener('keydown', function (e) {
    var mod = IS_MAC ? e.metaKey : e.ctrlKey;
    if (mod && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openSearch();
      return;
    }
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var t = e.target;
      var tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      e.preventDefault();
      openSearch();
    }
  });

  /* --- Typed masthead ---------------------------------------------------- */

  (function typer() {
    var host = $('[data-nuno-typer]');
    if (!host) return;
    var payload = $('[data-nuno-quotes]', host);
    var line = $('.typer__line', host);
    if (!payload || !line) return;

    var lines;
    try { lines = JSON.parse(payload.textContent); } catch (e) { return; }
    // Tolerate a double-encoded payload rather than silently not animating.
    if (typeof lines === 'string') {
      try { lines = JSON.parse(lines); } catch (e) { return; }
    }
    if (!Array.isArray(lines) || !lines.length) return;

    var spans = [];

    function build(l) {
      var full = l.pre + l.accent;
      line.textContent = '';
      spans = [];
      for (var i = 0; i < full.length; i++) {
        var ch = full.charAt(i);
        if (ch === '\n') {
          line.appendChild(document.createElement('br'));
          spans.push(null);
          continue;
        }
        var s = document.createElement('span');
        s.textContent = ch;
        if (i >= l.pre.length) s.className = 'is-accent';
        line.appendChild(s);
        spans.push(s);
      }
    }

    function paint(n) {
      for (var i = 0; i < spans.length; i++) {
        var s = spans[i];
        if (!s) continue;
        s.classList.toggle('is-untyped', i >= n);
        s.classList.toggle('typer__cursor', i === n - 1);
      }
    }

    // Reduced motion: one line, static, no cursor.
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var pick = lines[Math.floor(Math.random() * lines.length)];
      build(pick);
      paint(spans.length);
      $$('.typer__cursor', line).forEach(function (s) { s.classList.remove('typer__cursor'); });
      return;
    }

    var i = 0, n = 0, phase = 'type', timer = null;
    build(lines[0]);
    paint(0);

    function tick() {
      var l = lines[i];
      var full = l.pre + l.accent;
      var delay;

      if (phase === 'type') {
        if (n < full.length) {
          var ch = full.charAt(n);
          delay = ch === '\n' ? 420 : /[.,:—]/.test(ch) ? 240 : 40;
          n += 1;
        } else {
          phase = 'hold';
          host.classList.add('is-holding');
          delay = 3800;
        }
      } else if (phase === 'hold') {
        phase = 'erase';
        host.classList.remove('is-holding');
        delay = 0;
      } else {
        if (n > 0) {
          n -= 1;
          delay = 16;
        } else {
          i = (i + 1) % lines.length;
          phase = 'type';
          build(lines[i]);
          delay = 500;
        }
      }

      paint(n);
      timer = setTimeout(tick, delay);
    }

    timer = setTimeout(tick, 600);

    // Stop burning frames when the tab is hidden.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(timer);
      } else {
        clearTimeout(timer);
        timer = setTimeout(tick, 400);
      }
    });
  })();

  /* --- Table of contents ------------------------------------------------- */

  (function toc() {
    var nav = $('[data-nuno-toc]');
    var article = $('.prose');
    if (!nav || !article || !window.IntersectionObserver) return;

    var links = {};
    $$('a[href^="#"]', nav).forEach(function (a) {
      links[decodeURIComponent(a.getAttribute('href').slice(1))] = a;
    });

    var headings = $$('h2[id], h3[id]', article).filter(function (h) {
      return links[h.id];
    });
    if (!headings.length) return;

    var active = null;
    function setActive(id) {
      if (active === id) return;
      if (active && links[active]) links[active].classList.remove('is-active');
      active = id;
      if (links[id]) links[id].classList.add('is-active');
    }

    var visible = [];
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var at = visible.indexOf(id);
        if (entry.isIntersecting && at < 0) visible.push(id);
        if (!entry.isIntersecting && at >= 0) visible.splice(at, 1);
      });
      if (visible.length) {
        // Pick the topmost heading currently in the band.
        var first = headings.filter(function (h) { return visible.indexOf(h.id) >= 0; })[0];
        if (first) setActive(first.id);
      }
    }, { rootMargin: '-20% 0px -70% 0px' });

    headings.forEach(function (h) { observer.observe(h); });
    setActive(headings[0].id);
  })();

  /* --- Home: show more --------------------------------------------------- */

  (function showMore() {
    var btn = $('[data-nuno-show-more]');
    if (!btn) return;
    var extras = $$('[data-nuno-extra]');
    if (!extras.length) return;

    /* The extras ship visible and are hidden here, so a reader without
       JavaScript gets the longer list rather than a button that cannot do
       anything. */
    extras.forEach(function (el) { el.hidden = true; });
    btn.hidden = false;

    btn.addEventListener('click', function () {
      extras.forEach(function (el) { el.hidden = false; });
      btn.hidden = true;
      /* The button has just vanished from under the keyboard focus, which would
         drop the reader back at the top of the document. Hand focus to the
         first card that appeared instead. */
      if (extras[0] && extras[0].focus) extras[0].focus();
    });
  })();

  /* --- Copy buttons ------------------------------------------------------ */

  $$('[data-nuno-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.code');
      var pre = block && block.querySelector('pre');
      if (!pre) return;
      var text = pre.innerText.replace(/\n$/, '');

      var done = function () {
        btn.textContent = t('copied', 'Copied');
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = t('copy', 'Copy');
          btn.classList.remove('is-copied');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* no-op */ }
        document.body.removeChild(ta);
      }
    });
  });
})();
