import './FoodImage.css';

/**
 * FoodImage — every photograph in the product goes through this component.
 *
 * Photography supplies most of the colour in this system, and food is almost
 * never centred in its own frame. The stylescape solved that with two inline
 * custom properties (--op / --sc); this component turns them into an API so a
 * focal point travels with the dish instead of being re-tuned at each usage.
 *
 *   focalX / focalY  where the dish actually sits, in %   (-> object-position)
 *   scale            how far to push in on that point      (-> transform)
 *
 * Because transform-origin matches object-position, scaling pushes *into* the
 * focal point rather than drifting away from it.
 */
export const FoodImage = ({
  src,
  alt,
  crop = 'square',
  focalX = 50,
  focalY = 50,
  scale = 1,
  flush = false,
  bleed = false,
  size,
  className = '',
  style,
  ...rest
}) => {
  const classes = [
    'ds-food-image',
    `ds-food-image--${crop}`,
    flush && 'ds-food-image--flush',
    bleed && 'ds-food-image--bleed',
    bleed && `ds-food-image--bleed-${bleed}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        '--ds-op': `${focalX}% ${focalY}%`,
        '--ds-sc': scale,
        ...(size ? { width: size } : null),
        ...style,
      }}
      {...rest}
    >
      {/* alt="" is correct when the dish is named in adjacent text — the
          photograph is then decorative and repeating the name is noise. */}
      <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
    </div>
  );
};
