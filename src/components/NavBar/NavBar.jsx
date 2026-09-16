import './NavBar.css';
import { IconButton } from '../IconButton/IconButton';
import { IconBack } from '../../lib/icons';

/**
 * NavBar — two jobs, one bar.
 *
 * On a drill-down it carries the back control: Recipe Detail and Nutrition
 * Result both open from a list, and neither shows the tab bar. The title is
 * optional because on Nutrition Result the dish name is already the largest
 * thing on the screen; repeating it in a bar would compete with the hero.
 *
 * On Recipe Discovery it is a plain header instead — title and filter action,
 * no back control — above a root screen that still shows the tab bar.
 */
export const NavBar = ({ onBack, title, trailing, backLabel = 'Back' }) => (
  <div className="ds-nav-bar">
    {onBack && <IconButton icon={<IconBack />} label={backLabel} onClick={onBack} />}
    {title && <h1 className="ds-nav-bar__title">{title}</h1>}
    {!title && <span style={{ flex: 1 }} />}
    {trailing && <span className="ds-nav-bar__trailing">{trailing}</span>}
  </div>
);
