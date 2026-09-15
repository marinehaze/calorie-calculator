import './NavBar.css';
import { IconButton } from '../IconButton/IconButton';
import { IconBack } from '../../lib/icons';

/**
 * NavBar — back, and a title when the screen needs one.
 *
 * Recipe Detail and Nutrition Result open from a list, so both carry a back
 * control. The title is optional because on Nutrition Result the dish name is
 * already the largest thing on the screen; repeating it in a bar would compete
 * with the hero.
 */
export const NavBar = ({ onBack, title, trailing, backLabel = 'Back' }) => (
  <div className="ds-nav-bar">
    {onBack && <IconButton icon={<IconBack />} label={backLabel} onClick={onBack} />}
    {title && <h1 className="ds-nav-bar__title">{title}</h1>}
    {!title && <span style={{ flex: 1 }} />}
    {trailing && <span className="ds-nav-bar__trailing">{trailing}</span>}
  </div>
);
