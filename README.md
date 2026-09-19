# Piatto

Calorie calculator — an AI-native mobile nutrition app concept focused on two core user needs:

1. Calculate calories and nutrition for a food, product or dish.
2. Discover a suitable recipe based on dietary preferences and constraints.

## Live Storybook

[Open the live Storybook](https://marinehaze.github.io/calorie-calculator/)

The Storybook includes the complete Design System and all application screens, states and edge cases.

## Key design screens

Clean PNG exports of the final screens live in [`screens/`](screens/). Each one
is a whole 390 × 844 application viewport, exported at 2× (780 × 1688) with no
Storybook chrome.

The four core screens:

- [Food Search](screens/food-search.png) — and its [first run](screens/food-search-first-run.png)
- Nutrition Result — [top](screens/nutrition-result-top.png) · [scrolled to the nutrition block](screens/nutrition-result-scrolled.png)
- [Recipe Discovery](screens/recipe-discovery.png) — and its [filters](screens/recipe-discovery-filters.png)
- Recipe Detail — [top](screens/recipe-detail-top.png) · [scrolled to the nutrition block](screens/recipe-detail-scrolled.png)

Nutrition Result and Recipe Detail are longer than a handset screen, so each is
exported twice rather than cropped once.

Selected states: [portion sheet](screens/nutrition-result-portion-sheet.png) ·
[incomplete nutrition](screens/nutrition-result-incomplete.png) ·
[error](screens/nutrition-result-error.png) ·
[loading](screens/search-loading.png) ·
[no results](screens/search-no-results.png) ·
[offline](screens/offline.png) ·
[camera access off](screens/camera-access-off.png)

## Walkthrough presentation

An eight-slide browser presentation of the project lives in
[`presentation/`](presentation/) — open
[`presentation/index.html`](presentation/index.html) in a desktop browser, with
no build step. [`presentation/piatto-case.pdf`](presentation/piatto-case.pdf) is
a static fallback for reading it as a document.

## Core flows

### Flow 1 — Calorie calculation

Users can:

- search for a food or product
- scan a barcode
- manually enter nutrition values when no match is found
- review calories and macronutrients
- adjust portion size
- correct an incorrect match
- build a multi-item dish

Key screens:

- Food Search
- Nutrition Result

### Flow 2 — Recipe discovery

Users can:

- browse recipes
- search by name
- filter by diet, exclusions, calories and preparation time
- review recipe nutrition
- adjust recipe servings
- review ingredients and method

Key screens:

- Recipe Discovery
- Recipe Detail

## Design approach

The visual direction is based on the principle:

**Precision without intimidation.**

The interface combines:

- warm neutral surfaces
- restrained berry accents
- clear nutritional hierarchy
- real food photography
- spacious mobile layouts
- reusable components
- explicit loading, empty, error and offline states

## Design System

The project includes a reusable mobile Design System built and documented in Storybook.

It covers:

- foundations and tokens
- typography
- colour
- spacing
- buttons and icon buttons
- search and input controls
- filters and segmented controls
- navigation
- nutrition components
- recipe components
- bottom sheets
- banners
- empty states
- skeletons

## AI-native workflow

The project was developed using an AI-native workflow with Claude Code.

Claude Code was used to:

- implement the Design System
- build the application screens and states
- maintain Storybook
- review layout and spacing
- validate accessibility
- audit touch targets and overflow
- verify GitHub Pages deployment
- maintain Git branches and review checkpoints

Design decisions, scope and UX logic remained explicitly documented throughout the project.

## Validation

Final Storybook audit:

- 107 stories
- 34 application states
- 0 horizontal overflow at 390 px
- 0 touch targets under 44 px
- 0 WCAG 2.1 A/AA violations
- 0 page errors

## Tech

- React
- Vite
- Storybook
- CSS
- Git / GitHub
- GitHub Actions
- GitHub Pages
- Claude Code

## Project structure

- `branding/` — branding and stylescape
- `src/components/` — reusable Design System components
- `src/screens/` — application screens and states
- `DESIGN_SYSTEM.md` — Design System rules and implementation notes
- `SCREENS.md` — screen architecture and state definitions
- `DECISIONS.md` — product and UX decisions
- `.storybook/` — Storybook configuration

## Status

Branding, Design System and both core application flows are complete, reviewed, documented and deployed.
