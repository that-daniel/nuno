<!--
Thanks for contributing. Keep this short — the checklist matters more than prose.
If this is a translation, most of the checklist below does not apply; just say so.
-->

## What this changes

<!-- And why. If it fixes an issue, "Fixes #123" here. -->

## How you verified it

<!--
CI runs this, so run it first:

    cd exampleSite && hugo --themesDir ../.. --printI18nWarnings --printPathWarnings

Any Hugo warning fails CI — a missing i18n key and an unresolvable asset path
both surface as warnings.
-->

## Checklist

- [ ] `exampleSite/` builds with no warnings
- [ ] Checked in all four palettes (light/dark × brown/green), or not a visual change
- [ ] Checked at mobile width (the layout swaps at `max-width: 760px`), or not a visual change
- [ ] Any new user-facing string is in `i18n/en.toml` — and in `window.NUNO.i18n` if JavaScript renders it
- [ ] No new third-party network request on any page
- [ ] I did not delete a "why" comment while tidying — see "Known behaviour" in the README for the ones that get removed by mistake
