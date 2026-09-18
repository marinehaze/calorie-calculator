import { useState } from 'react';
import './RecipeDiscovery.css';
import {
  NavBar, IconButton, SearchField, FilterChip, FilterChipRow, FilterChipGroup,
  SegmentedControl, RecipeCard, RecipeList, EmptyState, Banner, Button,
  BottomSheet, SkeletonRecipeCards, TabBar, IconFilter,
} from '../../index';
import { Screen } from '../Screen/Screen';
import {
  recipes as allRecipes, filteredRecipes, appliedFilters as defaultApplied,
  filterOptions, bindingConstraint,
} from '../flow2Data';

/**
 * SCREEN 3 — Recipe Discovery.
 *
 * "Let the user search recipes and narrow them to what suits them right now."
 * (SCREENS.md)
 *
 * A root screen: the TabBar stays, and the NavBar is a plain header — title
 * and the filter action, no back control — exactly as DESIGN_SYSTEM.md §3
 * specifies for this screen.
 *
 * The header carries the search field and the applied-filter chips together,
 * outside the scroll. SCREENS.md asks that the user "can always see what
 * 'suitable' currently means"; chips that scroll away stop answering that, and
 * a field you cannot reach is a query you cannot correct.
 *
 * `state` picks the body:
 *   browse     the landing state, unfiltered
 *   filtered   the same list with fewer cards and the chips in force
 *   loading    skeleton cards
 *   empty      no matching recipes — names the one binding constraint
 *   offline    shared banner over the last good list
 *   error      shared banner, same behaviour
 */
export const RecipeDiscovery = ({
  state: initialState = 'browse',
  query: initialQuery = '',
  filters: initialFilters = null,
  sheet: initialSheet = false,
  onOpenRecipe,
}) => {
  const [state, setState] = useState(initialState);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters ?? (initialState === 'browse' ? [] : defaultApplied));
  const [sheet, setSheet] = useState(initialSheet);

  const list = state === 'filtered' ? filteredRecipes : allRecipes;

  const cards = (rows) => (
    <RecipeList label="Recipes">
      {rows.map((r) => (
        <RecipeCard
          key={r.id}
          title={r.title}
          minutes={r.minutes}
          servings={r.servings}
          diet={r.diet}
          kcalPerServing={r.kcalPerServing}
          image={r.image}
          focal={r.focal}
          onClick={() => onOpenRecipe?.(r)}
        />
      ))}
    </RecipeList>
  );

  const body = () => {
    switch (state) {
      /* ----------------------------------------------- browse / results ◆
         The landing state and the screen's main layout. An unfiltered list is
         a valid starting point: SCREENS.md dropped "preferences not yet set"
         because with no persistence there is nothing to set up front. */
      case 'browse':
      case 'filtered':
      case 'offline':
      case 'error':
        return (
          <>
            <p className="screen-list-head">
              {state === 'filtered'
                ? `${list.length} of ${allRecipes.length} recipes match`
                : `${list.length} recipes`}
            </p>
            {cards(list)}
          </>
        );

      /* ------------------------------------------------------- loading ·
         Skeleton cards in the same boxes the recipes will occupy. */
      case 'loading':
        return (
          <>
            <p className="screen-list-head">Finding recipes…</p>
            <SkeletonRecipeCards cards={2} />
          </>
        );

      /* --------------------------------------------- no matching recipes ◆
         The most important empty state in the app. It names the single filter
         doing the damage and offers to relax that one, rather than suggesting
         the user start again. The berry rule on the insight is the same idiom
         that marks a flagged ingredient. */
      case 'empty':
        return (
          <div className="screen-recovery">
            <EmptyState
              title="No recipes match all four filters"
              body="That is a narrow set — a vegan recipe under 400 calories, without nuts, in under a quarter of an hour."
              constraint={bindingConstraint}
            />
            <div className="screen-recovery__actions">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { setFilters(filters.map((f) => (f === '<15 min' ? '<30 min' : f))); setState('filtered'); }}
              >
                Allow up to 30 minutes
              </Button>
              <Button variant="quiet" fullWidth onClick={() => { setFilters([]); setState('browse'); }}>
                Clear all filters
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Screen
      label="Recipe Discovery"
      header={
        <>
          {/* A plain header on a root screen: title and the filter action, no
              back control. The tab bar below is what navigates. */}
          <NavBar
            title="Recipes"
            trailing={<IconButton icon={<IconFilter />} label="Filter recipes" onClick={() => setSheet(true)} />}
          />

          <div className="rd-search">
            <SearchField
              value={query}
              onChange={setQuery}
              onClear={() => setQuery('')}
              placeholder="Search recipes"
              label="Search recipes"
              loading={state === 'loading'}
            />
          </div>

          {filters.length > 0 && (
            <div className="rd-filters">
              <FilterChipRow label="Filters in force">
                {filters.map((f) => (
                  <FilterChip
                    key={f}
                    mode="remove"
                    onClick={() => {
                      const next = filters.filter((x) => x !== f);
                      setFilters(next);
                      if (next.length === 0) setState('browse');
                    }}
                  >
                    {f}
                  </FilterChip>
                ))}
              </FilterChipRow>
            </div>
          )}

          {state === 'offline' && (
            <div className="rd-banner">
              <Banner
                tone="offline"
                title="You are offline"
                actionLabel="Retry"
                onAction={() => setState('loading')}
              />
            </div>
          )}
          {state === 'error' && (
            <div className="rd-banner">
              <Banner
                tone="error"
                title="Search did not complete"
                body="Showing your last results."
                actionLabel="Retry"
                onAction={() => setState('loading')}
              />
            </div>
          )}
        </>
      }
      footer={<TabBar value="recipes" onChange={() => {}} />}
      overlay={<FilterSheet open={sheet} onClose={() => setSheet(false)} matchCount={filteredRecipes.length} />}
    >
      {body()}
    </Screen>
  );
};

/**
 * The filter sheet — a sheet, not a screen, but the surface that carries the
 * entire meaning of "suitable for me" and the one that replaced a dedicated
 * preferences screen.
 *
 * Diet and exclusions are toggle chips; the two quantitative constraints are
 * segmented controls, because each is a single choice from a short bounded
 * range rather than a set. The footer action stays put while the body scrolls,
 * so "Show recipes" is never below the fold.
 */
const FilterSheet = ({ open, onClose, matchCount }) => {
  const [diet, setDiet] = useState(['Vegan']);
  const [exclude, setExclude] = useState(['Nuts']);
  const [kcal, setKcal] = useState('400');
  const [time, setTime] = useState('30');

  const toggle = (set) => (v) => set((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  return (
    <BottomSheet
      contained
      open={open}
      onClose={onClose}
      title="Suitable for me"
      footer={
        <>
          <Button fullWidth onClick={onClose}>Show {matchCount} recipes</Button>
          <Button variant="quiet" fullWidth onClick={() => { setDiet([]); setExclude([]); setKcal('any'); setTime('any'); }}>
            Clear all
          </Button>
        </>
      }
    >
      <div className="rd-sheet">
        <div className="rd-sheet__group">
          <p className="screen-list-head">Diet</p>
          <FilterChipGroup label="Diet">
            {filterOptions.diet.map((v) => (
              <FilterChip key={v} selected={diet.includes(v)} onClick={() => toggle(setDiet)(v)}>{v}</FilterChip>
            ))}
          </FilterChipGroup>
        </div>

        <div className="rd-sheet__group">
          <p className="screen-list-head">Exclude</p>
          <FilterChipGroup label="Exclude">
            {filterOptions.exclude.map((v) => (
              <FilterChip key={v} selected={exclude.includes(v)} onClick={() => toggle(setExclude)(v)}>{v}</FilterChip>
            ))}
          </FilterChipGroup>
        </div>

        <div className="rd-sheet__group">
          <p className="screen-list-head">Calories per serving</p>
          <SegmentedControl label="Calories per serving" value={kcal} onChange={setKcal} options={filterOptions.kcal} />
        </div>

        <div className="rd-sheet__group">
          <p className="screen-list-head">Time</p>
          <SegmentedControl label="Time" value={time} onChange={setTime} options={filterOptions.time} />
        </div>
      </div>
    </BottomSheet>
  );
};
