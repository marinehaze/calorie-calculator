# SCREENS.md

Screen inventory for the calorie & nutrition app.
Scope: **two user stories only**. No visual design, styling, or code — this is the structural spec that comes first.

- **US1** — As a user, I want to calculate the amount of calories in a dish or a specific product.
- **US2** — As a user, I want to find a recipe for a dish that is suitable for me.

## Scope decisions (v1)

| Decision | Consequence |
|---|---|
| **No photo recognition.** | The US1 flow is text search. Barcode scan is an optional supporting action on the search screen, not a screen of its own. |
| **No dedicated preferences screen.** | Diet, exclusions, and calorie range are session filters in a bottom sheet on Recipe Discovery. Persistent saved preferences: possible future enhancement, not in scope. |
| **Recipes and nutrition data come from a trusted external database.** | No source management, no data-quality UI, no backend scoping in this document. |
| **Homemade dishes use the "add another item" loop.** | No ingredient-builder screen. |

---

## 1. Analysis of the two stories

### US1 — "calculate calories in a dish or a specific product"

Three steps, once photo input is out:

1. **Identify** the food by name, or by barcode for a packaged product.
2. **Quantify** — a calorie number is meaningless without a portion. Portion is the single biggest source of error in calorie estimation.
3. **Read the answer** — calories plus enough context (macros, per-100 g vs. per-portion) to be nutritionally *aware* rather than just numerate.

Two observations that shape the screen set:

- **A "product" and a "dish" are the same object with a different item count.** A branded yoghurt is a dish of one item; a homemade stir-fry is a dish of several. Modelling them as one thing — *a list of 1..n items with a total* — removes a screen and a whole mental model. The screen name has to be neutral enough to carry both, hence **Nutrition Result**.
- **Choosing a match and setting a portion are modal, not navigational.** Picking which "rice" and setting "180 g" are decisions made *inside* a task, not destinations. They belong in a list and a sheet, not on screens.

**Barcode** deserves a note: it is an input shortcut, not a flow. A successful scan skips search entirely and lands directly on Nutrition Result with a single item. It adds a button and a camera overlay to Screen 1 — no new screen, no new destination.

### US2 — "find a recipe for a dish that is suitable for me"

The load-bearing words are **"suitable for me."** Without them this is just recipe search.

With saved preferences out of scope, "for me" is expressed as **filters the user sets in the moment**: diet type, ingredients to exclude, calories per serving, time. This is a real trade-off, stated plainly:

- **Cost** — the user re-specifies constraints each session. For someone with a fixed constraint (vegan, a nut allergy) that is repetitive, and it's exactly the friction persistence would remove later.
- **Benefit** — it removes a screen and a persistence layer from v1, and the filter sheet is the same UI a preferences screen would have been. When persistence is added later it becomes a "remember these" affordance *on the existing sheet*, not a new screen. Nothing designed now gets thrown away.

Because the filter sheet now carries the entire meaning of "suitable for me," it is the most important non-screen surface in the app and is called out as deserving dedicated treatment below.

### Shared spine

Both stories end in the same place: **a nutrition readout for a portion of food.** Recipe Detail's per-serving nutrition is the same block as Nutrition Result, summarised. That single overlap is what makes this one app rather than two.

---

## 2. The core screen set — 4 screens

| # | Screen | Story | One-sentence purpose |
|---|--------|-------|----------------------|
| 1 | **Food Search** | US1 | Let the user find a product or dish by name — or scan a barcode — so the app can identify it. |
| 2 | **Nutrition Result** | US1 | Show what was identified, let the user correct portions, and give the calorie and macro answer for one item or a whole dish. |
| 3 | **Recipe Discovery** | US2 | Let the user search recipes and narrow them to what suits them right now. |
| 4 | **Recipe Detail** | US2 | Show one recipe in full — ingredients, method, per-serving nutrition — so the user can decide to cook it. |

### Navigation shape

Two tabs, no home screen. A home would be a menu of two items that the tab bar already provides, and it puts an extra tap between the user and the answer.

```
        ┌──────────────── Tab bar ────────────────┐
        │                                          │
 [ Calculate ]                              [ Recipes ]
        │                                          │
        ▼                                          ▼
┌──────────────────┐                    ┌──────────────────┐
│ 1. Food Search   │                    │ 3. Recipe        │
│                  │                    │    Discovery     │
│  [text search]   │                    │                  │
│  [barcode ⌷]─────┼──┐                 │  ▤ filter sheet  │◀── "suitable
└────────┬─────────┘  │                 └────────┬─────────┘     for me"
         │ tap match  │ scan            tap card │
         ▼            │                          ▼
┌──────────────────┐  │                 ┌──────────────────┐
│ 2. Nutrition     │◀─┘                 │ 4. Recipe        │
│    Result        │◀───────────────────│    Detail        │
└────────┬─────────┘   "nutrition       └──────────────────┘
         │              breakdown"
         └── "add another item" ──▶ back to 1
```

---

## 3. Screen-by-screen

State legend: **◆ dedicated** — materially different layout, or carries enough UX weight to be designed on its own. **· variation** — a component or content change describable in a spec.

### Screen 1 — Food Search

| | |
|---|---|
| **Story** | US1 |
| **Purpose** | Let the user find a product or dish by name — or scan a barcode — so the app can identify it. |
| **Before** | App launch (default tab), or "add another item" from Screen 2. |
| **After** | Screen 2, on tapping a result or completing a scan. |

A search field with results inline below it, plus a barcode affordance. A separate "search results screen" would be this screen with a different body, so it isn't one.

| State | | Notes |
|---|---|---|
| **Empty / first run** | ◆ | The default state of the app's default tab, and structurally different from every other state — no result list at all. It has to make the search field obvious, surface barcode as an alternative, and set expectations about estimate accuracy, without becoming an onboarding wall. |
| **No results** | ◆ | Different layout (no list) and the app's key recovery path: broaden the query, try a related term, or enter values manually. Trust is lost here if it's a shrug. |
| Results list | · | The populated body of the same screen. |
| Typing / suggestions | · | Completions under the field. |
| Loading | · | Skeleton rows. Sub-second against a hosted database. |
| Barcode scanning overlay | · | Camera view over the same screen; on success, straight to Screen 2. |
| Barcode not found | · | Falls back to the **no results** state with the scanned code pre-filled. |
| Camera permission denied | · | Standard inline prompt linking to system settings. |
| Offline / error | · | Shared app-wide banner (see *Cross-cutting*). |

---

### Screen 2 — Nutrition Result

| | |
|---|---|
| **Story** | US1 |
| **Purpose** | Show what was identified, let the user correct portions, and give the calorie and macro answer for one item or a whole dish. |
| **Before** | Screen 1 (result tapped or barcode scanned), or Screen 4 ("see nutrition breakdown"). |
| **After** | Terminal for US1 — the user has their answer. Loops back to Screen 1 to add an item. |

One item or many, same screen: items each with their portion, above a total with a macro split. Portion editing and swapping a mis-matched item open as **sheets** — decisions inside the task, not destinations.

| State | | Notes |
|---|---|---|
| **Single item** | ◆ | The dominant case and a distinct layout problem: it must read as a clean product readout, not a one-row list. The template has to hold up at n=1. |
| **Multi-item dish** | ◆ | Genuinely different layout: per-item rows, each item's contribution, and a running total that stays visible while the list grows. Not the single-item template stretched. |
| Portion adjustment sheet | · | Unit selector and amount; the total recalculates live behind it. |
| Item swap / correction sheet | · | Reuses Screen 1's result-list pattern inside a sheet. |
| Recalculating after an edit | · | Numbers transition in place — no blocking spinner. |
| Item removed from a dish | · | Row leaves, total recalculates. |
| Incomplete nutrition data | · | Real databases carry entries with calories but no micronutrient detail. The nutrition block renders fewer rows and says which are unavailable — a component variation, not a layout change. It must never render a missing value as zero, which reads as a fact. |
| Loading | · | Skeleton, or progressive fill from the tapped result's data. |
| Error | · | Shared banner. |

> Dropped from the previous draft: **low-confidence estimate** as a dedicated state. It existed to handle photo-recognition guesses. With text search against a trusted database, uncertainty is narrow enough to be a label on the portion and source line rather than a designed state.

---

### Screen 3 — Recipe Discovery

| | |
|---|---|
| **Story** | US2 |
| **Purpose** | Let the user search recipes and narrow them to what suits them right now. |
| **Before** | Tab bar (second tab), or back from Screen 4. |
| **After** | Screen 4 (tap a recipe). |

Search plus a results list, with a filter sheet holding diet type, exclusions, calories per serving, and time. Active filters show as chips under the search field so the user can always see what "suitable" currently means — and remove one in a tap.

| State | | Notes |
|---|---|---|
| **Browse / results** | ◆ | The landing state and the screen's main layout. |
| **Filter sheet** | ◆ | A sheet, not a screen — but it now carries the entire meaning of "suitable for me," and it's the surface that replaced a dedicated preferences screen. It needs real design: diet, exclusions, calorie range, and time, legible and fast to set. This is where persistence would later attach as a "remember these" affordance. |
| **No matching recipes** | ◆ | Structural and frequent: filters plus a narrow query empties the list often. Different layout, and it must name *which* constraint is binding and offer to relax that one specifically. The most important empty state in the app. |
| Filters applied | · | Same list, fewer cards, chips visible under the search field. |
| Loading | · | Skeleton cards. |
| Offline / error | · | Shared banner. |

> Dropped: **"preferences not yet set."** With no persistence, there is nothing to set up front — an unfiltered list is a valid starting point.

---

### Screen 4 — Recipe Detail

| | |
|---|---|
| **Story** | US2 |
| **Purpose** | Show one recipe in full — ingredients, method, per-serving nutrition — so the user can decide to cook it. |
| **Before** | Screen 3. |
| **After** | Terminal for US2. Optional bridge to Screen 2 via "see nutrition breakdown." |

Carries a servings control, since changing servings changes both ingredient amounts and per-serving nutrition. Its nutrition block is Screen 2's, summarised — the join between the two stories.

| State | | Notes |
|---|---|---|
| **Full recipe** | ◆ | The screen's reason to exist: ingredients, steps, and nutrition in one readable scroll. There is no second layout here to design. |
| Servings adjusted | · | Amounts and nutrition recompute in place. |
| Ingredient flagged against an active filter | · | Inline marker on the offending ingredient. Only reachable when a recipe partially matches; a content variation, not a layout. |
| Loading | · | Skeleton, or progressive fill from the list card's data. |
| Error / unavailable | · | Shared banner. |
| Step-by-step cook mode | — | **Out of scope.** US2 ends at *finding* a suitable recipe, not cooking it. |

---

## 4. Summary

**4 screens. 8 states deserve dedicated visual treatment; the rest are component or content variations.**

| Screen | Story | Dedicated states |
|---|---|---|
| 1. Food Search | US1 | 2 — empty / first run, no results |
| 2. Nutrition Result | US1 | 2 — single item, multi-item dish |
| 3. Recipe Discovery | US2 | 3 — browse / results, filter sheet, no matching recipes |
| 4. Recipe Detail | US2 | 1 — full recipe |

Both stories complete end to end:

- **US1** — Search or scan (1) → Nutrition Result (2). Two screens, one tap to the answer.
- **US2** — Discovery with filters (3) → Recipe Detail (4). Two screens.

### Cross-cutting patterns (define once, not per screen)

- **Offline / network error** — one banner with retry, applied app-wide.
- **Skeleton loading** — one pattern for list rows and recipe cards.
- **Sheets** — portion, item swap, and filters share one sheet behaviour.
- **Nutrition block** — one component, used full-size on Screen 2 and summarised on Screen 4.
- **Missing-data handling** — one consistent way of showing "not available," never a zero.

### Deliberately excluded

| Not included | Why |
|---|---|
| Photo recognition | Out of scope for v1. |
| Dedicated preferences screen | Handled as filters on Screen 3. |
| Ingredient-builder screen | The "add another item" loop covers homemade dishes. |
| Onboarding flow | Screen 1's empty state does this in context, at the moment it matters. |
| Daily diary / food log | Turns a calculator into a tracker. Neither story asks to *record* anything. |
| Dashboard, charts, streaks | Requires a log, and implies goals. |
| Goal setting / weight tracking | Explicitly out of scope. |
| Meal planner, shopping list | Explicitly out of scope. |
| Saved recipes / favourites | Plausible next feature; neither story needs it. |
| History of past calculations | A convenience, not part of either story. |
| Login / account | Nothing persists yet that would need syncing. |
| Cook mode | US2 ends at finding a recipe. |
| Separate home / dashboard | The tab bar already is the menu. |

### Noted as possible future enhancements

Not designed now, but each attaches to an existing surface rather than adding a screen:

- **Persistent saved preferences** — a "remember these filters" affordance on Screen 3's filter sheet.
- **Photo recognition** — a third input on Screen 1, feeding Screen 2's multi-item layout, which already exists.
- **History / favourites** — would need new surfaces; genuinely a later scope decision.

---

*Structure only — no visual design, styling, or implementation. Awaiting confirmation before proceeding.*
