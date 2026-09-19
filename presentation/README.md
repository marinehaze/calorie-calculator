# Walkthrough presentation

An eight-slide, browser-based presentation of the Piatto project, built for
recording a 3–4 minute Loom / FocuSee walkthrough.

Everything in this directory is presentation-only. It reads the finished
project as a source and changes nothing in it: the application, Design System,
Storybook config and branding are inputs, not outputs. The capture tool here
also writes the reviewer-facing PNGs in the repository's root `screens/`
folder, which is the only thing it touches outside this directory.

## Running it

Open `presentation/index.html` in a desktop browser — that is the whole
installation. There is no build step, no framework and no network dependency:
the fonts, the screenshots and the photography are all local, referenced by
relative paths, so the deck also works straight out of a downloaded archive.

Move through it with `→` / `Space` for the next slide and `←` for the previous
one; `F` goes full screen. The full key list is below.

**`piatto-case.pdf`** in this folder is a static fallback: the same eight
slides, one per page, at the deck's own 16:9. The HTML deck is the presentation;
the PDF is for reviewers who would rather read a document.


If you prefer to serve it:

```
npx serve presentation          # or any static server
```

### Presenting

| Key | |
|---|---|
| `→` `Space` `↓` `PageDown` | next slide |
| `←` `↑` `PageUp` | previous slide |
| `1`–`8` | jump to a slide |
| `Home` / `End` | first / last slide |
| `F` | full screen (`Esc` leaves) |

A click anywhere also advances; links stay clickable. The slide number sits
quietly at the bottom right, and the current slide is in the URL hash
(`index.html#5`), so a take can be restarted from where it stopped.

The deck is a fixed 1600 × 900 stage scaled to fit the window, so it holds 16:9
and never depends on browser scroll. Record the browser window full screen at
any 16:9-ish laptop resolution.

## Slides

| | |
|---|---|
| 01 | Piatto — the wordmark, and the product |
| 02 | Problem & scope — two user needs, four screens, 34 states |
| 03 | Brand — a stylescape: wordmark, promise, rationale, colour, marks, photography and real UI |
| 04 | Design System — 23 components / 107 stories, with MacroEnergySplit featured |
| 05 | Flow 1 — calculate nutrition |
| 06 | Flow 2 — find a suitable recipe |
| 07 | Beyond the happy path — states, and the final audit |
| 08 | AI-native workflow — what I decided, what Claude Code implemented, what I verified |

## Files

```
index.html          the eight slides
styles.css          deck styling — restates the approved tokens, imports none
deck.js             ~90 lines: scale the stage, move between slides
brand/marks.js      the arc-"o" and the segmented arc, copied from the
                    approved brand board and from MacroEnergySplit
piatto-case.pdf     the static fallback: 8 slides, one per page, 16:9
assets/screens/     18 application viewports, each 780 x 1688
assets/components/  13 Design System specimens
assets/food/        2 crops of the approved food photography
assets/fonts/       Plus Jakarta Sans + Inter Tight, latin subset
tools/capture.mjs   regenerates assets/ and root screens/ from the Storybook
tools/review.mjs    drives the deck and writes stills + a contact sheet
tools/verify-screens.mjs  proves every screen is displayed whole, not cropped
tools/check-sizes.mjs  checks the stage at common laptop resolutions
tools/pdf.mjs       renders the live deck to piatto-case.pdf
```

## The brand marks

The wordmark is live text, not an image: Plus Jakarta Sans 600, lowercase,
tracked −4.5%, with the final "o" drawn as the partial arc by `brand/marks.js`
— measured from the typeface's own "o" at render time, 35° opening at one
o'clock, exactly as `branding/brand-refresh/arc-o.js` draws it. The element
carries `aria-label="Piatto"`, because the name is always written normally in
text.

The single arc is the brand mark and the app icon, and is the `<symbol>` from
the brand board, inlined in `index.html`. The segmented arc is data only —
never the logo — and is drawn with `MacroEnergySplit`'s own geometry from the
same file.

Slide 3 is composed as a board rather than a summary, following
`branding/brand-refresh/hero.html`: the word and the promise on the left, and
on the right the product's own type, colour, photography and two real UI
fragments, shown at size rather than captioned.

## One screen treatment

Every mobile screen in the deck (slides 1, 2, 5, 6, 7) goes through one
container, `.phone`. It holds the 390:844 ratio, lays the image inside with
`object-fit: contain` and never `cover`, and derives its corner radius from its
own width, so a 186px screen and a 280px screen read as the same device. A
slide sets `--w` and nothing else.

There is deliberately no drawn bezel: at five screens to a slide it adds weight
without adding information, and the captures already carry the real status bar,
safe areas and home indicator.

`node presentation/tools/verify-screens.mjs` checks the result — for every
screen instance it compares the PNG's own pixels, the computed `object-fit`,
the laid-out box and every clipping ancestor, and fails on any accidental crop.

## Regenerating the assets

Every product still comes from the final Storybook build, captured in its own
iframe so no Storybook sidebar, toolbar or addon panel is ever in frame. The
screens carry the project's own review presentation — the 390 × 844 frame with
its status bar, safe areas and home indicator.

Nutrition Result and Recipe Detail put the nutrition block below the fold of a
handset, so those two are captured a second time with the screen's own scroll
container scrolled — in the page, at capture time — so the stills show
`MacroEnergySplit` as it actually appears. Nothing in the product changes.

```
npm run build-storybook
node presentation/tools/capture.mjs            # all three groups
node presentation/tools/capture.mjs screens    # or one of screens|components|food
```

## Checking it

```
node presentation/tools/review.mjs             # keyboard nav, overflow, stills, contact sheet
node presentation/tools/verify-screens.mjs     # every screen displayed whole
node presentation/tools/check-sizes.mjs        # 1280x800 through 2560x1440, plus file://
node presentation/tools/pdf.mjs                # regenerate piatto-case.pdf
```

The audit figure on slide 7 reads "0 **automated** WCAG 2.1 A/AA violations":
axe-core covers what a machine can check, which is not the same as full WCAG
conformance, and the deck should not imply otherwise.

`review.mjs` fails if a slide overflows the stage, if the page scrolls, if
keyboard navigation lands on the wrong slide, or if any asset 404s. A crop that
runs off the edge on purpose declares itself with `data-bleed`. Output lands in
`presentation/.review/` (git-ignored).
