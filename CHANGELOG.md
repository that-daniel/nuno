# Changelog

Notable changes to nuno.

Versions are git tags (`v0.2.0`), which is what Hugo Modules and submodule
pinning both read. While the theme is `0.x`, a minor bump may carry a breaking
change and will say so at the top of its section; patch releases never do. The
other contract that matters is `min_version` in `theme.toml` — raising it is
always a minor bump at least.

## Unreleased

### Added

- **`hugo.toml` at the theme root declaring `[module.hugoVersion]`.**
  themes.gohugo.io reads the supported Hugo range from there rather than from
  `min_version` in `theme.toml`; the two are kept in step. It also improves the
  failure on an old Hugo from a cryptic template error to
  `Module "nuno" is not compatible with this Hugo version: Min 0.158.0`.
  `extended` is deliberately unset — it was deprecated in 0.153.0.

- The demo now publishes one build per home style, so each can be linked
  directly: `/ledger/`, `/profile/`, `/grouped/`. Real builds of the same
  content under a subpath, not screenshots, so they cannot drift.
- Dark and light screenshots in the README, referenced by absolute URL so they
  render on themes.gohugo.io as well as on GitHub.

## 0.2.1 — 2026-09-12

No breaking changes, but **one visible behaviour change**: the "Updated …"
byline added in 0.2.0 is now off by default. If you were relying on it, set
`params.showLastmod: true`.

### Fixed

- **The "Updated …" byline no longer fires on commit noise.** It is now behind
  `params.showLastmod`, off by default. Hugo's `.Lastmod` is not a claim that
  the author revised anything: with `enableGitInfo`, the default
  `frontmatter.lastmod` resolves `:git` first, so it is the last commit that
  touched the file. On a site whose posts were bulk-imported, 0.2.0 told readers
  every one of them had been updated on the import date. The README now explains
  how to reorder `frontmatter.lastmod` if you want the line to mean author
  intent. `article:modified_time` and JSON-LD `dateModified` are unchanged.
- **A site-wide `comments: false` now works.** The giscus partial read
  `.Params.comments`, which is page front matter only, so setting it in site
  params did nothing. It now uses `.Param`, which falls back page → site, with a
  page still able to override.

## 0.2.0 — 2026-09-12

No breaking changes: every addition below is opt-in or additive, and a site that
upgrades without touching its config renders exactly as it did on 0.1.0.

### Added

- **Home page styles — two independent switches.** `params.homeHeader`
  (`masthead` | `profile`) picks the hero and `params.homeStyle` (`grid` |
  `ledger`) picks the post list, the same shape as theme × ground. `profile` is
  a portrait, name, bio and social row in place of the masthead; `ledger` is
  numbered full-width rows, which unlike the grid never leaves a partial row.
  `params.homeGroupByYear` splits a ledger under year headings. Each piece lives
  in `layouts/partials/home/`, so a site can override one without forking
  `index.html`. Unrecognised values warn and fall back. Existing sites need no
  change: with the params unset the home page renders exactly as before.
- `params.profileBio` sets the bio in the profile header; defaults to
  `params.description`.
- **Series navigation.** A post in a `series` lists every part with the current
  one marked. Chronological unless every part sets `seriesOrder`; a series of
  one renders nothing.
- **Related posts** under each post, from Hugo's similarity index, restricted to
  `mainSections`. Needs a `related` config to produce anything — see the README.
  `params.relatedCount` caps it.
- **Self-linking heading anchors**, via a render hook that keeps Hugo's own
  anchor so the table of contents still resolves.
- **`params.postsOnHomeMax`** renders further home posts behind a "Show more"
  button. No second request, and no-JS gets the longer list.
- **JSON-LD**: `BlogPosting` on posts, `WebSite` on the home page, nothing
  elsewhere.
- **`lastmod`** shows an "Updated …" byline and `article:modified_time`,
  compared by calendar day.
- **Multilingual head links** — `hreflang` alternates, `x-default`, `og:locale`,
  and a nav language switcher listing only languages the page exists in.
- **A print stylesheet.** Forced light palette, chrome dropped, external URLs
  spelled out.
- **Footnote styling** for Goldmark's markup, including a `:target` mark.
- **`params.readingProgress`** — an optional scroll bar on posts.
- **Releases.** Versions are git tags; pushing a `vX.Y.Z` tag publishes a GitHub
  Release from the matching changelog section. A `go.mod` makes the module path
  explicit, so `hugo mod get github.com/that-daniel/nuno@vX.Y.Z` resolves to the
  tag rather than to a timestamped pseudo-version.
- **Optional giscus comments.** Off unless configured, rendered on posts only,
  disabled per page with `comments: false`, and never printed. The script is not
  requested until the reader scrolls to it, so enabling comments costs nothing
  on a page view that never reaches the bottom — the theme's only third-party
  connection, made as late as possible. The embed follows the light/dark toggle.
  An incomplete config warns at build time rather than shipping the empty box
  giscus renders for one.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue and pull request
  templates, and Dependabot for the workflow actions.

### Changed

- **The portrait and the social icon row moved into shared partials**
  (`portrait.html`, `social-row.html`). The About page and the profile home
  header now resolve `params.portrait` through the same lookup order — page
  resource first, then `assets/` — rather than two copies that could drift. The
  About page's rendered markup is unchanged.
- **`min_version` raised from 0.146.0 to 0.158.0.** The theme now uses
  `hugo.Data` and `.Language.Locale`; the APIs they replace are deprecated and
  emit a warning on every build with Hugo 0.156+. Supporting both would have
  meant version-gating three call sites and a config key, which is not worth it
  in a theme this young. CI builds the floor and the latest release.
- `exampleSite` config uses `locale` rather than the deprecated `languageCode`.

### Fixed

- **The table of contents highlight no longer strands on the wrong entry.** It
  asked an `IntersectionObserver` which headings sat inside a band 10% of the
  viewport tall, and only moved the highlight while one did. Any section taller
  than that band scrolled its heading straight through, so the highlight stayed
  on the *previous* section for the whole read — on a long post it never left
  the first entry at all. It now tracks the last heading above the line below
  the nav, computed on a throttled scroll, so there is always a correct answer.
- GitHub now detects the MIT licence. The Nunito attribution moved out of
  `LICENSE` — appended text stops licence scanners matching the file — and into
  `NOTICE`.

## 0.1.0 — 2026-09-12

First public release, extracted from a theme originally written for one site.

### Added

- Four palettes: light/dark crossed with a warm brown or deep green ground, both
  persisted and applied synchronously so there is no flash.
- One accent colour with an automatically darkened light-mode variant, so accent
  text clears 4.5:1 on the light grounds.
- Typed masthead driven by `data/quotes.yaml`, server-rendered on line one so it
  reads correctly with JavaScript off.
- Lazy ⌘K search over titles, descriptions and tags; the bundle is fetched on
  first use, never on first paint.
- Sticky table of contents, copy buttons on code, build-time image pipeline,
  prefetch on hover.
- Optional certifications, bookshelf and resume sections.
- Full internationalisation: every UI string in `i18n/en.toml`, including the
  ones JavaScript renders.
- Self-contained `exampleSite/`, CI, and Hugo themes gallery screenshots.
