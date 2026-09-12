# Changelog

Notable changes to nuno. This project does not follow semantic versioning yet —
it is a theme, and the meaningful contract is `min_version` in `theme.toml`.

## Unreleased

### Changed

- **`min_version` raised from 0.146.0 to 0.158.0.** The theme now uses
  `hugo.Data` and `.Language.Locale`; the APIs they replace are deprecated and
  emit a warning on every build with Hugo 0.156+. Supporting both would have
  meant version-gating three call sites and a config key, which is not worth it
  in a theme this young. CI builds the floor and the latest release.
- `exampleSite` config uses `locale` rather than the deprecated `languageCode`.

### Fixed

- GitHub now detects the MIT licence. The Nunito attribution moved out of
  `LICENSE` — appended text stops licence scanners matching the file — and into
  `NOTICE`.

### Added

- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue and pull request
  templates, and Dependabot for the workflow actions.

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
