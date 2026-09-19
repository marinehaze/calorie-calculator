/* Design system — public surface. Screens import from here, never from a
   component's own path, so the inventory stays visible in one place. */

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';

export { Button } from './components/Button/Button';
export { IconButton } from './components/IconButton/IconButton';

export { SearchField } from './components/SearchField/SearchField';
export { FilterChip, FilterChipRow, FilterChipGroup } from './components/FilterChip/FilterChip';
export { SegmentedControl } from './components/SegmentedControl/SegmentedControl';
export { TabBar } from './components/TabBar/TabBar';
export { NavBar } from './components/NavBar/NavBar';
export { Stepper } from './components/Stepper/Stepper';
export { InputField } from './components/InputField/InputField';

export { HeroCalories } from './components/HeroCalories/HeroCalories';
export { PortionPair } from './components/PortionPair/PortionPair';
export { MacroGroup } from './components/MacroGroup/MacroGroup';
export { MacroEnergySplit } from './components/MacroEnergySplit/MacroEnergySplit';
export { IngredientRow, IngredientList } from './components/IngredientRow/IngredientRow';
export { NutritionSummary } from './components/NutritionSummary/NutritionSummary';

export { FoodImage } from './components/FoodImage/FoodImage';
export { FoodResultRow, FoodResultList } from './components/FoodResultRow/FoodResultRow';
export { RecipeCard, RecipeList } from './components/RecipeCard/RecipeCard';
export { MethodList, MethodStep } from './components/MethodList/MethodList';

export { EmptyState } from './components/EmptyState/EmptyState';
export { Banner } from './components/Banner/Banner';
export { Skeleton, SkeletonResultList, SkeletonRecipeCards } from './components/Skeleton/Skeleton';
export { BottomSheet } from './components/BottomSheet/BottomSheet';

export * from './lib/icons';
