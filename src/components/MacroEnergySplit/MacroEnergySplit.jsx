import './MacroEnergySplit.css';

/**
 * MacroEnergySplit — where the calories in this portion come from.
 *
 * Sits immediately above MacroGroup and answers a question the grams cannot:
 * 22 g of fat and 19 g of protein look alike as weights, but fat carries
 * nearly three times the energy. Three lines, top to bottom:
 *
 *   "Macro energy split"                    the one phrase naming the calculation
 *   "29% Protein · 60% Carbs · 11% Fat"     the shares, tabular
 *   the segmented arc                        the same shares, drawn
 *
 * Energy is grams × 4 / 4 / 9 (protein / carbs / fat). Shares are rounded by
 * largest remainder so they always total 100.
 *
 * The arc is the brand's segmented arc — data only, never the logo: three
 * segments of one circle with 16° gaps, round terminals, no track. It uses
 * the three macro tokens and nothing else; the summary line carries the whole
 * meaning and the arc is hidden from assistive technology so it is announced
 * once. No goal, no target, no remaining value: this is composition, not
 * progress.
 *
 * Renders nothing when any macro is unavailable or non-numeric, or the total
 * is zero. Unknown is never drawn as zero; MacroGroup below already says
 * "Not available" in words.
 *
 * `pending` is the recalculating state: the shares and the arc dim in place,
 * same as the hero figure and the gram values, so nothing on the screen moves. The last
 * known split stays visible; assistive technology is told the split is
 * recalculating rather than read stale percentages as confirmed.
 */
const MACROS = [
  { key: 'protein', label: 'Protein', kcalPerGram: 4, color: 'var(--ds-macro-protein)' },
  { key: 'carbs',   label: 'Carbs',   kcalPerGram: 4, color: 'var(--ds-macro-carbs)' },
  { key: 'fat',     label: 'Fat',     kcalPerGram: 9, color: 'var(--ds-macro-fat)' },
];

/** Energy shares in whole percent, totalling exactly 100. Null when the input
 *  cannot be turned into a split. */
export const energyShares = (macros) => {
  const grams = MACROS.map(({ key }) => macros?.[key]);
  if (grams.some((g) => typeof g !== 'number' || !Number.isFinite(g) || g < 0)) return null;
  const kcal = grams.map((g, i) => g * MACROS[i].kcalPerGram);
  const total = kcal.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  const raw = kcal.map((k) => (k / total) * 100);
  const pct = raw.map(Math.floor);
  const left = 100 - pct.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - Math.floor(r), i])
    .sort((a, b) => b[0] - a[0])
    .slice(0, left)
    .forEach(([, i]) => { pct[i] += 1; });
  return { pct, kcal, total };
};

/* Arc geometry: one circle, three segments, 16° gaps, 12.5 stroke on a 100
   viewBox — the construction from the brand board. Start at 12 o'clock. */
const GAP = 16, R = 43.75, STROKE = 12.5;
const CAP = Math.asin((STROKE / 2) / R) * 180 / Math.PI;
const point = (deg) => [50 + R * Math.cos(deg * Math.PI / 180), 50 + R * Math.sin(deg * Math.PI / 180)];

const segments = (kcal, total) => {
  const usable = 360 - GAP * kcal.length;
  let start = -90 + GAP / 2;
  return kcal.map((v) => {
    const sweep = usable * v / total;
    const s = start + CAP, e = Math.max(start + sweep - CAP, s + 0.5);
    const [x0, y0] = point(s), [x1, y1] = point(e);
    start += sweep + GAP;
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${sweep - 2 * CAP > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  });
};

export const MacroEnergySplit = ({ macros, pending = false, label = 'Macro energy split' }) => {
  const split = energyShares(macros);
  if (!split) return null;
  const { pct, kcal, total } = split;
  const a11y = pending
    ? `${label}: recalculating`
    : `${label}: ${MACROS.map((m, i) => `${m.label} ${pct[i]}%`).join(', ')}`;

  return (
    <div className={['ds-energy-split', pending && 'ds-energy-split--pending'].filter(Boolean).join(' ')}>
      {/* One concise announcement for the whole block; the three visible
          lines are hidden from assistive technology so nothing is read twice. */}
      <p className="ds-sr-only">{a11y}</p>
      <p className="ds-energy-split__label" aria-hidden="true">{label}</p>
      <p className="ds-energy-split__summary ds-num" aria-hidden="true">
        {MACROS.map((m, i) => (
          <span key={m.key}>
            {i > 0 && <span className="ds-energy-split__sep">·</span>}
            {pct[i]}% {m.label}
          </span>
        ))}
      </p>
      <svg className="ds-energy-split__arc" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        {segments(kcal, total).map((d, i) => (
          <path key={MACROS[i].key} d={d} stroke={MACROS[i].color} />
        ))}
      </svg>
    </div>
  );
};
