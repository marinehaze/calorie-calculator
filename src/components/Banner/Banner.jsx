import './Banner.css';
import { IconOffline, IconAlert } from '../../lib/icons';

/**
 * Banner — offline and error, defined once and used on all four screens.
 *
 * Calm on purpose: no red, no alarm icon, no full-width colour block. The
 * product says what happened and offers the one action that helps.
 *
 * `title` is the status and takes its own line; `body` is the explanation
 * beneath it. Keep `body` to a single line at 390px — the split is what makes
 * the status findable, and short copy is what keeps the banner compact.
 *
 * role="alert" for an error that has just occurred; role="status" for the
 * standing offline notice, which should not interrupt.
 */
export const Banner = ({
  tone = 'offline',
  title,
  body,
  actionLabel,
  onAction,
}) => (
  <div className="ds-banner" role={tone === 'error' ? 'alert' : 'status'}>
    <span className="ds-banner__icon">
      {tone === 'offline' ? <IconOffline size={20} /> : <IconAlert size={20} />}
    </span>
    <span className="ds-banner__text">
      <span className="ds-banner__title">{title}</span>
      {body && <span className="ds-banner__body">{body}</span>}
    </span>
    {actionLabel && (
      <button type="button" className="ds-banner__action" onClick={onAction}>{actionLabel}</button>
    )}
  </div>
);
