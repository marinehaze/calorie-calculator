# DECISIONS.md

Key design decisions for the calorie & nutrition app. One entry per decision.

---

## Visual direction: from Precision / Data-Native to light, food-led

### Decision

We explored a **Precision / Data-Native** visual direction first — a dark instrument panel, monospaced figures, calibration ticks, dial gauges and a unit-count matrix — and did not select it.

The selected direction keeps that precision in the product's **structure and behaviour**, and moves the **visual language** to a light, spacious, food-led territory: warm neutral ground, Plus Jakarta Sans against Inter Tight, one berry accent (`#8A3355`), and real food photography as a primary element rather than supporting evidence.

### Why

This is a usability decision before it is an aesthetic one.

Both core jobs — work out what is in a dish, and find a recipe that suits you right now — are everyday, frequent, and often done while cooking or standing in a shop. The Data-Native language read as a measuring instrument, and that created three concrete problems:

1. **It over-claimed precision.** Calibration marks and tick rings signal instrument-grade measurement. The underlying figures are database estimates against a user-entered portion. The visual language wrote a cheque the data cannot cash, which is a trust problem the moment a user notices.

2. **It raised the cost of a glance.** Dense hairline grids and monospaced figures are excellent for comparing many values at once. Both core tasks end in reading *one* number. The density added scanning work with no corresponding payoff.

3. **It framed food as data only.** Choosing a recipe is partly an appetite decision. A dark panel with no photography made that decision harder, not easier — the product could tell you what was in a dish but not whether you wanted it.

### What we kept from Precision / Data-Native

- **Information architecture** — four screens, two tabs, no home menu. Decisions made inside a task (portion, item swap, filters) stay in sheets instead of becoming destinations.
- **Nutrition hierarchy** — calories are the answer and get the most space; portion and per-100 g form one secondary pair; protein, carbs and fat sit on one grid at equal visual weight.
- **Numeric clarity** — tabular figures everywhere, values right-aligned into fixed columns, units never competing with the values they belong to.
- **Product behaviour** — portions recalculate in place rather than behind a blocking spinner; a missing value says so in words and is never rendered as a zero.
- **Interaction logic** — one primary action per surface; active filters stay visible as the current definition of "suitable for me".

### What we deliberately removed

- The dark instrument panel and its night-readout palette.
- Monospace as the brand voice. It now appears nowhere in the interface.
- Calibration ticks, rulers, dial gauges and the unit-count matrix — measurement theatre around numbers that are already as precise as they can be.
- Heavy square grotesks. Weight no longer substitutes for hierarchy; scale and spacing do that work.
- Red / amber / green semantics on nutrition values. Nothing turns red at someone for eating.

### Trade-off / Risk

The Data-Native direction was genuinely unusual in this category. **The direction we selected is not.**

Light, spacious, premium and food-led is the established visual territory of modern nutrition and recipe products. We have traded distinctiveness at first glance for fit with the task. The real risk is becoming **visually polished but commercially invisible** — a product that looks good in a screenshot and looks like six competitors when placed beside them.

We are accepting that risk knowingly. A product used before lunch has to be legible and unintimidating before it is memorable, and an unusual look is worth nothing if it makes an everyday task feel clinical.

### Mitigation

Differentiation comes from execution, not decoration:

- **Unusually clear nutrition hierarchy** — one hero number, one secondary pair, one macro grid, and nothing else competing for attention. Most competitors fragment this across widgets.
- **Precise product behaviour** — portion editing, live recalculation, honest missing data, and recovery from empty states handled better than the category handles them.
- **A distinctive food + data composition** — the asymmetric crop entering from one edge, balanced by typography and figures in open space. Data never sits on food.
- **Typography** — Plus Jakarta Sans against Inter Tight, with hero figures given presence by scale, spacing and a medium weight chosen for at-a-glance readability.
- **A consistent visual signature** applied without exception, so the product is recognised by its rhythm rather than by an ornament.
- **Strong execution over novelty.** The distinctiveness has to survive daily use, which decorative novelty does not.

The principle governing the whole direction:

> **Precision without intimidation.**

Precision belongs to the information and the behaviour. The surface stays calm, light and human.
