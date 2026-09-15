import { IconButton } from './IconButton';
import { Frame, Note } from '../../lib/Frame';
import { IconBack, IconBarcode, IconClose, IconFilter } from '../../lib/icons';

export default {
  title: 'Actions/Icon Button',
  component: IconButton,
};

/** Every icon button is 44 x 44 even though the glyph is 24px, so the hit area
 *  is larger than the mark. The dashed outline below is the target, drawn for
 *  this story only. */
export const Variants = {
  render: () => (
    <Frame>
      <Note>plain · soft · berry — all 44 x 44</Note>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ outline: '1px dashed var(--ds-line-strong)', borderRadius: 999, display: 'inline-flex' }}>
          <IconButton icon={<IconBack />} label="Back" />
        </span>
        <span style={{ outline: '1px dashed var(--ds-line-strong)', borderRadius: 999, display: 'inline-flex' }}>
          <IconButton icon={<IconBarcode />} label="Scan a barcode" variant="soft" />
        </span>
        <span style={{ outline: '1px dashed var(--ds-line-strong)', borderRadius: 999, display: 'inline-flex' }}>
          <IconButton icon={<IconFilter />} label="Filters" variant="berry" />
        </span>
        <span style={{ outline: '1px dashed var(--ds-line-strong)', borderRadius: 999, display: 'inline-flex' }}>
          <IconButton icon={<IconClose />} label="Close" disabled />
        </span>
      </div>
    </Frame>
  ),
};
