import { FoodImage } from './FoodImage';
import { HeroCalories } from '../HeroCalories/HeroCalories';
import { Frame, Stack, Note } from '../../lib/Frame';
import { img } from '../../lib/sampleData';

export default {
  title: 'Food & Recipe/Food Image',
  component: FoodImage,
  argTypes: {
    crop: { control: 'inline-radio', options: ['portrait', 'square', 'landscape', 'circle', 'thumb'] },
    focalX: { control: { type: 'range', min: 0, max: 100 } },
    focalY: { control: { type: 'range', min: 0, max: 100 } },
    scale: { control: { type: 'range', min: 1, max: 1.6, step: 0.02 } },
  },
};

/** The four crops. Every photograph in the product goes through this
 *  component, so a crop is chosen from this set rather than invented. */
export const Crops = {
  render: () => (
    <Frame>
      <Stack gap={24}>
        <div><Note>portrait 4:5 — product and recipe hero</Note>
          <FoodImage src={img('lentil-squash-bowl')} crop="portrait" focalX={58} focalY={52} scale={1.12} alt="Roasted squash and lentil bowl" />
        </div>
        <div><Note>landscape 3:2 — recipe card and detail header</Note>
          <FoodImage src={img('squash-couscous-bowl')} crop="landscape" focalX={44} focalY={60} scale={1.12} alt="Squash and couscous bowl" />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}><Note>square 1:1</Note>
            <FoodImage src={img('lentil-stew')} crop="square" focalX={60} focalY={56} />
          </div>
          <div style={{ flex: 1 }}><Note>circle — the bleed crop</Note>
            <FoodImage src={img('chickpea-bowl')} crop="circle" focalX={58} focalY={59} scale={1.2} />
          </div>
        </div>
        <div style={{ width: 56 }}><Note>thumb — result rows</Note>
          <FoodImage src={img('dry-red-lentils')} crop="thumb" />
        </div>
      </Stack>
    </Frame>
  ),
};

/** The point of the API. The same photograph, same crop, three focal points —
 *  because food is almost never centred in its own frame. Because
 *  transform-origin tracks object-position, scaling pushes *into* the focal
 *  point instead of drifting away from it. */
export const FocalPoint = {
  render: () => (
    <Frame>
      <Note>One photograph, one crop, three focal points</Note>
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { focalX: 50, focalY: 50, scale: 1, note: 'default' },
          { focalX: 66, focalY: 62, scale: 1.34, note: '66 / 62 · 1.34' },
          { focalX: 30, focalY: 40, scale: 1.2, note: '30 / 40 · 1.20' },
        ].map((c) => (
          <div key={c.note} style={{ flex: 1 }}>
            <FoodImage src={img('citrus-grain-bowl')} crop="square" {...c} />
            <p style={{ font: '400 14px var(--ds-font-ui)', color: 'var(--ds-ink-2)', marginTop: 8 }}>{c.note}</p>
          </div>
        ))}
      </div>
    </Frame>
  ),
};

/** The brand signature: an asymmetric crop entering from one edge, with type
 *  and figures holding the open side. Data never sits on food. */
export const BleedSignature = {
  render: () => (
    <Frame>
      {/* ds-bleed-stage restores the full screen width as the positioning
          context, and ds-bleed-stage__type caps the column so the figure and
          its unit stop short of the crop. */}
      <div className="ds-bleed-stage" style={{ minHeight: 244 }}>
        <FoodImage
          src={img('squash-couscous-bowl')}
          crop="circle"
          bleed="right"
          size="var(--ds-bleed-size)"
          focalX={44} focalY={60} scale={1.12}
          style={{ top: 8 }}
        />
        <div className="ds-bleed-stage__type">
          <p style={{
            font: `600 27px/1.14 var(--ds-font-display)`,
            letterSpacing: '-0.028em', margin: 0,
          }}>Roast squash<br />&amp; couscous</p>
          <div style={{ marginTop: 28 }}><HeroCalories value={474} /></div>
        </div>
      </div>
    </Frame>
  ),
};

export const Playground = {
  args: { src: img('lentil-vegetable-soup'), crop: 'square', focalX: 52, focalY: 54, scale: 1.08 },
  render: (args) => <Frame><div style={{ width: 240 }}><FoodImage {...args} /></div></Frame>,
};
