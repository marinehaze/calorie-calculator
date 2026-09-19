import { Frame, Note } from '../lib/Frame';

export default {
  title: 'Foundations',
};

/* ------------------------------------------------------------------ colour */

const Swatch = ({ token, name, value, on = 'var(--ds-ink)', ring = false }) => (
  <div style={{
    background: `var(${token})`,
    color: on,
    borderRadius: 'var(--ds-radius-md)',
    aspectRatio: '5 / 4',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 14,
    boxShadow: ring ? 'inset 0 0 0 1px var(--ds-line)' : 'none',
  }}>
    <b style={{ font: '500 15px var(--ds-font-ui)' }}>{name}</b>
    <span style={{ font: '400 14px var(--ds-font-ui)' }}>{value}</span>
    <span style={{ font: '400 14px var(--ds-font-ui)', marginTop: 2 }}>{token}</span>
  </div>
);

export const Colour = {
  name: 'Colour',
  render: () => (
    <Frame background="canvas">
      <Note>Neutral ground, one berry, food for everything else</Note>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Swatch token="--ds-canvas" name="Canvas" value="#FBFAF8" ring />
        <Swatch token="--ds-surface" name="Surface" value="#FFFFFF" ring />
        <Swatch token="--ds-soft" name="Soft fill" value="#F4F1EC" />
        <Swatch token="--ds-berry-soft" name="Berry soft" value="#F7EDF1" />
        <Swatch token="--ds-ink" name="Ink" value="#1C1B19" on="#FBFAF8" />
        <Swatch token="--ds-ink-2" name="Ink 2" value="#6B6863" on="#FFFFFF" />
        <Swatch token="--ds-berry" name="Bramble" value="#8A3355" on="#FFFFFF" />
      </div>

      <div style={{ marginTop: 32 }}>
        <Note>Derived interaction states — not palette colours, and never used on their own</Note>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            ['--ds-berry-deep', 'Bramble deep', '#732643', 'Hover and pressed for a bramble surface. Only ever reached from bramble.'],
            ['--ds-berry-line', 'Bramble line', 'berry @ 70%', 'The applied-filter chip boundary. The approved bramble at reduced alpha.'],
          ].map(([token, label, value, use]) => (
            <span key={token} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, font: '400 15px/1.45 var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>
              <i style={{ width: 16, height: 16, borderRadius: 4, background: `var(${token})`, flex: '0 0 16px', marginTop: 3 }} />
              <span><b style={{ color: 'var(--ds-ink)', fontWeight: 500 }}>{label}</b> · {value}<br />{use}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Note>Macro markers — 7px dots, never fills or bars, always beside their label</Note>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            ['--ds-macro-protein', 'Protein', '#2F6F6B'],
            ['--ds-macro-carbs', 'Carbs', '#A57D31'],
            ['--ds-macro-fat', 'Fat', '#B36E49'],
          ].map(([token, label, hex]) => (
            <span key={token} style={{ display: 'flex', alignItems: 'center', gap: 11, font: '400 15px var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>
              <i style={{ width: 7, height: 7, borderRadius: '50%', background: `var(${token})`, flex: '0 0 7px' }} />
              {label} · {hex}
            </span>
          ))}
        </div>
      </div>

      <p style={{ font: '400 15px/1.6 var(--ds-font-ui)', color: 'var(--ds-ink-2)', marginTop: 24, maxWidth: '40ch' }}>
        Bramble marks the primary action, the selected or active state, constraint
        emphasis, and the occasional hero emphasis. Everywhere else stays neutral so
        photography carries the colour. Bramble deep and bramble line are derived from
        it and are never an independent accent.
      </p>
    </Frame>
  ),
};

/* -------------------------------------------------------------- typography */

const TypeRow = ({ spec, children }) => (
  <div style={{ padding: '20px 0', borderTop: '1px solid var(--ds-line)' }}>
    <p style={{ font: '400 13px/1.5 var(--ds-font-ui)', color: 'var(--ds-ink-2)', marginBottom: 10 }}>{spec}</p>
    {children}
  </div>
);

export const Typography = {
  name: 'Typography',
  render: () => (
    <Frame>
      <Note>True 390px values — nothing here is scaled for the page</Note>

      <TypeRow spec="Hero calorie · Plus Jakarta Sans 500 · 76 / .92 / −4% · tabular">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 11 }}>
          <span className="ds-num" style={{ font: '500 76px/.92 var(--ds-font-display)', letterSpacing: '-.04em' }}>512</span>
          <span style={{ font: '400 17px var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>kcal</span>
        </div>
      </TypeRow>

      <TypeRow spec="Display · Plus Jakarta Sans 600 · 34 / 1.12 / −3%">
        <p style={{ font: '600 34px/1.12 var(--ds-font-display)', letterSpacing: '-.03em' }}>Roast squash &amp; red lentils</p>
      </TypeRow>

      <TypeRow spec="Heading · Plus Jakarta Sans 600 · 27 / 1.14 / −2.8%">
        <p style={{ font: '600 27px/1.14 var(--ds-font-display)', letterSpacing: '-.028em' }}>Lentil &amp; vegetable soup</p>
      </TypeRow>

      <TypeRow spec="Title · Plus Jakarta Sans 600 · 22 / −2.5%">
        <p style={{ font: '600 22px var(--ds-font-display)', letterSpacing: '-.025em' }}>Nutrition</p>
      </TypeRow>

      <TypeRow spec="Value large · Plus Jakarta Sans 500 · 24 · tabular">
        <p className="ds-num" style={{ font: '500 24px/1 var(--ds-font-display)', letterSpacing: '-.022em' }}>58 g</p>
      </TypeRow>

      <TypeRow spec="Value · Plus Jakarta Sans 500 · 20 · tabular">
        <p className="ds-num" style={{ font: '500 20px var(--ds-font-display)', letterSpacing: '-.02em' }}>340 g · 151 kcal</p>
      </TypeRow>

      <TypeRow spec="Control · Inter Tight 500 · 17">
        <p style={{ font: '500 17px var(--ds-font-ui)' }}>Add to my day</p>
      </TypeRow>

      <TypeRow spec="Body · Inter Tight 400 · 16 / 1.6">
        <p style={{ font: '400 16px/1.6 var(--ds-font-ui)' }}>
          Roasted until the edges catch, then folded through lentils with lemon and tahini.
          Best warm, and it keeps for two days.
        </p>
      </TypeRow>

      <TypeRow spec="Label · Inter Tight 400 · 15 · Ink 2">
        <p style={{ font: '400 15px var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>Per 100 g</p>
      </TypeRow>

      <TypeRow spec="Eyebrow · Inter Tight 500 · 14 / +0.1em · Ink 2 — the floor of the scale">
        <p className="ds-eyebrow">Verified source</p>
      </TypeRow>

      <p style={{ font: '400 15px/1.6 var(--ds-font-ui)', color: 'var(--ds-ink-2)', marginTop: 24, maxWidth: '40ch' }}>
        Plus Jakarta Sans carries presence; Inter Tight carries everything you read.
        Nothing falls below 14px. Hierarchy comes from scale and space, not from
        shrinking text or from weight — weight 300 is not loaded.
      </p>
    </Frame>
  ),
};

/* ------------------------------------------------------- layout & spacing */

export const LayoutAndSpacing = {
  name: 'Layout & Spacing',
  render: () => (
    <Frame background="canvas">
      <Note>390px screen · 24px outer margin · 342px content</Note>
      <div style={{ background: 'var(--ds-soft)', borderRadius: 'var(--ds-radius-md)', padding: 18, display: 'flex' }}>
        <i style={{ flex: '0 0 24px', background: '#E7D0DA', borderRadius: 4 }} />
        <u style={{ flex: 1, background: 'var(--ds-surface)', borderRadius: 6, minHeight: 96, textDecoration: 'none' }} />
        <i style={{ flex: '0 0 24px', background: '#E7D0DA', borderRadius: 4 }} />
      </div>

      <div style={{ marginTop: 32 }}>
        <Note>8px rhythm — 8 and 16 inside a group, 24–40 between sections</Note>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          {[8, 16, 24, 32, 40, 48].map((n) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <i style={{ display: 'block', height: n, width: 30, background: '#E7D0DA', borderRadius: 4 }} />
              <span style={{ display: 'block', marginTop: 8, font: '400 13px var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Note>Radius — large radii on large surfaces only; small elements stay squarer</Note>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          {[['14', 'controls'], ['20', 'media'], ['28', 'surfaces']].map(([r, use]) => (
            <div key={r} style={{ textAlign: 'center' }}>
              <i style={{ display: 'block', width: 78, height: 78, background: 'var(--ds-soft)', borderRadius: `${r}px`, boxShadow: 'inset 0 0 0 1px var(--ds-line)' }} />
              <span style={{ display: 'block', marginTop: 8, font: '400 13px var(--ds-font-ui)', color: 'var(--ds-ink-2)' }}>{r} · {use}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  ),
};
