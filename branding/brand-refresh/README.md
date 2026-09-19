# Brand refresh — stylescape exploration 01

A concept-stage brand / stylescape exploration for the completed Calorie
Calculator product. It is **not** a product redesign: nothing in `src/`, the
design tokens, Storybook, the four screens or `branding/stylescape.html`
changes. Everything in this folder is a proposal for visual review.

The principle is unchanged — **Precision without intimidation** — and the
brand idea is built around **portion and proportion**, not restriction. The
visual device is a **partial circular arc**: a plate seen from above, a portion
of a whole, an honest estimate that leaves the circle open on purpose.

## Files

| Path | What it is |
|---|---|
| `hero.html` | **The primary stylescape**: one 16:9 board, 2400 × 1350, for presentation and video |
| `brand-refresh.html` | The long exploration board (2400 px wide), kept as supporting documentation |
| `wordmark-final.html`, `captures/wordmark-final.png` | **The selected wordmark**: variant B refined to 35°, large, 48 px, 20 px, reversed |
| `wordmark-o.html`, `captures/wordmark-o.png` | The arc-"o" exploration: three refinements (A 60°, B 40°, C 28°) with the recommendation that led to B |
| `arc-o.js` | Draws the arc-"o" from the typeface's own "o" metrics; shared by the hero, the long board and the wordmark boards |
| `captures/hero.png`, `captures/hero@2x.png` | The hero board at 1x and 2x |
| `captures/board-full.png` | The whole long board at 2400 px |
| `captures/detail-*.png` | Five close-ups of the long board at 2x: masthead, wordmarks, arc motif, colour, real UI |
| `captures/sections/*.jpg` | The four strongest long-board sections as compressed JPEGs |
| `assets/ui/*.png` | Real product fragments, screenshotted from the built Storybook at 2x |
| `scripts/capture-ui-fragments.mjs` | Recaptures the product fragments from `storybook-static/` |
| `scripts/capture-board.mjs` | Renders the board and writes the captures |

Photography is read directly from the approved set in `assets/food/`; fonts
are the product's own self-hosted files in `src/styles/fonts/`. Nothing is
downloaded and nothing is copied.

## Rendering

```bash
npm ci
npm run build-storybook                                   # for the UI fragments
node branding/brand-refresh/scripts/capture-ui-fragments.mjs
node branding/brand-refresh/scripts/capture-board.mjs     # hero + long board + close-ups + JPEG sections
```

Or open `hero.html` (2400 × 1350) or `brand-refresh.html` in a browser at 2400 px wide.

## Wordmark and mark (V3, selected)

**Piatto** is the working concept name for this iteration. The wordmark is
Plus Jakarta Sans 600, lowercase, tracked to −4.5%, with the **final "o"
drawn as the partial arc**: the typeface's own advance width, ink box and stem
thickness (measured at render time by `arc-o.js`), one uniform stroke, round
terminals, and a 35° opening at one o'clock. Variant B of the exploration,
refined from 40° to 35° for readability. The primary lockup carries no
separate mark before the word.

The partial arc on its own remains the **brand mark and the app icon**, and
appears in the secondary stacked and signature lockups beside the plain word,
so the arc appears once per lockup.

In text, captions and accessibility labels the name is always written
"Piatto"; the arc-"o" is a visual treatment of the wordmark only.

**Single arc = brand** (portion, proportion, mark, icon). **Segmented arc =
data** (protein, carbs, fat) and nothing else: never the logo, never the icon.

## Naming exploration

Six candidates, three visually shortlisted, **no winner declared**.
Trademark screening has not been done.

| Name | Status | Note |
|---|---|---|
| Plated | shortlisted | What is on the plate, already served. Prior use in the meal-kit category needs checking. |
| Piatto | shortlisted | Italian for plate. The final "o" is a natural home for the arc. |
| Helping | shortlisted | A helping is a portion, and the word is supportive by itself. |
| Ladle | considered | Reads as a utensil brand before a product. |
| Ratio | considered | Tips towards maths and clinical; crowded name. |
| Dollop | considered | Closer to playful than to precise. |

"Calorie Calculator" remains the product category line under any of them.

## Proposed macro data colours

Visualised on the board only — **not tokens, not in components, not in
Storybook**. Protein deep teal `#2F6F6B`, carbs saffron `#D9A441`, fat clay
`#E08A5B`, each paired with a distinct marker shape (dot, ring, rounded square)
and its word so meaning never relies on colour alone. Saffron and clay are
below text contrast on canvas (2.2 : 1 and 2.5 : 1) and are proposed as
markers only; teal clears 4.5 : 1.

**Proposed accessible product values (V2).** Where a macro colour ever has to
carry a control edge or a figure on its own, darker siblings reach at least
3 : 1 on both canvas `#FBFAF8` and surface `#FFFFFF`:

| Macro | Brand / marker hue | Accessible product value | Canvas | Surface |
|---|---|---|---|---|
| Protein | `#2F6F6B` | `#2F6F6B` (unchanged) | 5.6 : 1 | 5.8 : 1 |
| Carbs | `#D9A441` saffron | `#A57D31` ochre | 3.6 : 1 | 3.8 : 1 |
| Fat | `#E08A5B` clay | `#B36E49` terracotta | 3.8 : 1 | 4.0 : 1 |

Still proposals. No Design System token changes.
