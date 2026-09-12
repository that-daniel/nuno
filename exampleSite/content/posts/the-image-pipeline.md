---
title: "The Image Pipeline"
description: "Every image is converted, capped and measured at build time. It is the single biggest thing keeping pages small."
date: 2026-03-02T09:00:00Z
categories: ["Performance"]
tags: ["Performance", "Images", "Hugo"]
cover:
  image: "images/example-figure.png"
---

Of everything the theme does for performance, the image pipeline earns the most.
One post in early testing went from 2.5 MB and a 12.9 second load to 118 KB and
533 ms, and nothing changed about it except how the images were processed.

## What happens to an image

Write an ordinary Markdown image and a render hook intercepts it:

```markdown
![A build-time processed image](images/example-figure.png)
```

![A build-time processed image](images/example-figure.png)

Goldmark would have emitted a bare `<img>` pointing at the original file, with no
dimensions and no lazy loading. Instead the theme:

1. Resolves the path against `assets/`.
2. Converts to WebP at quality 82.
3. Caps the width at 1360px — twice the 680px reading column.
4. Emits real `width` and `height`, so the page never shifts as images arrive.
5. Adds `loading="lazy"`, unless the caller asks for `eager`.

## The cases it handles

| Input | What happens |
|---|---|
| Local raster | Converted to WebP, capped, measured |
| Remote URL | Fetched at build time, then treated as local |
| SVG | Passed through — nothing to rasterise |
| Animated GIF | Passed through — Hugo would flatten it to frame one |
| Already-small WebP | Left alone rather than re-encoded |
| Missing file | Linked as-is, with a build warning |

That last row matters more than it looks. A theme that hard-fails on a typo in an
image path is a theme that fails your whole build at the worst moment.

{{< callout type="warning" >}}
Asset paths are case-sensitive, including on macOS where your local build will
happily find `Photo.JPG` and your CI will not. The build warning names the path
it could not resolve — read it.
{{< /callout >}}

## Remote images

A remote URL is pulled in at build time, not hotlinked:

```markdown
![A badge](https://example.com/badge.png)
```

So the post does not depend on someone else's host, CDN or rate limit at read
time. If the fetch fails the theme warns and falls back to hotlinking, which
keeps the build green but is worth fixing.

{{< callout type="tip" >}}
Both certification badges and book covers go through this same path, which is why
`certMeta.badgeImage` and `bookMeta.coverImage` happily take either a local path
or a remote URL.
{{< /callout >}}

## Captions

For a caption, use the shortcode instead of Markdown syntax. It routes through
the same pipeline:

```
{{</* figure src="images/example-figure.png" alt="A diagram"
      caption="Everything above happens at build time." */>}}
```

{{< figure src="images/example-figure.png" alt="A diagram" caption="Everything above happens at build time, once, rather than in every visitor's browser." >}}
