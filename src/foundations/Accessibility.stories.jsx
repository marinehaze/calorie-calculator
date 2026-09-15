import { Frame, Note } from '../lib/Frame';
import { Button } from '../components/Button/Button';
import { IconButton } from '../components/IconButton/IconButton';
import { FilterChip } from '../components/FilterChip/FilterChip';
import { IconBarcode } from '../lib/icons';

export default {
  title: 'Foundations/Accessibility',
};

const Row = ({ fg, bg, ratio, use, pass }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--ds-line)' }}>
    <span style={{
      width: 52, height: 40, borderRadius: 8, flex: '0 0 52px',
      background: `var(${bg})`, color: `var(${fg})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: '500 15px var(--ds-font-ui)', boxShadow: 'inset 0 0 0 1px var(--ds-line)',
    }}>Aa</span>
    <span style={{ flex: 1, minWidth: 0, font: '400 14px/1.4 var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>{use}</span>
    <span className="ds-num" style={{ font: '500 15px var(--ds-font-ui)', color: 'var(--ds-ink)', flex: '0 0 52px', textAlign: 'right' }}>{ratio}</span>
    <span style={{ font: '500 13px var(--ds-font-ui)', color: pass ? 'var(--ds-ink-2)' : 'var(--ds-berry)', flex: '0 0 46px', textAlign: 'right' }}>{pass ? 'AA' : 'fail'}</span>
  </div>
);

/** Every colour pair that carries product text, measured. The stylescape's
 *  third ink (#8C877F, 3.57 : 1) is annotation chrome and was deliberately not
 *  promoted into a product text token — ink-2 covers muted text and passes. */
export const TextContrast = {
  render: () => (
    <Frame>
      <Note>Product text pairs — 4.5 : 1 required</Note>
      <Row fg="--ds-ink" bg="--ds-surface" ratio="17.21" use="Ink on surface — values, headings" pass />
      <Row fg="--ds-ink" bg="--ds-canvas" ratio="16.50" use="Ink on canvas" pass />
      <Row fg="--ds-ink" bg="--ds-soft" ratio="15.28" use="Ink on soft fill — segmented thumb, banner" pass />
      <Row fg="--ds-ink-2" bg="--ds-surface" ratio="5.55" use="Ink 2 on surface — labels, units" pass />
      <Row fg="--ds-ink-2" bg="--ds-canvas" ratio="5.32" use="Ink 2 on canvas" pass />
      <Row fg="--ds-ink-2" bg="--ds-soft" ratio="4.92" use="Ink 2 on soft — disabled control text" pass />
      <Row fg="--ds-berry" bg="--ds-surface" ratio="7.82" use="Bramble on surface — text actions" pass />
      <Row fg="--ds-berry" bg="--ds-berry-soft" ratio="6.83" use="Bramble on its tint — quiet button, selected chip" pass />
      <Row fg="--ds-on-berry" bg="--ds-berry" ratio="7.82" use="White on bramble — primary button" pass />

      <p style={{ font: '400 15px/1.6 var(--ds-font-ui)', color: 'var(--ds-ink-2)', marginTop: 24, maxWidth: '40ch' }}>
        The macro markers are not in this table because none of them is ever text.
        Carbs (#C08442) is 3.17 : 1 on surface, which is why it exists only as a 7px
        dot beside the word “Carbs” and never as the carrier of meaning.
      </p>
    </Frame>
  ),
};

/** Touch targets. The dashed outline is the 44px hit area, drawn here only —
 *  several controls have glyphs or labels smaller than the box around them. */
export const TouchTargets = {
  render: () => {
    const ring = { outline: '1px dashed var(--ds-berry)', outlineOffset: 0, display: 'inline-flex', borderRadius: 8 };
    return (
      <Frame>
        <Note>Dashed outline = the real hit area. Minimum 44 × 44 everywhere.</Note>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={ring}><IconButton icon={<IconBarcode />} label="Scan a barcode" variant="soft" /></span>
          <span style={ring}><FilterChip mode="remove" selected>Vegan</FilterChip></span>
          <span style={ring}><Button size="small" variant="secondary">Relax this filter</Button></span>
        </div>
        <div style={{ marginTop: 16 }}>
          <span style={{ ...ring, display: 'flex' }}><Button fullWidth>Add to my day</Button></span>
        </div>
      </Frame>
    );
  },
};

/** One focus treatment for the whole system: a 2px bramble ring at 3px offset,
 *  keyboard-only, never suppressed. Tab through the controls below to see it.
 *  Bramble is 7.82 : 1 on every approved ground — well over the 3 : 1 a
 *  non-text indicator needs. */
export const FocusStates = {
  render: () => (
    <Frame>
      <Note>Tab through these — the ring is identical on every control</Note>
      <div style={{ display: 'grid', gap: 16 }}>
        <Button fullWidth>Add to my day</Button>
        <Button variant="secondary" fullWidth>Change portion</Button>
        <div style={{ display: 'flex', gap: 12 }}>
          <FilterChip selected>Vegan</FilterChip>
          <FilterChip>Under 30 min</FilterChip>
          <IconButton icon={<IconBarcode />} label="Scan a barcode" variant="soft" />
        </div>
      </div>
    </Frame>
  ),
};

/** Disabled is reduced, not faded. Ink 2 on soft fill is 4.92 : 1 — a disabled
 *  control is still readable, so a user can tell what it would have done. */
export const DisabledIsReadable = {
  render: () => (
    <Frame>
      <div style={{ display: 'grid', gap: 16 }}>
        <Button fullWidth disabled>Apply filters</Button>
        <Button variant="secondary" fullWidth disabled>Change portion</Button>
        <div><FilterChip disabled>Under 10 min</FilterChip></div>
      </div>
    </Frame>
  ),
};
