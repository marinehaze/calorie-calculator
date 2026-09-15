import './HeroCalories.css';

/**
 * HeroCalories — one number, given the most space on the surface.
 *
 *  lg (76px)  Nutrition Result
 *  md (56px)  Recipe Detail, per serving
 *  sm (40px)  inside a sheet, where the hero is context rather than the answer
 *
 * The value and its unit are one announcement ("512 kcal"), not two, so a
 * screen reader never reads a bare number.
 */
export const HeroCalories = ({
  value,
  unit = 'kcal',
  size = 'lg',
  pending = false,
  unavailableLabel = 'Calories not available',
}) => {
  if (value === null || value === undefined) {
    return <p className="ds-hero-calories__unavailable">{unavailableLabel}</p>;
  }
  return (
    <p
      className={['ds-hero-calories', `ds-hero-calories--${size}`, pending && 'ds-hero-calories--pending']
        .filter(Boolean).join(' ')}
    >
      {/* One announcement, not two. aria-label is not permitted on a
          paragraph, so the spoken form is a visually hidden span and the two
          visible spans are hidden from assistive technology instead. */}
      <span className="ds-sr-only">{value} {unit}</span>
      <span className="ds-hero-calories__value" aria-hidden="true">{value}</span>
      <span className="ds-hero-calories__unit" aria-hidden="true">{unit}</span>
    </p>
  );
};
