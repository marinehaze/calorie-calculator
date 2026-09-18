# Walkthrough presentation

An eight-slide, browser-based presentation of the Calorie Calculator project,
built for recording a 3–4 minute Loom / FocuSee walkthrough.

Everything in this directory is presentation-only. It reads the finished
project as a source and changes nothing in it: no file outside `presentation/`
is modified, and the application, Design System, Storybook config and branding
are inputs, not outputs.

## Running it

Open `presentation/index.html` in a desktop browser — that is the whole
installation. There is no build step, no framework and no network dependency:
the fonts, the screenshots and the photography are all local.

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
| 01 | Title |
| 02 | Problem & scope — two user needs, four screens, 34 states |
| 03 | Branding direction — palette, type pairing, hierarchy, photography |
| 04 | Design System — a curated component selection, 22 components / 104 stories |
| 05 | Flow 1 — calculate nutrition |
| 06 | Flow 2 — find a suitable recipe |
| 07 | Beyond the happy path — states, and the final audit |
| 08 | AI-native workflow, with the repository and Storybook links |

## Files

```
index.html          the eight slides
styles.css          deck styling — restates the approved tokens, imports none
deck.js             ~90 lines: scale the stage, move between slides
assets/screens/     16 stills of the final application states
assets/components/  12 Design System specimens
assets/food/        4 crops of the approved food photography
assets/fonts/       Plus Jakarta Sans + Inter Tight, latin subset
tools/capture.mjs   regenerates assets/ from the built Storybook
tools/review.mjs    drives the deck and writes stills + a contact sheet
tools/check-sizes.mjs  checks the stage at common laptop resolutions
```

## Regenerating the assets

Every product still comes from the final Storybook build, captured in its own
iframe so no Storybook sidebar, toolbar or addon panel is ever in frame. The
screens carry the project's own review presentation — the 390 × 844 frame with
its status bar, safe areas and home indicator — exactly as the project was
reviewed.

```
npm run build-storybook
node presentation/tools/capture.mjs            # all three groups
node presentation/tools/capture.mjs screens    # or one of screens|components|food
```

## Checking it

```
node presentation/tools/review.mjs             # keyboard nav, overflow, stills, contact sheet
node presentation/tools/check-sizes.mjs        # 1280x800 through 2560x1440, plus file://
```

`review.mjs` fails if a slide overflows the stage, if the page scrolls, if
keyboard navigation lands on the wrong slide, or if any asset 404s. Its output
lands in `presentation/.review/` (git-ignored).
