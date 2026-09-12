# nuno

A minimalist, dark-first Hugo theme. Nunito only, warm brown or deep green
ground, one accent colour, a cycling typed masthead, ⌘K client-side search, a
sticky table of contents, copy buttons on code, and optional sections for
certifications, books and a resume.

First paint is ~50 KB gzipped over 4 requests, with no third-party connections.
Optional [comments](#comments) are the single exception, and even then nothing
is fetched until a reader scrolls to them.

[![Build](https://github.com/that-daniel/nuno/actions/workflows/build.yml/badge.svg)](https://github.com/that-daniel/nuno/actions/workflows/build.yml)
![Performance 100](https://img.shields.io/badge/Lighthouse_Performance-100-2ea043)
![Accessibility 100](https://img.shields.io/badge/Accessibility-100-2ea043)
![Best Practices 100](https://img.shields.io/badge/Best_Practices-100-2ea043)
![SEO 100](https://img.shields.io/badge/SEO-100-2ea043)

PageSpeed Insights against the demo site, mobile, September 2026. These are
static badges recording one run, not a live check — if you are relying on the
numbers, measure your own site: the score moves with your content, images and
host, not just the theme.

Requires Hugo **extended** 0.158+ (CI builds on 0.158.0 and latest).

**[Demo](https://that-daniel.github.io/nuno/)** — the demo is the
[`exampleSite/`](exampleSite/) directory in this repo.

---

## Contents

- [Install](#install) · [Configuration](#configuration) · [Navigation](#navigation)
- [Home styles](#home-styles) · [Theme and ground](#theme-and-ground) · [Accents and contrast](#accents-and-contrast)
- [Content](#content): [posts](#posts), [series](#series),
  [related posts](#related-posts), [reading progress](#reading-progress),
  [footnotes](#footnotes), [printing](#printing),
  [structured data](#structured-data), [comments](#comments),
  [masthead](#typed-masthead),
  [callouts](#callouts), [blockquotes](#blockquote-attribution),
  [images](#images), [certifications](#certifications), [books](#books),
  [resume](#resume), [about](#about-and-the-portrait)
- [Translating](#translating) · [Layouts](#layouts) · [Assets](#assets)
- [Performance](#performance) · [Accessibility](#accessibility)
- [Known behaviour](#known-behaviour) · [Development](#development)

## Install

As a submodule:

```sh
git submodule add https://github.com/that-daniel/nuno.git themes/nuno
git -C themes/nuno checkout v0.2.0     # pin to a release
```

Or as a Hugo module, in your config:

```yaml
module:
  imports:
    - path: github.com/that-daniel/nuno
```

```sh
hugo mod get github.com/that-daniel/nuno@v0.2.0
```

**Pin to a tag.** Tracking the default branch means a change here lands on your
site the next time you build, without you asking for it. Releases are listed on
the [releases page](https://github.com/that-daniel/nuno/releases) and every one
has a [CHANGELOG](CHANGELOG.md) section.

While the theme is `0.x`, a minor bump may carry a breaking change — it will say
so at the top of its changelog section — and patch releases never do. Upgrade by
moving the pin: `git -C themes/nuno checkout vX.Y.Z` then commit the new pointer,
or `hugo mod get github.com/that-daniel/nuno@vX.Y.Z`.

Then set `theme: nuno`. The fastest start is to copy
[`exampleSite/hugo.toml`](exampleSite/hugo.toml) into your site root — it lists
every parameter the theme reads, with the default written beside it.

Three things are required elsewhere in the config:

```yaml
outputs:
  home: [HTML, RSS, JSON]     # JSON is the search index

markup:
  tableOfContents: { startLevel: 2, endLevel: 3 }
  highlight: { noClasses: false }   # class-based, so the palettes drive colours
```

## Configuration

All params are optional; the defaults are the design defaults.

```yaml
params:
  accent: "#e8b04b"     # dark-mode accent. mustard (default), copper #d97b4f,
                        # green #0f766e, sky #8fb8d6
  accentLight: ""       # light-mode accent. Left empty, each of the four above
                        # maps to a darkened variant that clears 4.5:1 on ivory.
  ground: "brown"       # brown | green — the default dark ground
  defaultTheme: "auto"  # auto follows prefers-color-scheme; or force "dark"/"light".
                        # Only affects a first visit — a visitor's own toggle is
                        # remembered and always wins.
  brand: "example.com"              # nav wordmark; defaults to the baseURL host
  tagline: "Notes, since 2024."
  postsOnHome: 6
  postsOnHomeMax: 12      # renders more behind a "Show more" button. Unset, or
                          # at or below postsOnHome, nothing changes.
  homeHeader: "masthead"  # masthead | profile — see "Home styles" below
  homeStyle: "grid"       # grid | ledger
  homeGroupByYear: false  # ledger only: split rows under year headings
  profileBio: ""          # profile header bio; defaults to params.description
  relatedCount: 3         # "Related reading" entries under a post
  readingProgress: false  # thin accent bar at the top of a post
  masthead: 'Faith,<br>technology<span class="accent">,</span><br>and life.'
  # About heading: use spans, not <br> — they stack on desktop and reflow to one
  # sentence on mobile. A <br> cannot do both.
  aboutHeading: '<span class="about__title-part">Minimalist.</span> <span class="about__title-part">Tinkerer.</span> <span class="about__title-part accent">Believer.</span>'
  portrait: "images/portrait.jpg"   # About portrait, from assets/ or static/
  aboutElsewhereRow: false          # true restores the text "Elsewhere" row
                                    # (off by default: the icon row under the
                                    # portrait already carries these links)
  certsSection: "certs"             # see "Renaming a section" below
  resumePath: "/resume"
  certsKicker: "Kubestronaut"       # appended to "16 credentials · …"
  certHighlights: ["CKS", "CKA"]
  resumeLabel: "Download PDF"
  copyright: "© Example · CC BY 4.0"   # defaults to "© <year> <author>"
  mainSections: ["posts"]
  DateFormat: "January 2, 2006"
  prefetch: true                    # false disables prefetch-on-hover
  favicon: ""                       # see "Icons" below
  ogImage: "images/og.png"          # site-wide social preview fallback
  webmentionDomain: ""              # set to enable a webmention.io <link>
  author:
    name: "Your Name"               # a bare string also works
  socialIcons:
    - { name: email,    url: "mailto:you@example.com" }
    - { name: github,   url: "https://github.com/you" }
    - { name: linkedin, url: "https://linkedin.com/in/you" }
```

### Icons

Leave `params.favicon` unset and the theme probes `assets/` for `favicon.ico`,
`favicon.svg` and `favicon.png`, in that order, and links whichever it finds
first. If none exists it emits no icon link at all — better than a hardcoded
`/favicon.ico` that 404s on every page.

Set `params.favicon` only for a file in `static/`: it is resolved with `relURL`
and does not go through the asset pipeline.

`params.appleTouchIcon` sets the touch icon. `params.label.icon` is accepted as
a deprecated alias, so a site moving over from PaperMod does not silently lose
its icon.

### Renaming a section

Hugo picks `layouts/certs/` and `layouts/books/` by the section's **type**, not
its directory name. So a section can be called anything, as long as its
`_index.md` says which layouts to use:

```yaml
# content/credentials/_index.md
title: "Credentials"
type: certs
```

Certifications are additionally looked up by name in two places — the About page
row and the "All certifications" back-link — so also set
`params.certsSection: "credentials"`. Books need no param; nothing looks that
section up by name.

## Navigation

The nav is sticky. It bleeds into the page gutters so nothing scrolls past it at
the edges, and grows a hairline once the page is scrolled. `--nav-h` in the CSS
drives its height and every offset that depends on it (sticky TOC and portrait,
heading `scroll-margin-top`); change one value and the rest follow.

On mobile only the menu entry with `identifier: about` stays in the nav bar; the
rest move to the footer.

## Home styles

Two independent switches, the same shape as [theme and ground](#theme-and-ground):
the **header** and the **post list** vary separately, so two params give four
home pages.

```yaml
params:
  homeHeader: "masthead"   # masthead | profile
  homeStyle: "grid"        # grid | ledger
  homeGroupByYear: false   # ledger only
```

**`homeHeader`** — the hero:

| Value      | Is                                                  |
| ---------- | --------------------------------------------------- |
| `masthead` | Oversized type plus the typed line (the default)     |
| `profile`  | Portrait, name, bio and social icons                 |

**`homeStyle`** — the list:

| Value    | Is                                           | Suits                                            |
| -------- | -------------------------------------------- | ------------------------------------------------ |
| `grid`   | Three columns of preview cards (the default) | A steady cadence and a post count divisible by 3 |
| `ledger` | Numbered full-width rows, one post per line  | Any post count — it never leaves a partial row   |

Unrecognised values log a warning and fall back to the default.

Worth knowing before you switch:

- **`profile` replaces the masthead, it does not sit above it.** Both are the
  page's hero; stacking them gives the home two competing focal points and
  pushes the posts below the fold.
- **`profile` reuses `params.portrait` and `params.socialIcons`** — the same two
  the About page uses, so there is nothing new to configure. It also means the
  same portrait appears on both pages, and the social links appear twice on the
  home page, since the footer already carries them sitewide. If that bothers
  you, the footer links are the ones to drop.
- **The grid leaves a ragged last row** when your post count is not a multiple
  of three — four posts render as a row of three plus one third-width card. It
  is not broken, but it is the reason `ledger` exists. Below 1100px the grid
  drops to two columns and below 760px to one, so this only shows on desktop.
- **`homeGroupByYear` only applies to `ledger`**, and it drops the running
  number: with a year heading and a date on every row, a counter is a third
  ordering cue. It needs more than one year of posts to be worth turning on.

Both list styles honour `postsOnHome` and truncate to four entries on mobile
with the archive link beneath — except a grouped ledger, which shows everything
it was given, since cutting a year in half misstates the history.

## Theme and ground

Two independent switches, both persisted to `localStorage` and applied
synchronously in `<head>` so there is no flash:

- **theme** — `light` / `dark`, toggled by the ☾/☀ button in the nav.
- **ground** — `brown` / `green`, toggled from the footer.

That is four palettes.

## Accents and contrast

The two modes can carry different accents: `accent` for dark, `accentLight` for
light. Leave `accentLight` empty and the accent darkens automatically so accent
text clears 4.5:1 on ivory. Four pairs are built in:

| Name | Dark | Light |
|---|---|---|
| mustard (default) | `#e8b04b` | `#9a5b12` |
| copper | `#d97b4f` | `#a8451f` |
| green | `#0f766e` | `#0f766e` |
| sky | `#8fb8d6` | `#2f6b95` |

To add a fifth pair, pick your dark accent, then darken it until it clears 4.5:1
on `#faf6ef`, and set both values explicitly. The green row being identical in
both modes is the exception rather than the thing to aim for — that happens when
a colour is already dark enough to work on cream.

Whatever you pick, check all four combinations rather than just your default.
The light grounds are `#faf6ef` (ivory) and `#f3efe4` (cream), and light · green
is the tightest of the four.

## Content

### Posts

Uses `title`, `description`, `date`, `tags`, `categories`. Excerpts fall back to
the summary when there is no `description`. The first `categories` entry becomes
the accent kicker above the title. `showToc: false` hides the table of contents
on a page that would otherwise get one.

`lastmod` adds an "Updated …" line to the byline and an `article:modified_time`.
It is compared with `date` by calendar **day**, not instant — Hugo defaults
`lastmod` to `date`, and under `enableGitInfo` it is the commit time, which is
hours off the front matter date on a first commit. Only a different day counts
as an update.

Every markdown heading gets a `#` link to itself, shown on hover. The id is
Hugo's own anchor, the same one the table of contents targets.

### Series

Add a post to a series with the `series` taxonomy, and it grows a block listing
every part with the current one marked:

```yaml
series: ["Getting to know nuno"]
seriesOrder: 2      # optional
```

Order is chronological unless **every** part sets `seriesOrder`, in which case
that wins. Half-ordered is worse than unordered — one numbered post among
unnumbered ones produces a list that looks deliberate and is not — so it is all
or nothing. A series of one renders nothing; "Part 1 of 1" is noise.

### Related posts

A "Related reading" block sits under each post, drawn from Hugo's similarity
index and restricted to `mainSections` — site-wide it would happily match a post
against a book that shares a tag but not the point.

**It needs a `related` config or it will never appear.** With none, Hugo indexes
`keywords`, which this theme's front matter does not use, so the result is empty
rather than wrong:

```toml
[related]
  threshold = 80
  includeNewer = true
  toLower = true
  [[related.indices]]
    name = "tags"
    weight = 100
  [[related.indices]]
    name = "categories"
    weight = 60
  [[related.indices]]
    name = "date"
    weight = 10
```

`params.relatedCount` caps how many are shown (default 3).

### Reading progress

`params.readingProgress: true` adds a thin accent bar at the top of a post,
tracking scroll. Off by default, and never shown on the About page or other
standalone pages — a bar that fills instantly is a flicker, not information.

### Footnotes

Goldmark's footnotes are styled: an accent superscript in the text, the notes
collected behind a rule at the foot of the article, and the one you jumped to
marked while it is targeted.

### Printing

A post prints as an article. The palette is forced light whatever theme the
reader chose — a dark ground prints as a block of toner — the nav, footer, table
of contents, progress bar and every pointer-only control are dropped, and
external links have their URL printed after them. In-page links do not:
"(#the-symptom)" on paper helps nobody.

### Comments

Off unless configured. [giscus](https://giscus.app) puts comments in your
repository's GitHub Discussions:

```yaml
params:
  giscus:
    repo: "you/your-repo"
    repoId: "R_..."
    category: "Announcements"
    categoryId: "DIC_..."
    mapping: "pathname"       # default
    inputPosition: "bottom"   # or "top"
    themeLight: "light"       # giscus theme names, not nuno's
    themeDark: "dark"
    lang: ""                  # defaults to the site language
```

All four ids are required; get them from [giscus.app](https://giscus.app) after
installing the giscus app on the repository. An incomplete block warns at build
time and renders nothing — giscus itself fails silently with a partial config,
leaving an empty box and no explanation, which is worse than no comments.

Two things the theme does on your behalf:

- **Nothing is requested until the reader reaches the comments.** This is the
  theme's only third-party connection, and it is the reader's bandwidth and the
  reader's data, so a visit that never scrolls to the bottom costs nothing. It
  also means enabling comments does not move your load-time numbers for readers
  who never get there.
- **The embed follows the theme toggle.** Switching light/dark re-themes the
  comments in place rather than leaving a white box on a dark page.

Comments appear on posts only — never on the About page, `/search/`, or other
standalone pages — and `comments: false` in front matter turns them off for one
page. They are never printed.

### Structured data

Posts carry JSON-LD `BlogPosting`, the home page `WebSite`. Nothing else does:
marking a search page or a taxonomy list as an Article is a claim about content
that is not there.

### Typed masthead

Lines live in `data/quotes.yaml` as `pre` (ink) + `accent` pairs; `\n` forces a
break, and a trailing space keeps the line running on:

```yaml
lines:
  - pre: "Slow is not behind.\n"
    accent: "Slow is awake."
```

Override by creating `data/quotes.yaml` in your own site root — your file
replaces the theme's wholesale rather than merging into it. Line one is
server-rendered, so the masthead reads correctly with JavaScript off, and every
line is laid out invisibly behind the visible one so typing never shifts the
page.

### Callouts

```
{{< callout type="tip" >}}
Check the LAN port speed on every hop, not just the switch.
{{< /callout >}}
```

`type` is `note` (default), `tip`, or `warning`. `title` overrides the label,
which otherwise comes from `i18n/*.toml`.

### Blockquote attribution

A trailing paragraph beginning with an em dash is rendered as a `<cite>`:

```markdown
> The bottleneck is never where you expect it.
>
> — a note to future me
```

The em dash must start that paragraph. A hyphen or an en dash will not match and
the line stays part of the quote.

### Images

Markdown images go through a build-time pipeline: converted to WebP at q82,
capped at 1360px, emitted with real `width`/`height` and `loading="lazy"`.
Remote URLs are fetched at build time rather than hotlinked. SVG and animated
GIF pass through untouched. A path that cannot be resolved is linked as-is with
a build warning rather than failing the build — worth reading, since asset paths
are case-sensitive in CI even where they are not on your Mac.

For a caption, use the shortcode, which routes through the same pipeline:

```
{{< figure src="images/diagram.png" alt="A diagram" caption="What it shows." >}}
```

### Certifications

Pages in `content/certs/` with a `certMeta` block. Everything except `issuer` is
optional, and an omitted field simply does not render:

```yaml
title: "Certified Kubernetes Security Specialist"
shortTitle: "CKS"             # abbreviated name used on mobile
certMeta:
  issuer: "CNCF"              # groups the list page
  badgeImage: "…/badge.png"   # local assets/ path or remote URL
  earnedDate: "2024-12-01"    # YYYY-MM-DD
  expiryDate: "2026-12-01"
  status: "Active"            # "Active" gets the accent pill; anything else is plain
  level: "Specialist"         # free text, shown in the page meta row
  credentialId: "LF-abc123"
  credentialUrl: "https://…"  # renders the Verify button; omitting it hides it
  skills: ["Kubernetes", "Security"]
```

Grouped by issuer, issuers ordered by their most recent credential. Badge images
are downloaded and converted to WebP at build time; an unreachable badge falls
back to the plain surface square and logs a warning.

### Books

Pages in `content/books/` with a `bookMeta` block. All fields optional:

```yaml
title: "With Christ in the School of Prayer"
bookMeta:
  author: "Andrew Murray"
  coverImage: "images/covers/…"  # local or remote; localised at build
  rating: 5                      # 0–5; 0 or omitted hides the stars
  status: "Read"                 # "Reading" floats to the front of the shelf
  publisher: "Bethany House"
  published: "2001"
  isbn: "9780764225604"
  pages: 114
  genre: ["Christian", "Spirituality"]
  goodreadsUrl: "https://www.goodreads.com/book/show/…"
```

The list page is one grid of covers with currently-reading books first, marked
with an accent ring and a badge. The single page puts the cover, rating, facts
and link in the column a post uses for its table of contents.

`status: "Reading"` is matched literally against that English string, so keep it
in English in front matter even on a translated site — the visible label is
translated separately.

### Resume

A page with `layout: resume`, driven by `data/resume.yaml`. Every top-level key
is optional, and an omitted one drops its whole section rather than rendering
empty. Without the data file the page falls back to its own Markdown content.

```yaml
name: "Your Name"
role: "Platform Engineer"        # accent kicker
summary: "One paragraph."
location: "Somewhere"            # the "Based in" row
pdf: "resume.pdf"                # resolved with relURL, so static/resume.pdf

contact:                         # label/value rows; url is optional
  - { label: "Email", value: "you@example.com", url: "mailto:you@example.com" }

highlights:                      # the figure row; three or four reads best
  - { figure: "8y", label: "Building platforms" }

achievements:
  - { title: "Halved deploy time", body: "What you did and what changed." }

experience:
  - role: "Senior Engineer"
    company: "Example Corp"
    from: "2022"
    to: "Present"
    current: true                # renders the accent "Current" pill
    bullets: ["One line each."]
    stack: "Kubernetes · Go"

skills:
  - { group: "Platforms", items: "Kubernetes, AWS" }

education:
  - { school: "Example University", award: "BSc", years: "2013 — 2017" }

languages: ["English"]
```

A full worked example is in
[`exampleSite/data/resume.yaml`](exampleSite/data/resume.yaml).

### About and the portrait

The About layout is used for a page with `layout: about`, or for any page at
`/about/` that sets no layout of its own. An explicit layout always wins, so
`layout: single` gives you an ordinary post at `/about/` if you want one.

Set `params.portrait` to a path under `assets/` or `static/`. It is resized to
800px wide and converted to WebP at build (a 132 KB JPEG becomes a 43 KB WebP),
with `width`/`height` emitted so it never shifts the layout. Displayed 400×500
on desktop and cropped to 3:2 on mobile, weighted towards the top of the frame
so a face stays in shot. Leave it unset and an empty frame shows instead.

Beneath it, `params.socialIcons` renders as a row of inline SVG icons — no icon
font, no extra request. They inherit `--ink` and turn accent on hover. Networks
covered: email, github, linkedin, rss, twitter, x, mastodon, youtube, instagram,
bluesky, telegram; anything else falls back to a text label. An RSS link is
appended automatically, so do not list `rss` yourself or it renders twice.

**The portrait carries a soft accent-tinted glow — the theme's one deliberate
shadow**, in a design that otherwise specifies none. (The bookshelf covers
later grew one of their own, for depth on the grid.) To remove the portrait
glow, delete every `box-shadow` declaration on `.about__portrait` in
`assets/css/nuno.css`: three in the base rule — a plain `rgba` fallback for
browsers without `color-mix`, then the two-layer `color-mix` version that
overrides it — and one more in the `max-width: 760px` block.

## Translating

Every UI string lives in [`i18n/en.toml`](i18n/en.toml). Copy it to
`i18n/<lang>.toml`, translate the values, and set `defaultContentLanguage` in
your config. Keys with `one` and `other` are pluralised by Hugo; `{{ .count }}`
and the other placeholders must survive translation.

JavaScript cannot call `i18n`, so the handful of strings the scripts render are
passed over in `window.NUNO.i18n` from `layouts/partials/scripts.html`. If you
add a string to the JS, add it there too. The two search-result count keys use a
literal `{n}` placeholder substituted in the browser, because Hugo cannot
pluralise a count it does not yet know at build time.

Translations are very welcome as pull requests.

### Multiple languages on one site

On a build with more than one language configured, the theme emits `hreflang`
alternates for every translation of the page plus `x-default`, an `og:locale`
and `og:locale:alternate` per translation, and a language switcher in the nav.

The switcher lists only the languages the current page actually exists in.
Offering every configured language would send a reader from an untranslated post
to a 404 rather than to a translation.

None of this appears on a single-language site, where a lone self-referential
alternate would be noise.

## Layouts

| File | Screen |
|---|---|
| `layouts/index.html` | Home — masthead, typed lines, card grid |
| `layouts/_default/single.html` | Post (and About, matched by URL or `layout: about`) |
| `layouts/_default/list.html` | Generic list — rows |
| `layouts/_default/archives.html` | Archive grouped by year (`layout: archives`) |
| `layouts/_default/terms.html` | Tag / category index — pills |
| `layouts/_default/search.html` | Linkable `/search/` page (`layout: search`) |
| `layouts/_default/resume.html` | Resume (`layout: resume`) |
| `layouts/certs/list.html` | Certifications |
| `layouts/certs/single.html` | Single credential |
| `layouts/books/list.html` | Bookshelf — cover grid |
| `layouts/books/single.html` | Single book — cover, facts, Goodreads |
| `layouts/404.html` | 404 |
| `layouts/index.json` | Search index |

## Assets

- `assets/css/nuno.css` — the whole stylesheet, minified and inlined into
  `<head>` (~16 KB raw, ~4 KB gzipped).
- `assets/js/app.js` — theme toggles, typed masthead, TOC, copy buttons.
  Deferred, ~2 KB gzipped.
- `assets/js/search.js` — the overlay, fetched on first ⌘K / click / `/`.
- `static/fonts/nunito-{latin,latin-ext}.woff2` — Nunito variable (weights
  200–1000) from Google Fonts, [OFL](static/fonts/OFL.txt).

## Performance

Measured on a production build served with gzip, throttled to **Slow 4G with 4×
CPU throttling** (roughly a mid-range Android phone on mobile data):

| Page | FCP | LCP | Load | CLS | Transfer | Requests |
|---|---|---|---|---|---|---|
| Home | 448 ms | 448 ms | 747 ms | 0.003 | 84 KB | 4 |
| Post (no images) | 488 ms | 856 ms | 793 ms | 0.002 | 89 KB | 4 |
| Post (image heavy) | 452 ms | 452 ms | 533 ms | 0.001 | 118 KB | 5 |

On a desktop connection the same pages paint in ~150–360 ms. Add your host's
real TTFB (typically 30–150 ms from a CDN); the test server was local.

Four requests is the whole page: HTML, font, JS, favicon — CSS is inlined, so it
costs no request. There are no third-party connections, and these figures are
measured with comments off, which is the default. Turning them on adds none of
these numbers for a reader who does not scroll to the bottom, because giscus is
not fetched until they do.

What keeps it fast: one preloaded font file with `font-display: swap`; CSS
inlined in `<head>`; ~2 KB of deferred JS with search fetched only on first use;
every image processed at build time; and prefetch on hover via the Speculation
Rules API (`params.prefetch: false` disables it).

The image pipeline matters more than anything else: one post went from 2.5 MB
and a 12.9 s load to 118 KB and 533 ms.

## Accessibility

- Skip link, `aria-current` on the active nav item, focus-visible accent rings.
- Search overlay is a focus-trapped `role="dialog"` with arrow-key navigation.
- `prefers-reduced-motion: reduce` shows one static masthead line, no cursor.
- Every interactive control is a real `<button>` or `<a>`.

## Known behaviour

Documented rather than fixed, because each one is deliberate:

- **`.PrevInSection` / `.NextInSection` run opposite to `.Prev` / `.Next`.** The
  theme uses the InSection pair with older/newer mapped by observation and
  verified against real dates. There is a comment in `_default/single.html`;
  please leave it there.
- Two `<script>` gotchas, both easy to reintroduce: `type="application/json"`
  needs `| safeJS` (the typed-masthead payload) and `type="speculationrules"`
  needs `| safeHTML` (prefetch). Get either wrong and the feature dies silently
  with a console error.
- Light · green is the one palette with marginal contrast: muted on surface is
  4.25:1 and accent on surface 4.44:1, against a 4.5:1 target. These are the
  design's own token values; `#5b6760` and `#2d668f` would fix both invisibly.
- `.prose table` scrolls horizontally rather than reflowing.
- A code fence with no language shows the generic label, which CSS uppercases —
  so it reads `CODE`.

## Development

`exampleSite/` is a complete, self-contained demo. Nothing in it points outside
the repository, so it builds anywhere:

```sh
cd exampleSite
hugo server --themesDir ../..
```

Contributions are welcome, particularly `i18n/` translations and accessibility
fixes. Please check that `exampleSite/` still builds cleanly before opening a
pull request — CI runs exactly this:

```sh
cd exampleSite && hugo --themesDir ../.. --printI18nWarnings --printPathWarnings
```

## Licence

MIT — see [LICENSE](LICENSE).

Nunito is licensed separately under the SIL Open Font License; the full text
ships at [`static/fonts/OFL.txt`](static/fonts/OFL.txt) and the attribution is
in [NOTICE](NOTICE). It is kept out of `LICENSE` on purpose — extra text in that
file stops GitHub recognising the repo as MIT.
