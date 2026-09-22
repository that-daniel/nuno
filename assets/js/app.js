/* nuno — theme toggles, typed masthead, table of contents, the series
   panel and its mobile sheet, code copy.
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
    /* Open synchronously when the bundle is already in. iOS only raises the
       keyboard for a focus() that is still inside the tap that asked for it,
       and a network round trip puts us well outside it. */
    if (window.nunoSearch) {
      window.nunoSearch.open();
      return;
    }
    loadSearch().then(function () {
      if (window.nunoSearch) window.nunoSearch.open();
    }).catch(function () { /* search is an enhancement; ignore */ });
  }

  $$('[data-nuno-search-open]').forEach(function (el) {
    /* Warm the bundle on the press, before the click lands, so the click above
       almost always takes the synchronous path. Pointer events cover both mice
       and touch; the touchstart is for older iOS. */
    ['pointerdown', 'touchstart'].forEach(function (evt) {
      el.addEventListener(evt, function () {
        loadSearch().catch(function () {});
      }, { passive: true });
    });

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
    if (!nav || !article) return;

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

    /* The heading whose section is being read: the last one to have crossed the
       line just below the nav.

       This used to ask an IntersectionObserver which headings sat inside a thin
       band and only moved the highlight while one did. Any section taller than
       the band — which is most of them — scrolled its heading straight through,
       leaving the highlight stranded on the section before it for the whole
       read. Position beats intersection here: there is always a last heading
       above the line, so there is always an answer. */
    function currentId() {
      var navH = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 60;
      /* 8px past the headings' own scroll-margin-top, so clicking a TOC link
         lands its heading above the line rather than a pixel under it. */
      var line = navH + 24;
      var id = headings[0].id;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top > line) break;
        id = headings[i].id;
      }
      /* At the very bottom the last section can be too short to ever reach the
         line, and it is still the one on screen. */
      var doc = document.documentElement;
      if (window.pageYOffset + window.innerHeight >= doc.scrollHeight - 2) {
        id = headings[headings.length - 1].id;
      }
      return id;
    }

    var ticking = false;
    var sync = function () {
      setActive(currentId());
      ticking = false;
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sync();
  })();

  /* --- Aside panel: Chapters / Contents ---------------------------------- */

  (function panel() {
    var host = $('[data-nuno-panel]');
    if (!host) return;
    var tabs = $$('[data-nuno-tab]', host);
    var panes = $$('[data-nuno-pane]', host);
    /* A panel with no tab strip is a chapter list on its own — nothing to
       switch between, and no stored preference worth honouring. */
    if (tabs.length < 2) return;

    function select(name, focus) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-nuno-tab') === name;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        /* One stop in the tab order for the whole strip, per the ARIA tabs
           pattern: Tab moves past it, the arrows move within it. */
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panes.forEach(function (pane) {
        pane.hidden = pane.getAttribute('data-nuno-pane') !== name;
      });
      if (store) {
        try { store.setItem('nuno-panel', name); } catch (e) { /* full or denied */ }
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(tab.getAttribute('data-nuno-tab'), false);
      });
      tab.addEventListener('keydown', function (e) {
        var next = -1;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next < 0) return;
        e.preventDefault();
        select(tabs[next].getAttribute('data-nuno-tab'), true);
      });
    });

    /* A reader who switched to Contents on one chapter wants Contents on the
       next one too — the choice is about how they are reading the series, not
       about the page they happened to be on. */
    var saved = null;
    if (store) {
      try { saved = store.getItem('nuno-panel'); } catch (e) { saved = null; }
    }
    if (saved && $('[data-nuno-pane="' + saved + '"]', host)) select(saved, false);
  })();

  /* --- The panel's mobile sheet ------------------------------------------ */

  (function panelSheet() {
    var fab = $('[data-nuno-sheet-open]');
    var sheet = $('#nuno-sheet');
    var slot = $('[data-nuno-sheet-slot]');
    var panel = $('[data-nuno-panel]');
    var aside = $('.post__aside');
    if (!fab || !sheet || !slot || !panel || !aside) return;

    /* Keep the 760px in step with the breakpoint in nuno.css that hides the
       aside — the sheet exists only for the widths where the aside does not. */
    var narrow = window.matchMedia('(max-width: 760px)');
    /* The tag line follows the panel in the aside, so the panel goes back in
       front of it rather than on the end. */
    var tagged = $('.post__tagged', aside);
    var lastFocus = null;

    function close() {
      if (sheet.hidden) return;
      sheet.hidden = true;
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      /* Back where the reader was, but never to <body>: a tap leaves the
         button unfocused on some browsers, and handing focus to the document
         would strand a keyboard user at the top of the page. */
      var back = lastFocus && lastFocus !== document.body && lastFocus.isConnected
        ? lastFocus
        : fab;
      if (back.focus) back.focus({ preventScroll: true });
    }

    function open() {
      if (!sheet.hidden) return;
      lastFocus = document.activeElement;
      sheet.hidden = false;
      fab.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var close$ = $('.sheet__close', sheet);
      if (close$) close$.focus({ preventScroll: true });
    }

    /* One panel, two homes. Moving the node keeps every id unique and keeps the
       table of contents' scroll tracking — bound on load — pointing at the
       element it was bound to. */
    function place() {
      if (narrow.matches) {
        if (panel.parentNode !== slot) slot.appendChild(panel);
      } else {
        close();
        if (panel.parentNode === slot) aside.insertBefore(panel, tagged || null);
      }
    }

    place();
    /* addListener is the deprecated spelling, and the only one Safari below
       14 has. */
    if (narrow.addEventListener) narrow.addEventListener('change', place);
    else if (narrow.addListener) narrow.addListener(place);

    fab.addEventListener('click', open);
    $$('[data-nuno-sheet-close]', sheet).forEach(function (el) {
      el.addEventListener('click', close);
    });

    /* A table of contents link scrolls the page behind the sheet, so staying
       open would hide the heading the reader just asked for. Chapter links
       navigate away and the sheet goes with the page. */
    sheet.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a) close();
    });

    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      /* Keep focus inside the sheet while it is open. */
      if (e.key !== 'Tab') return;
      var focusable = $$('button, a[href]', sheet).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  })();

  /* --- Reading progress -------------------------------------------------- */

  (function progress() {
    var bar = $('[data-nuno-progress]');
    if (!bar) return;
    var ticking = false;
    /* scaleX rather than width: a transform is composited, so this does not
       force layout on every frame of a scroll. */
    var sync = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.pageYOffset / max : 0;
      bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, p)) + ')';
      ticking = false;
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sync();
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

  /* --- Comments (giscus) -------------------------------------------------- */

  (function comments() {
    var mount = $('[data-nuno-giscus]');
    if (!mount) return;
    var d = mount.dataset;
    var ORIGIN = 'https://giscus.app';
    var loaded = false;

    function wanted() {
      return theme() === 'light' ? d.themeLight : d.themeDark;
    }

    function load() {
      if (loaded) return;
      loaded = true;
      var s = document.createElement('script');
      s.src = ORIGIN + '/client.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      /* Giscus reads its whole configuration off the script tag. */
      s.setAttribute('data-repo', d.repo);
      s.setAttribute('data-repo-id', d.repoId);
      s.setAttribute('data-category', d.category);
      s.setAttribute('data-category-id', d.categoryId);
      s.setAttribute('data-mapping', d.mapping);
      s.setAttribute('data-strict', d.strict);
      s.setAttribute('data-reactions-enabled', d.reactionsEnabled);
      s.setAttribute('data-emit-metadata', d.emitMetadata);
      s.setAttribute('data-input-position', d.inputPosition);
      s.setAttribute('data-lang', d.lang);
      s.setAttribute('data-loading', 'lazy');
      s.setAttribute('data-theme', wanted());
      mount.appendChild(s);
    }

    /* The theme's one third-party request, so it is not made until the reader
       actually arrives — a visit that never reaches the foot of the article
       costs nothing. 400px of margin means it is already there by the time it
       is on screen. */
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) { io.disconnect(); load(); return; }
        }
      }, { rootMargin: '400px 0px' });
      io.observe(mount);
    } else {
      load();
    }

    /* Follow the theme toggle. Watching the attribute rather than listening on
       the button catches every route that can change it, including another tab
       via storage. */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        var frame = $('iframe.giscus-frame', mount);
        if (!frame || !frame.contentWindow) return;
        frame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: wanted() } } }, ORIGIN);
      }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
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
