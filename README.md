# Piatto

Calorie calculator — an AI-native mobile nutrition app concept focused on two core user needs:

1. Calculate calories and nutrition for a food, product or dish.
2. Discover a suitable recipe based on dietary preferences and constraints.

## Live Storybook

[Open the live Storybook](https://marinehaze.github.io/calorie-calculator/)

The Storybook includes the complete Design System and all application screens, states and edge cases.

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
