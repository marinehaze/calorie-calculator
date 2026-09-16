import './TabBar.css';
import { IconCalculate, IconRecipes } from '../../lib/icons';

const ICONS = { calculate: IconCalculate, recipes: IconRecipes };

/**
 * TabBar — Calculate and Recipes. Two tabs is the whole root navigation model;
 * SCREENS.md rules out a home screen because it would be a menu of two items
 * the tab bar already provides.
 *
 * Root screens only: Food Search and Recipe Discovery. Nutrition Result and
 * Recipe Detail are drill-downs and carry a back control instead — a tab bar
 * there would offer a lateral move out of a task in progress.
 */
export const TabBar = ({ value = 'calculate', onChange }) => (
  <nav className="ds-tab-bar" aria-label="Main">
    {[
      { value: 'calculate', label: 'Calculate' },
      { value: 'recipes', label: 'Recipes' },
    ].map((tab) => {
      const Icon = ICONS[tab.value];
      const current = tab.value === value;
      return (
        <button
          key={tab.value}
          type="button"
          className="ds-tab-bar__tab"
          aria-current={current ? 'page' : undefined}
          onClick={() => onChange?.(tab.value)}
        >
          <Icon size={24} />
          {tab.label}
        </button>
      );
    })}
  </nav>
);
