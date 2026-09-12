---
title: "Four Palettes, One Accent"
description: "Two independent switches make four palettes. Here is how they compose, and the contrast rule that constrains every accent you might pick."
date: 2026-04-18T09:00:00Z
categories: ["Design"]
tags: ["Design", "Colour", "Accessibility"]
---

The theme has two colour switches and they are independent of each other. That is
the only unusual thing about its palette system, and it is worth five minutes of
explanation because almost every customisation question turns out to be about it.

## The two switches

**Theme** is `light` or `dark`, toggled by the ☾/☀ button in the nav. **Ground**
is `brown` or `green`, toggled from the footer. Neither knows about the other, so
the combinations are:

| Theme | Ground | Surface |
|---|---|---|
| dark | brown | warm near-black |
| dark | green | deep green-black |
| light | brown | cream |
| light | green | ivory |

Both are written to `localStorage` and applied synchronously in `<head>`, so
there is no flash of the wrong palette on a reload. A visitor's own toggle always
beats your configured default.

## Setting the default

```yaml
params:
  ground: "brown"        # brown | green
  defaultTheme: "auto"   # dark | light | auto
```

`auto` follows `prefers-color-scheme`. The other two force a first impression —
and only a first impression, since the toggle is remembered from then on.

## The accent, and the rule that constrains it

The accent is a single colour, used for the kicker above a post title, links in
prose, focus rings, and the second half of each typed masthead line. You set it
once:

```yaml
params:
  accent: "#e8b04b"     # dark mode
  accentLight: ""       # light mode; empty derives a darkened variant
```

Here is the part that catches people out. A colour that reads beautifully as
accent text on a near-black surface will usually fail contrast on cream. So the
theme keeps two values, and if you leave `accentLight` empty it derives a
darkened variant of your accent for light mode.

{{< callout type="warning" >}}
If you set `accentLight` yourself, check it. The light grounds are `#faf6ef` and
`#f3efe4`, and accent text needs 4.5:1 against both — not just against white.
{{< /callout >}}

### Adding a pair of your own

Four accents ship with a matching light variant already worked out:

```
mustard  #e8b04b  →  #9a5b12
copper   #d97b4f  →  #a8451f
green    #0f766e  →  #0f766e
sky      #8fb8d6  →  #2f6b95
```

To add a fifth, pick your dark accent, then darken it until it clears 4.5:1 on
`#faf6ef`, and set both values explicitly. The green pair is identical in both
modes — that happens when a colour is already dark enough to work on cream, and
it is the exception rather than the thing to aim for.

{{< callout type="tip" >}}
Test all four combinations, not just your default. Light · green is the tightest
of the four and it is the one where a marginal accent will show.
{{< /callout >}}
