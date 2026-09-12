# Security Policy

## Supported versions

The `main` branch is the only supported version. Fixes are not backported.

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Use GitHub's private vulnerability reporting:
[**Report a vulnerability**](https://github.com/that-daniel/nuno/security/advisories/new).
That opens a private thread visible only to you and the maintainer.

Expect an initial response within a week. This is a spare-time project, so
please be patient — and if the issue is being actively exploited somewhere, say
so up front and it will be prioritised.

## Scope

nuno is a Hugo theme: templates, CSS and a little JavaScript. It has no server
component, no database, and makes no network requests at runtime. That rules out
most vulnerability classes, but the following are genuinely in scope:

- **Cross-site scripting.** The theme uses `safeHTML`, `safeJS` and `safeCSS` in
  a handful of places where Go's contextual escaping gets in the way — the typed
  masthead payload, the speculation-rules block, the inlined stylesheet, and the
  `masthead` / `aboutHeading` params. A way to get script execution from
  ordinary post content or front matter is a vulnerability.
- **Content injection through the search index.** `layouts/index.json` and
  `assets/js/search.js` build and render results from page titles, descriptions
  and tags. The renderer escapes these, and a bypass is a vulnerability.
- **Build-time file disclosure** — anything that causes Hugo to publish a file
  from outside the site that the author did not intend.

Out of scope:

- Vulnerabilities in Hugo itself. Report those to
  [gohugoio/hugo](https://github.com/gohugoio/hugo/security).
- Anything requiring the attacker to already control the site's source, config
  or `data/` files. A site owner writing `<script>` into their own
  `params.masthead` is a documented capability, not a vulnerability.
- Missing hardening headers. A theme cannot set HTTP headers; those belong to
  your host.
- Reports from automated scanners with no demonstrated impact.
