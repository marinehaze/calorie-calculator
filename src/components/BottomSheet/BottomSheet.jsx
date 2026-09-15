import { useEffect, useRef } from 'react';
import './BottomSheet.css';
import { IconButton } from '../IconButton/IconButton';
import { IconClose } from '../../lib/icons';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * BottomSheet — the portion sheet, the item-swap sheet and the filter sheet
 * are all this component. SCREENS.md defines sheet behaviour once.
 *
 * Behaviour it owns:
 *  - Escape and a scrim tap both close it.
 *  - Focus moves in on open and is trapped until it closes, then returns to
 *    whatever opened the sheet.
 *  - The footer action stays visible while the body scrolls.
 *
 * `contained` scopes the sheet to its parent instead of the viewport, which is
 * how the stories show it inside a 390px frame.
 */
export const BottomSheet = ({
  open,
  onClose,
  title,
  children,
  footer,
  contained = false,
  closeLabel = 'Close',
  labelledBy = 'ds-sheet-title',
}) => {
  const panel = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;

    // Focus the panel itself, not its first control. The first control is
    // Close, and a keyboard user should not have their first action be to
    // dismiss the sheet they just opened. Landing on the panel announces the
    // title, and the next Tab reaches the first real control.
    const node = panel.current;
    node?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose?.(); return; }
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={['ds-sheet-root', contained && 'ds-sheet-root--contained'].filter(Boolean).join(' ')}>
      <button type="button" className="ds-sheet__scrim" aria-label={closeLabel} tabIndex={-1} onClick={onClose} />
      <div className="ds-sheet" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} ref={panel}>
        <span className="ds-sheet__grabber" aria-hidden="true" />
        <div className="ds-sheet__head">
          <h2 className="ds-sheet__title" id={labelledBy}>{title}</h2>
          <span className="ds-sheet__close">
            <IconButton icon={<IconClose />} label={closeLabel} onClick={onClose} />
          </span>
        </div>
        <div className="ds-sheet__body">{children}</div>
        {footer && <div className="ds-sheet__footer">{footer}</div>}
      </div>
    </div>
  );
};
