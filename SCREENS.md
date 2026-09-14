# SCREENS.md

Screen inventory for the calorie & nutrition app.
Scope: **two user stories only**. No visual design, styling, or code — this is the structural spec that comes first.

- **US1** — As a user, I want to calculate the amount of calories in a dish or a specific product.
- **US2** — As a user, I want to find a recipe for a dish that is suitable for me.

---

## 1. Analysis of the two stories

### US1 — "calculate calories in a dish or a specific product"

Broken down, the user has to do four things:

1. **Identify** the food — by name, by barcode, or by photo of a plate.
2. **Disambiguate** — "rice" is ~40 database entries; a photo of a plate is 3 foods, not 1.
3. **Quantify** — a number is meaningless without a portion. Portion is the single biggest source of error in calorie estimation.
4. **Read the answer** — calories plus enough context (macros, per-100g vs. per-portion) to be nutritionally *aware* rather than just numerate.

Two observations that shape the screen set:

- **A "product" and a "dish" are the same object with a different item count.** A branded yoghurt is a dish of one item; a homemade stir-fry is a dish of several. Modelling them as one thing ("a dish = a list of 1..n items with a total") removes an entire screen and an entire mental model from the app.
- **Disambiguation and quantification are modal, not navigational.** Picking which "rice" and setting "180 g" are decisions made *inside* a task, not destinations. They belong in sheets, not screens.

### US2 — "find a recipe for a dish that is suitable for me"

The load-bearing words are **"suitable for me."** Without that, this is just recipe search and the app has no reason to exist. "For me" means the app holds a persistent notion of the user:

- what they don't eat (diet type, allergens, exclusions),
- roughly what calorie range a meal should land in.

That persistence is what separates "filters I retype every time" from "suitable for me," so it earns a screen. It is deliberately a *preferences* screen, **not** a goals/tracking screen — no weight target, no daily budget enforcement, no progress.

### Shared spine

Both stories end in the same place: **a nutrition readout for a portion of food.** The recipe detail's per-serving nutrition is computed by the same engine as the calculator. This is the one real overlap, and it's why the app is coherent rather than two apps in a trench coat.

---

## 2. The minimal screen set — 5 screens

| # | Screen | Story | One-sentence purpose |
|---|--------|-------|----------------------|
| 1 | **Food Search & Capture** | US1 | Let the user name, scan, or photograph what they ate so the app can identify it. |
| 2 | **Dish Breakdown** | US1 | Show what was identified, let the user correct portions, and give the calorie and macro answer. |
| 3 | **Recipe Discovery** | US2 | Let the user search and browse recipes already narrowed to what suits them. |
| 4 | **Recipe Detail** | US2 | Show one recipe in full — ingredients, method, and per-serving nutrition — so the user can decide to cook it. |
| 5 | **My Preferences** | US2 (shared) | Hold the persistent definition of "suitable for me" — diet, exclusions, calorie range. |

### Navigation shape

Two tabs, no separate home screen. A dedicated home would only be a menu with two buttons — the tab bar already *is* that menu, and skipping it puts the user one tap from the answer instead of two.

```
        ┌──────────────── Tab bar ────────────────┐
        │                                          │
 [ Calculate ]                              [ Recipes ]
        │                                          │
        ▼                                          ▼
┌──────────────────┐                    ┌──────────────────┐
│ 1. Food Search   │                    │ 3. Recipe        │
│    & Capture     │                    │    Discovery     │
└────────┬─────────┘                    └───┬──────────┬───┘
         │ pick match / confirm photo       │ tap card │ ⚙︎
         ▼                                  ▼          ▼
┌──────────────────┐                 ┌──────────────┐ ┌──────────────┐
│ 2. Dish          │                 │ 4. Recipe    │ │ 5. My        │
│    Breakdown     │◀────────────────│    Detail    │ │  Preferences │
└──────────────────┘  "nutrition     └──────────────┘ └──────┬───────┘
         │             breakdown"                            │
         └── "add another item" ──▶ back to 1                │
                                                              │
              5 feeds the filtering of 3 and 4 ◀──────────────┘
```

---

## 3. Screen-by-screen

### Screen 1 — Food Search & Capture

| | |
|---|---|
| **Story** | US1 |
| **Purpose** | Let the user name, scan, or photograph what they ate so the app can identify it. |
| **Before** | App launch (default tab), or "add another item" from Screen 2. |
| **After** | Screen 2, once a match is chosen or a photo's results are confirmed. |

Search field plus two capture affordances (barcode, camera). Results appear inline as a list below the field — a separate "search results screen" would be the same screen with a different body, so it isn't one.

| State | Needs its own design? | Notes |
|---|---|---|
| **Empty / first run** | ✅ **Yes** | The default state of the app's default tab. It has to teach all three input methods and set expectations about estimate accuracy, without becoming an onboarding wall. Highest-traffic state in the app. |
| **No results / not recognised** | ✅ **Yes** | Where trust is lost. Needs real recovery: loosen the query, try a photo instead, enter values manually. Not a shrug emoji. |
| **Photo analysis in progress** | ✅ **Yes** | Multi-second, non-instant operation on a captured image. A spinner over a frozen camera frame reads as a crash; this state needs to show the image and what's being found in it. |
| Typing / suggestions | ➖ Minor | Dropdown of query completions under the field. |
| Text search loading | ➖ Minor | Skeleton rows in the result list. Sub-second. |
| Results list | ➖ Minor | The populated body of the empty state. |
| Camera permission denied | ➖ Minor | Standard inline prompt with a link to system settings. |
| Offline / network error | ➖ Minor | Shared app-wide banner pattern with retry (see *Cross-cutting* below). |

---

### Screen 2 — Dish Breakdown

| | |
|---|---|
| **Story** | US1 |
| **Purpose** | Show what was identified, let the user correct portions, and give the calorie and macro answer. |
| **Before** | Screen 1 (match chosen / photo confirmed), or Screen 4 ("see nutrition breakdown"). |
| **After** | Terminal for US1 — the user has their answer. Can loop back to Screen 1 to add an item. |

One item or many, same screen: a list of items each with its portion, above a total with a macro split. Portion editing and swapping a mis-identified item both open as **sheets**, not screens — they're decisions inside the task, not destinations.

| State | Needs its own design? | Notes |
|---|---|---|
| **Single item (product)** | ✅ **Yes** | The dominant case. Should feel like a clean product readout, not a one-row list — the layout has to hold up at n=1. |
| **Multi-item (composed dish)** | ✅ **Yes** | Genuinely different layout problem: per-item rows, running total, contribution of each item. The same template stretched to n=5 is how this goes wrong. |
| **Low-confidence estimate** | ✅ **Yes** | Central to a *nutrition-awareness* product. When a photo estimate or a generic database entry is uncertain, the screen must say so and invite correction. Overstated precision is the failure mode this app must avoid. |
| **Incomplete nutrition data** | ✅ **Yes** | Common in real food databases: calories known, micronutrients missing. The layout must degrade honestly rather than render zeroes, which read as facts. |
| Portion adjustment sheet | ➖ Minor | Unit selector + amount; total recalculates live behind it. Sheet, not screen. |
| Item swap / correction sheet | ➖ Minor | Reuses Screen 1's result-list pattern in a sheet. |
| Recalculating after edit | ➖ Minor | Numbers transition in place. No blocking spinner. |

---

### Screen 3 — Recipe Discovery

| | |
|---|---|
| **Story** | US2 |
| **Purpose** | Let the user search and browse recipes already narrowed to what suits them. |
| **Before** | Tab bar (second tab), or returning from Screen 4 / Screen 5. |
| **After** | Screen 4 (tap a recipe), or Screen 5 (edit what "suitable" means). |

Results are **pre-filtered by Screen 5's preferences on arrival** — that's the whole point of "for me." Per-session refinements (time, calories per serving, ingredients on hand) live in a filter sheet; they tune the current search without rewriting the profile.

| State | Needs its own design? | Notes |
|---|---|---|
| **Browse / default results** | ✅ **Yes** | The landing state. Must visibly communicate *why* these results — "matching your preferences" — or the personalisation is invisible and therefore worthless. |
| **No matching recipes** | ✅ **Yes** | Frequent and structural: strict preferences plus a narrow query empties the list. Needs to name which constraint is binding and offer to relax exactly that one. The most important empty state in the app. |
| **Preferences not yet set** | ✅ **Yes** | Before Screen 5 has ever been visited, "suitable for me" is undefined. This state's job is one clear invitation to define it — while still showing unfiltered results, so the app is never a locked door. |
| Loading results | ➖ Minor | Skeleton cards. |
| Filter sheet open | ➖ Minor | Standard sheet; active filters shown as chips on return. |
| Offline / error | ➖ Minor | Shared banner pattern. |

---

### Screen 4 — Recipe Detail

| | |
|---|---|
| **Story** | US2 |
| **Purpose** | Show one recipe in full — ingredients, method, and per-serving nutrition — so the user can decide to cook it. |
| **Before** | Screen 3. |
| **After** | Terminal for US2. Optional bridge into Screen 2 via "see nutrition breakdown." |

Carries a servings control, since changing servings changes both ingredient amounts and per-serving nutrition. This is the join between the two stories: its nutrition block is Screen 2's engine, summarised.

| State | Needs its own design? | Notes |
|---|---|---|
| **Full recipe** | ✅ **Yes** | The screen's reason to exist: ingredients, steps, and nutrition in one readable scroll. |
| **Partial preference conflict** | ✅ **Yes** | A recipe that suits the user except for one ingredient. Flagging it in place — with a swap suggestion — is far more useful than hiding the recipe, and directly serves "suitable for me." |
| Servings adjusted | ➖ Minor | Amounts and nutrition recompute in place. |
| Loading | ➖ Minor | Skeleton, or progressive fill from the list card's data. |
| Step-by-step / cook mode | ➖ Minor | **Deliberately deferred.** Cooking is out of scope — the story ends at *finding* a suitable recipe. |
| Error / unavailable | ➖ Minor | Shared banner pattern. |

---

### Screen 5 — My Preferences

| | |
|---|---|
| **Story** | US2 (used lightly by US1 for flagging) |
| **Purpose** | Hold the persistent definition of "suitable for me" — diet, exclusions, calorie range. |
| **Before** | Screen 3 (settings affordance, or the "preferences not set" prompt). |
| **After** | Back to Screen 3, with results re-filtered. |

Deliberately **preferences, not goals**: diet type, allergens and exclusions, a rough calorie-per-meal range, and unit system. No weight target, no daily budget, no tracking — that's the line that keeps this a nutrition-awareness app.

| State | Needs its own design? | Notes |
|---|---|---|
| **Default / editing** | ✅ **Yes** | A single form-like screen; there is no second layout to design. Everything below is a variation of it. |
| Nothing set yet | ➖ Minor | Same screen with unselected controls; differs only in copy. |
| Saved / applied | ➖ Minor | Brief confirmation, then back to Screen 3 with filters visibly updated. |
| Conflicting selections | ➖ Minor | Inline validation note (e.g. vegan + an animal-product exclusion that is now redundant). |

---

## 4. Summary

**5 screens. 12 states need dedicated visual design; 17 are minor variations describable in a spec.**

| Screen | Story | Dedicated state designs |
|---|---|---|
| 1. Food Search & Capture | US1 | 3 |
| 2. Dish Breakdown | US1 | 4 |
| 3. Recipe Discovery | US2 | 3 |
| 4. Recipe Detail | US2 | 2 |
| 5. My Preferences | US2 / shared | 1 |

### Cross-cutting patterns (define once, not per screen)

- **Offline / network error** — one banner with retry, applied app-wide.
- **Skeleton loading** — one pattern for list rows and cards.
- **Sheets** — portion, item swap, filters all use the same sheet behaviour.
- **Uncertainty language** — one consistent way of expressing estimate confidence, used on Screens 2 and 4.

### Deliberately excluded

Each of these is a real product, and each would pull the app toward the fitness / weight-loss / meal-planning platform the brief rules out:

| Not included | Why |
|---|---|
| Onboarding flow | Screen 1's empty state and Screen 3's "preferences not set" state do this in context, at the moment it matters. |
| Daily diary / food log | Turns a calculator into a tracker. Neither story asks to *record* anything. |
| Dashboard, charts, streaks | Requires a log to exist, and implies goals. |
| Goal setting / weight tracking | Explicitly out of scope. |
| Meal planner, shopping list | Explicitly out of scope. |
| Saved recipes / favourites | Plausible next feature, but neither story needs it to be complete. |
| History of past calculations | Same — a convenience, not part of either story. |
| Login / account | Preferences work locally. Accounts exist to sync data the app doesn't yet keep. |
| Cook mode | US2 ends at *finding* a recipe, not cooking it. |
| Separate home / dashboard | Would be a menu of two items that the tab bar already provides. |

### Open questions for you

1. **Photo recognition in v1?** It shapes Screen 1 heavily (camera capture, confirmation flow, ~3 designed states). Text search plus barcode alone would be a meaningfully smaller build.
2. **Recipe source** — licensed database, or generated? Affects how much Screen 4 can promise about nutrition accuracy.
3. **Screen 2's "add another item" loop** — enough for composing a homemade dish, or is a first-class ingredient-builder needed? I've assumed the loop is enough.

---

*Structure only — no visual design, styling, or implementation. Awaiting confirmation before proceeding.*
