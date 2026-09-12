# Contributing to nuno

Thanks for looking. This is a small theme with a deliberately narrow scope, so
the most useful thing you can do before writing code is open an issue and check
the idea fits.

## What is most welcome

- **Translations.** Copy [`i18n/en.toml`](i18n/en.toml) to `i18n/<lang>.toml`
  and translate the values. This is the single highest-value contribution and
  needs no Hugo knowledge.
- **Accessibility fixes.** Contrast, focus order, screen-reader labels, keyboard
  traps. If you can reproduce a problem with an actual assistive technology,
  say which one — that is worth more than an automated audit score.
- **Bug fixes**, especially anything that breaks on a Hugo version in the
  supported range.
- **Documentation** where the README is wrong or assumes context.

## What is likely to be declined

The theme's scope is the argument, so this list is not grumpiness — it is the
design:

- Post cover images, author avatars in bylines, related-posts blocks, social
  share buttons, comment engines, analytics. Each was considered and dropped.
- A second typeface, or an icon font.
- Anything that adds a third-party request to a page. The theme currently makes
  none, and that is a property worth keeping absolute.
- A config option whose only job is to switch between two visual designs. One
  opinionated default beats two half-maintained ones.

If you want one of these for your own site, fork it — that is what MIT is for.

## Getting set up

You need Hugo **extended** 0.158 or newer. The `exampleSite/` directory is a
complete, self-contained demo; nothing in it points outside the repository.

```sh
git clone https://github.com/that-daniel/nuno.git
cd nuno/exampleSite
hugo server --themesDir ../..
```

## Before you open a pull request

Run what CI runs. The build must be clean — **any** Hugo warning fails CI, since
a missing i18n key and an unresolvable asset path both surface as warnings:

```sh
cd exampleSite
hugo --themesDir ../.. --printI18nWarnings --printPathWarnings
```

CI builds against both the oldest supported Hugo (0.158.0) and the latest
release. If your change needs a newer Hugo than the floor, say so in the pull
request rather than quietly raising `min_version` in `theme.toml`.

Please also:

- Check all four palettes, not just your default — light/dark crossed with
  brown/green. Most visual regressions only show in one of the four.
- Check mobile. A lot of the layout swaps at `max-width: 760px`.
- Add any new user-facing string to `i18n/en.toml` rather than hardcoding it.
  If JavaScript renders it, add it to `window.NUNO.i18n` in
  `layouts/partials/scripts.html` too — JS cannot call `i18n`.

## House style

- Templates explain *why*, not *what*. If a line looks wrong but is deliberate,
  the comment saying so is the valuable part — please do not delete those while
  tidying. The "Known behaviour" section of the README lists the ones that
  reliably get "fixed" by mistake.
- Keep the CSS in one file and in the existing order. It is inlined into every
  page, so every byte is on the critical path.
- No build step. The theme ships as templates, CSS and JS that Hugo can consume
  directly, and it should stay installable by dropping it into `themes/`.
- JavaScript is ES5-compatible, feature-detected, and must never be required for
  content to be readable.

## Commits and licensing

Write commit messages that explain the reasoning, not just the change. There is
no CLA and no DCO sign-off requirement; by contributing you agree your work is
licensed under the repository's [MIT licence](LICENSE).

## Releasing

For maintainers. `main` is protected: everything lands through a pull request
with both CI builds green, so a release is only ever tagging a commit that is
already on `main`.

1. Move the `## Unreleased` entries into a new `## X.Y.Z — YYYY-MM-DD` section
   in [`CHANGELOG.md`](CHANGELOG.md), and leave `Unreleased` saying
   "Nothing yet." If the release breaks anything, say so in a line directly
   under the heading — that is the line people read before upgrading.
2. Bump the pinned versions in the README's install snippets.
3. Land that as a PR.
4. Tag the merge commit and push the tag:

   ```sh
   git checkout main && git pull
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

`release.yml` does the rest: it reads the matching `CHANGELOG` section and
publishes a GitHub Release from it. A tag with no matching section fails the
job rather than publishing an empty release, so the tag and the changelog cannot
drift apart.

Version numbers are the tags themselves — there is no version string in
`theme.toml` to forget to update. While the theme is `0.x`, a minor bump may
carry a breaking change; a patch never does. Raising `min_version` is a minor
bump at least, because it can stop someone's site building.
