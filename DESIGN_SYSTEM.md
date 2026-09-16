# DESIGN_SYSTEM.md

The reusable mobile design system for the calorie & nutrition app.

It translates the approved stylescape (`branding/stylescape.html`) into
production components for the four screens in `SCREENS.md`. It does not
introduce a visual direction — every value here is traceable to the stylescape
or to `DECISIONS.md`.

The four screens themselves are **not** built yet. This stage delivers the
parts they will be assembled from.

> **Precision without intimidation.**
> Precision belongs to the information and the behaviour. The surface stays
> light, calm and human.

---

## Running it

```bash
npm install
npm run storybook          # http://localhost:6006
```

| Command | What it does |
|---|---|
| `npm run storybook` | Dev server on port 6006 — the primary way to review this |
| `npm run build-storybook` | Static build into `storybook-static/` |
| `npm run audit` | Runs the built Storybook through headless Chromium and checks overflow at 390px, 44px touch targets, and WCAG 2.1 AA |

Stack: React 19, Vite 7, Storybook 9, plain CSS with custom properties.
No UI library, no CSS framework, no styling runtime.

---

## 1. Foundations

Tokens live in `src/styles/tokens.css`. **Components read tokens, never a raw
hex, pixel size or font family.**

### Colour

| Token | Value | Use |
|---|---|---|
| `--ds-canvas` | `#FBFAF8` | App background |
| `--ds-surface` | `#FFFFFF` | Cards, sheets, raised areas |
| `--ds-soft` | `#F4F1EC` | Segmented track, skeletons, banner, stepper |
| `--ds-ink` | `#1C1B19` | Primary text, values, headings |
| `--ds-ink-2` | `#6B6863` | Labels, units, secondary text, disabled text |
| `--ds-line` | `#EAE6E0` | Row dividers, section rules |
| `--ds-line-strong` | `#DFDAD2` | Secondary button and field hairlines |
| `--ds-berry` | `#8A3355` | Primary action; selected / active state; constraint emphasis |
| `--ds-berry-deep` | `#732643` | Hover / pressed |
| `--ds-berry-soft` | `#F7EDF1` | Quiet button; selected and applied chip tint |
| `--ds-berry-line` | berry @ 70% | Applied-filter chip boundary — 3.90 : 1 on canvas |
| `--ds-macro-protein` | `#8A3355` | 7px marker dot only |
| `--ds-macro-carbs` | `#C08442` | 7px marker dot only |
| `--ds-macro-fat` | `#5F7185` | 7px marker dot only |

Bramble marks the primary action, the selected or active state, constraint
emphasis, and occasional hero emphasis. Everything else stays neutral so
photography carries the colour.

Selection is graded rather than binary, so a screen carrying several active
filters still reads as one controlled accent:

| | Tint | Border | Weight | Glyph |
|---|---|---|---|---|
| Unselected toggle | — (white) | neutral hairline | regular | — |
| **Applied filter** | berry-soft | berry @ 70% | regular | × |
| **Selected toggle** | berry-soft | full berry | medium | ✓ |

**The stylescape's third ink (`#8C877F`) is not a token here.** It measures
3.57 : 1 on surface and fails AA for normal text. It was stylescape annotation
chrome, and the stylescape's own mobile section already used `ink-2` for the
product eyebrow. Muted product text is `--ds-ink-2` throughout.

### Typography

Plus Jakarta Sans for presence; Inter Tight for everything you read. Both are
self-hosted (`src/styles/fonts.css`, latin subsets, weights 400/500/600) so
there is no runtime CDN dependency.

**Weight 300 is not loaded and must not be reintroduced.**

| Token | Size | Face / weight | Use |
|---|---|---|---|
| `--ds-text-hero-lg` | 76 | Jakarta 500 | Nutrition Result hero calorie |
| `--ds-text-hero-md` | 56 | Jakarta 500 | Recipe Detail, per serving |
| `--ds-text-hero-sm` | 40 | Jakarta 500 | Hero inside a sheet |
| `--ds-text-display` | 34 | Jakarta 600 | Screen / recipe title |
| `--ds-text-heading` | 27 | Jakarta 600 | Item name on Nutrition Result |
| `--ds-text-title` | 22 | Jakarta 600 | Section and sheet titles |
| `--ds-text-value-lg` | 24 | Jakarta 500 | Macro value |
| `--ds-text-value` | 20 | Jakarta 500 | Portion / per-100g value |
| `--ds-text-control` | 17 | Inter Tight 500 | Buttons, search field |
| `--ds-text-body` | 16 | Inter Tight 400 | Body, ingredient name, row title |
| `--ds-text-label` | 15 | Inter Tight 400 | Labels, units, meta, amounts |
| `--ds-text-eyebrow` | 14 | Inter Tight 500 | Uppercase eyebrow — **the floor** |

The approved hero calorie setting is **Plus Jakarta Sans 500**. Every figure in
the product is tabular (`.ds-num`), so columns hold still as values change.
Hierarchy comes from scale and space, never from shrinking text.

### Layout

- Target width **390–393px**; tokens assume 390.
- Outer margin **24px**, content column **342px**.
- **8px rhythm**: `--ds-space-1` … `--ds-space-7` = 8, 16, 24, 32, 40, 48, 56.
  A 4px half-step exists for icon-to-label gaps only. 8 and 16 inside a group,
  24–40 between sections.
- **Radius**: 14 controls, 20 media, 28 surfaces. Large radii on large surfaces
  only; small elements stay squarer.
- Exactly **two shadows** exist: the segmented control thumb and the bottom
  sheet. Nothing else is elevated. No gradients, no decorative blobs, no nested
  cards.

---

## 2. Component inventory

Twenty components, each traceable to a screen or state in `SCREENS.md`.
Public API is `src/index.js`.

### Actions

| Component | States | Used by |
|---|---|---|
| **Button** | primary / secondary / quiet; default, hover, pressed, **loading**, **disabled**; `small` (44px) | All four screens |
| **IconButton** | plain / soft; disabled | Back, clear, close, barcode, filter |

### Input & navigation

| Component | Notes | Used by |
|---|---|---|
| **SearchField** | Barcode action lives *inside* the field. Empty, typed, loading, disabled | Food Search, Recipe Discovery |
| **FilterChip** | `toggle` — selected takes berry tint, full berry border, medium weight, check. `remove` — the applied set, one step down at a 70% border and regular weight, with × ; no selected state | Recipe Discovery |
| **SegmentedControl** | Radiogroup with arrow-key support. `default` (pill) and `text` (no track) — see §3 | Nutrition Result; portion sheet |
| **TabBar** | Two tabs. No home screen | App shell |
| **NavBar** | Back, optional title, optional trailing action | Nutrition Result, Recipe Detail |
| **Stepper** | Live-announced value. `default` (label + track) and `bare` (no label, no track) | Servings; portion sheet |

### Nutrition

| Component | Notes |
|---|---|
| **HeroCalories** | lg / md / sm; `pending`; unavailable |
| **PortionPair** | Portion + per-100g on one hairline |
| **MacroGroup** | Three columns, equal weight; per-macro unavailable |
| **IngredientRow** | Fixed number columns; `flag`; interactive (item swap) |
| **NutritionSummary** | `full` (Nutrition Result) and `summary` (Recipe Detail) |

### Food & recipe

| Component | Notes |
|---|---|
| **FoodImage** | Focal-point crop API — see §4 |
| **FoodResultRow** | Search match; reused in the item-swap sheet. No selected state — see §3 |
| **RecipeCard** | One density — SCREENS.md gives Recipe Discovery a single list layout |

### Feedback & states

| Component | Covers |
|---|---|
| **EmptyState** | First run, no results, barcode not found, no matching recipes, error. `constraint={{ lead, detail }}` renders the berry-rule insight |
| **Banner** | Offline and error, app-wide |
| **Skeleton** | Result rows and recipe cards |
| **BottomSheet** | Portion, item swap, filters — one behaviour |

Nothing here exists that the four screens do not need. There is no toast, no
modal, no tooltip, no avatar, no badge, no card container.

---

## 3. Usage rules

**The nutrition hierarchy is fixed.**

```
calories → portion / per 100 g → protein / carbs / fat → ingredients
```

`NutritionSummary` enforces the order. Nothing may be inserted above the
calories and nothing may be promoted to sit beside them. Levels are separated
by space, not by cards, borders or shadows.

**Nutrition is not a dashboard.** No bars, rings, stacked charts, percentages
of a daily target, or progress indicators. `DECISIONS.md` removed red/amber/
green semantics from nutrition values: nothing turns red at someone for eating.

**Missing data is stated in words, never rendered as a zero.** Every component
that shows a figure takes `null` and prints "Not available" or "n/a". A zero
reads as a fact about the food.

**Recalculation happens in place.** Portion and servings edits set `pending`,
which dims the figures. There is no blocking spinner anywhere in the product.

**One berry action per surface.** If a surface needs a second action it is
`secondary` or `quiet`, never a second filled button.

**Colour is never the only carrier of meaning.** A selected chip gains a
border, a weight step *and* a check glyph alongside its tint — three signals
that are not hue, so selection survives greyscale and colour blindness. The
current tab changes colour *and* weight. Macro dots always sit beside their
text label. A flagged ingredient carries a sentence, and the berry rule only
helps you find it.

**One switch, two weights.** `SegmentedControl` has a `default` pill and a
`text` variant, and which one a screen uses is decided by what sits next to it,
not by taste:

- **`default`** where the switch *is* the interaction — Portion / Per 100 g on
  Nutrition Result, where changing the basis is the thing the user came to do.
- **`text`** where the switch is only a mode and something below it is the
  interaction — Grams / Portions in the portion sheet, where the amount stepper
  is what gets touched and the calorie figure is what gets read.

Both are the same component with the same radiogroup semantics, the same
keyboard behaviour and the same 44px targets. Only the clothes differ, so a
screen never has to pick between two components that do one job.

The same rule governs `Stepper`: `default` where the control is labelled and
sits in a row of settings; `bare` where it stands alone under its own heading
and must not outweigh the value it feeds.

**Cards are used once.** `RecipeCard` is media plus type on the screen's own
ground — not a box. Do not wrap information in a container to group it; use
space.

**Data never sits on food.** See §4.

**Applied filters wrap; they never scroll sideways.** The set is small and
bounded, and a chip cut off at the screen edge reads as broken rather than as
scrollable. Long *quantitative* labels are shortened — "Under 400 kcal"
becomes "<400 kcal" — which is what keeps three filters on one line (52px)
rather than two (104px). Semantic labels (Vegan, No nuts, No dairy) are left
as written.

**The × on an applied filter stays.** Applied chips share the berry family with
the selected toggles, so without it a tap reads as "toggle" rather than
"remove". It also costs nothing vertically: four filters wrap to two lines with
or without it.

**An empty state names one binding constraint, not "your filters".** The
`constraint` prop takes `{ lead, detail }`: the lead names the single filter
doing the damage, the detail gives its consequence and previews what relaxing
it returns. It renders as a berry left rule, not a filled card — the same 2px
inset rule that marks a flagged ingredient, so "this is the thing acting on
your results" is one idiom in the product rather than two. This is the only
place outside a primary action where berry marks emphasis.

---

## 4. Image focal-point behaviour

The stylescape cropped photography with two inline custom properties, `--op`
(object-position) and `--sc` (scale). `FoodImage` turns that into an API, so a
focal point travels with the dish instead of being re-tuned at each usage.

```jsx
<FoodImage
  src={img('lentil-squash-bowl')}
  crop="landscape"     // portrait 4:5 | square 1:1 | landscape 3:2 | circle | thumb
  focalX={58}          // → --ds-op  (object-position)
  focalY={52}
  scale={1.12}         // → --ds-sc  (transform)
  alt=""               // decorative when the dish is named in adjacent text
/>
```

`transform-origin` is bound to the same value as `object-position`, so
**scaling pushes into the focal point rather than drifting away from it.** That
is the whole trick, and it is why a single `scale` number is enough.

| Crop | Ratio | Radius | Use |
|---|---|---|---|
| `portrait` | 4:5 | 20 | Product and recipe hero |
| `landscape` | 3:2 | 20 | Recipe card, Recipe Detail header |
| `square` | 1:1 | 20 | Compact cards |
| `circle` | 1:1 | 50% | The bleed crop, empty states |
| `thumb` | 1:1 | 14 | Search result rows |

`flush` drops the radius where a crop runs to the screen edge.

### The bleed signature

The brand signature is an asymmetric crop entering from one edge, balanced by
type and figures in open space. It has two hard requirements, and both are in
the system rather than left to prose:

1. **The positioning context must span the full screen width.** The offset is
   measured from the screen edge, so a parent already inset by the 24px margin
   drags the crop 24px too far in — straight over the type. Use
   `.ds-bleed-stage`, which bleeds back out to the edge and clips.
2. **The type column is capped** by `.ds-bleed-stage__type`
   (`--ds-bleed-type-width`, 196px) so the figure and its unit stop short of
   the crop, whatever the number's length.

Together these hold the rule from `DECISIONS.md`: **data never sits on food.**
This was a real bug during the build — the crop overlapped the "kcal" unit —
which is why the clearance is now enforced by tokens instead of by eye.

---

## 5. Accessibility decisions

Verified by `npm run audit`: all 59 stories, at 390px, in headless Chromium.
**0 WCAG 2.1 A/AA violations (axe-core), 0 horizontal overflow, 0 touch targets
under 44px.**

**Contrast.** Every product text pair is AA. Measured against the approved
grounds:

| Pair | Ratio |
|---|---|
| Ink on surface / canvas / soft | 17.21 / 16.50 / 15.28 |
| Ink 2 on surface / canvas / soft | 5.55 / 5.32 / 4.92 |
| Bramble on surface | 7.82 |
| White on bramble | 7.82 |
| Bramble on berry-soft | 6.83 |
| Bramble on berry-soft — selected and applied chips | 6.83 |
| Applied chip border (berry @ 70%) vs canvas — non-text, needs 3.0 | 3.90 |

The stylescape's `#8C877F` (3.57 : 1) was **not** promoted into a product text
token. The macro markers are absent from this table because none of them is
ever text: carbs (`#C08442`) is 3.17 : 1 and exists only as a 7px dot beside
the word "Carbs".

**Touch targets.** Every interactive element is at least 44 × 44, verified
programmatically rather than by eye. Where a glyph is 24px the hit area is
still 44px, and the control is negative-margined back so the glyph stays
aligned to the 24px margin. The stylescape's segmented option (~37px tall) was
raised to 44; nothing else about it changed.

The active-filter chip is removed by tapping **the whole chip** — the × is
decoration. Nesting a 24px remove button inside a 44px chip would have put two
targets where there is room for one.

**Text size.** Nothing falls below 14px, including the uppercase eyebrow.

**Focus.** One treatment for the entire system: 2px bramble at 3px offset,
`:focus-visible` only, never suppressed. Bramble is 7.82 : 1 on every approved
ground, well above the 3 : 1 a non-text indicator requires. `SearchField` moves
the ring to the whole field rather than the bare `<input>` inside it.

**Disabled is readable, not faded.** Disabled controls use ink-2 on soft fill —
4.92 : 1 — instead of dropping opacity. A user can still read what the control
would have done.

**Announcements.**
- Hero figures are spoken once, as "512 kcal", via a visually hidden span.
  (`aria-label` on a `<p>` is prohibited and was fixed during the audit.)
- The stepper value is `aria-live="polite"`, because amounts recompute in place.
- The error banner is `role="alert"`; the standing offline notice is
  `role="status"` so it does not interrupt.
- Empty states are `role="status"`, so a list emptying is announced.
- `BottomSheet` traps focus, closes on Escape or scrim tap, and returns focus
  to whatever opened it. It focuses **the panel**, not the first control —
  otherwise a keyboard user's first action would be to dismiss the sheet.
- `SegmentedControl` is a `radiogroup` with arrow-key movement, not a tab list:
  it changes the basis of a number, not the screen.

**Motion.** Every animation respects `prefers-reduced-motion`.

### Where berry appears

| Place | Role |
|---|---|
| Primary `Button`, berry `IconButton` | The primary action |
| `FilterChip` selected toggle | Selected value — full border, medium weight, check |
| `FilterChip` applied filter | Active value, one step down — 70% border, regular, × |
| `SegmentedControl` text, active option | Selected mode — berry text and underline, with medium weight |
| `TabBar` current tab | The active destination — one marker, paired with medium weight |
| `EmptyState` insight rule | Constraint emphasis |
| `IngredientRow` flagged rule | Constraint emphasis — the same idiom |
| `Banner` retry action | The one action on the banner |

`TabBar` keeps berry by decision: it is a single controlled marker consistent
with the approved stylescape, not a repeated one.

`FoodResultRow` no longer appears in this table. Its selected / current-match
state was removed entirely — see below.

### Removed, because SCREENS.md does not require them

**`FoodResultRow`'s current-match state.** SCREENS.md line 136 requires the
item-swap sheet and says only that it *"reuses Screen 1's result-list pattern
inside a sheet"*. It does not ask for the current match to be marked, and
marking it would offer the user back the entry they opened the sheet to reject.
The sheet stays; the state is gone, and the story lists alternatives only.

**`RecipeCard`'s compact variant.** Screen 3 has one list layout. "Filters
applied" is the same list with *fewer cards*, not a denser one.

**`IconButton`'s berry variant.** Every icon action across the four screens —
barcode, clear, back, close, filter — is covered by `plain` and `soft`, and
none of them is a primary action.

### Fixed: the Recipe Card gap that never rendered

`.ds-recipe-card__body` and `.ds-recipe-card__title` are `<span>`s, and both
`padding-top` and `text-wrap: balance` are inert on an inline box. The declared
16px gap measured **−2px** in the browser — the title's line box overlapped the
crop, and long titles broke wherever they landed instead of balancing. Both now
carry `display: block`, and the gap is `--ds-space-3` (24px).

### Known deviation

The secondary button's hairline is `--ds-line-strong` (1.39 : 1 against
surface), below the 3 : 1 that WCAG 1.4.11 asks of a control boundary. This is
the approved stylescape treatment, and darkening it to 3 : 1 would require a
mid-grey that visibly breaks the light, airy direction. It is retained because
the control is identified by its 17px ink label (17.21 : 1) and its 56px
target, not by the hairline, and its focus ring is well over 3 : 1. Flagged
here rather than silently changed or silently ignored.

---

## 6. Content rule

The 512 kcal in the stylescape is a **specimen value for one dish**. In
`src/lib/sampleData.js` every other food carries its own plausible figure — a
yoghurt pot is 97 kcal, a portion of dry lentils 209, a bowl of soup 246 — so
nothing in Storybook suggests that unrelated foods contain the same energy.
Macro grams are roughly consistent with their calorie totals.

---

## 7. File map

```
.storybook/         Storybook config (preview.jsx, main.js)
scripts/audit.mjs   Overflow / touch target / WCAG audit
src/
  styles/
    tokens.css      All design tokens
    base.css        Reset, focus, .ds-num, .ds-sr-only, .ds-eyebrow
    fonts.css       Self-hosted @font-face
    fonts/          woff2, latin subsets, weights 400/500/600
  components/       One folder per component: .jsx, .css, .stories.jsx
  foundations/      Colour, typography, layout and accessibility stories
  lib/
    icons.jsx       The 12 icons the four screens need
    sampleData.js   Realistic example content
    Frame.jsx       Story-only 390px wrapper (not part of the system)
  index.js          Public API
```

---

## 8. Not built, deliberately

The four screens (Food Search, Nutrition Result, Recipe Discovery, Recipe
Detail) and their eight dedicated states. This stage is the parts; the screens
are the next one.

No design system overview page was created. Storybook's Foundations section
already serves that purpose, and a second hand-written page would be a copy of
the tokens that drifts out of date.
