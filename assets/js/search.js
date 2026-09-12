/* nuno — search overlay. Loaded on first use, never on first paint. */
(function () {
  'use strict';

  var MAX = 12;
  /* Strings arrive pre-rendered from i18n/*.toml via partials/scripts.html. */
  var T = (window.NUNO && window.NUNO.i18n) || {};
  var overlay = document.getElementById('nuno-search');
  var input = document.getElementById('nuno-search-input');
  var list = document.getElementById('nuno-search-results');
  var countEl = document.querySelector('[data-nuno-search-count]');
  var emptyTpl = document.getElementById('nuno-search-empty');
  if (!overlay || !input || !list) return;

  var data = null;
  var loading = null;
  var rows = [];
  var active = -1;
  var lastFocus = null;
  var debounce = null;

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function load() {
    if (loading) return loading;
    var url = (window.NUNO && window.NUNO.index) || '/index.json';
    loading = fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (json) { data = json; return json; })
      .catch(function () { data = []; return []; });
    return loading;
  }

  /* Substring match across title, excerpt and tags. Title hits rank first. */
  function search(q) {
    if (!data) return [];
    var needle = q.toLowerCase();
    var titleHits = [];
    var otherHits = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item.t.toLowerCase().indexOf(needle) >= 0) {
        titleHits.push(item);
      } else if (
        (item.d && item.d.toLowerCase().indexOf(needle) >= 0) ||
        (item.g && item.g.indexOf(needle) >= 0)
      ) {
        otherHits.push(item);
      }
    }
    return titleHits.concat(otherHits).slice(0, MAX);
  }

  function highlight(title, q) {
    var at = title.toLowerCase().indexOf(q.toLowerCase());
    if (at < 0) return esc(title);
    return esc(title.slice(0, at)) +
      '<mark>' + esc(title.slice(at, at + q.length)) + '</mark>' +
      esc(title.slice(at + q.length));
  }

  function renderEmpty(q) {
    list.innerHTML = '';
    rows = [];
    active = -1;
    if (countEl) countEl.textContent = '';
    if (!emptyTpl) return;
    var node = emptyTpl.content.cloneNode(true);
    var slot = node.querySelector('[data-q]');
    if (slot) slot.textContent = q;
    list.appendChild(node);
  }

  function render(results, q) {
    if (!q) {
      list.innerHTML = '';
      rows = [];
      active = -1;
      if (countEl) countEl.textContent = '';
      return;
    }
    if (!results.length) return renderEmpty(q);

    var html = '';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      html += '<a class="result" role="option" href="' + esc(r.u) + '">' +
        '<span class="result__text">' +
          '<span class="result__title">' + highlight(r.t, q) + '</span>' +
          (r.d ? '<span class="result__excerpt">' + esc(r.d) + '</span>' : '') +
        '</span>' +
        '<span class="result__meta">' + esc(r.m) + '</span>' +
      '</a>';
    }
    list.innerHTML = html;
    rows = Array.prototype.slice.call(list.querySelectorAll('.result'));

    if (countEl) {
      var tpl = results.length === 1
        ? (T.resultOne || '{n} post')
        : (T.resultMany || '{n} posts');
      countEl.textContent = tpl.replace('{n}', results.length);
    }

    rows.forEach(function (row, i) {
      row.addEventListener('mouseenter', function () { setActive(i); });
    });
    setActive(0);
  }

  function setActive(i) {
    if (!rows.length) return;
    if (active >= 0 && rows[active]) {
      rows[active].classList.remove('is-active');
      rows[active].removeAttribute('aria-selected');
    }
    active = (i + rows.length) % rows.length;
    var row = rows[active];
    row.classList.add('is-active');
    row.setAttribute('aria-selected', 'true');
    if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
  }

  function onInput() {
    clearTimeout(debounce);
    debounce = setTimeout(function () {
      var q = input.value.trim();
      load().then(function () { render(search(q), q); });
    }, 80);
  }

  function open() {
    if (!overlay.hidden) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    load();
    input.focus();
    input.select();
    if (input.value.trim()) onInput();
  }

  function close() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  input.addEventListener('input', onInput);

  Array.prototype.forEach.call(
    overlay.querySelectorAll('[data-nuno-search-close]'),
    function (btn) { btn.addEventListener('click', close); }
  );

  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
      return;
    }
    if (e.key === 'Enter') {
      if (active >= 0 && rows[active]) {
        e.preventDefault();
        window.location.href = rows[active].getAttribute('href');
      }
      return;
    }
    // Keep focus inside the overlay while it is open.
    if (e.key === 'Tab') {
      var focusable = overlay.querySelectorAll('input, button, a[href]');
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
    }
  });

  window.nunoSearch = { open: open, close: close };
})();
