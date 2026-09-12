---
title: "Welcome to nuno"
description: "What the theme is, what it deliberately leaves out, and how to put a site on it in about ten minutes."
date: 2026-05-04T09:00:00Z
categories: ["Design"]
series: ["Getting to know nuno"]
seriesOrder: 1
tags: ["Hugo", "Design", "Getting started"]
---

nuno is a Hugo theme for people who write. It has one typeface, four palettes,
a single accent colour, and no third-party requests at all. The home page you
arrived on is the whole design argument: a masthead that types itself, a column
of numbered cards, and nothing else competing for attention.

## What you get

The parts worth knowing about, in rough order of how often you will touch them:

- **Posts** with an optional table of contents that tracks your scroll position.
- **⌘K search** over every post's title, description and tags — fetched on the
  first keystroke, never on first paint.
- **Two independent switches**: light/dark, and a warm brown or deep green
  ground. That is four palettes, and both choices are remembered.
- **A certifications section** and **a bookshelf**, if you want them. Skip the
  content directories and the pages simply do not exist.
- **A resume** rendered from `data/resume.yaml` rather than hand-written HTML.

## What it deliberately leaves out

No cover images on posts. No author avatars in bylines. No related-posts block,
no social share buttons, no comment engine, no analytics. Every one of those was
considered and dropped, because each one is a request you did not need and a
decision the reader did not ask you to make.

{{< callout type="note" >}}
A link shared to LinkedIn or WhatsApp still needs a preview image, so the theme
emits `og:image` from a post's `cover` even though it never renders a cover on
the page itself.
{{< /callout >}}

> Every feature you add is a feature someone has to read past.
>
> — the whole design brief, more or less

## Getting started

Drop the theme into `themes/nuno/` and point your config at it:

```yaml
theme: nuno
outputs:
  home: [HTML, RSS, JSON]   # JSON is the search index — the theme needs it
markup:
  tableOfContents: { startLevel: 2, endLevel: 3 }
  highlight: { noClasses: false }
```

That is the minimum. Everything under `params` is optional; leave it all out and
you get the design defaults.

{{< callout type="tip" >}}
Start from `exampleSite/hugo.toml`. It lists every parameter the theme reads,
with the default written next to it as a comment.
{{< /callout >}}

## Making it yours

Three changes cover most of it. Set `params.masthead` to your own headline.
Create `data/quotes.yaml` to replace the typed lines. Pick an accent with
`params.accent`. After that you are writing Markdown, which was the point.
