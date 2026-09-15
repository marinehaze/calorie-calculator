import './EmptyState.css';
import { FoodImage } from '../FoodImage/FoodImage';

/**
 * EmptyState — one pattern for every "there is nothing here" surface the four
 * screens have: first run, no results, no matching recipes, and an
 * unrecoverable error.
 *
 * `constraint` exists for Recipe Discovery's empty list, which SCREENS.md
 * calls the most important empty state in the app: it must name which filter
 * is binding and offer to relax that one specifically, rather than suggesting
 * the user start again.
 *
 * It takes `{ lead, detail }` — the lead names the binding constraint, the
 * detail carries the consequence and previews the outcome of relaxing it. A
 * plain string is accepted as the lead alone.
 *
 * role="status" so the change from a full list to an empty one is announced.
 */
export const EmptyState = ({
  title,
  body,
  constraint,
  actions,
  image,
  focal,
  imageAlt = '',
}) => {
  const insight = typeof constraint === 'string' ? { lead: constraint } : constraint;
  return (
  <div className="ds-empty-state" role="status">
    {image && (
      <div className="ds-empty-state__media">
        <FoodImage
          src={image}
          alt={imageAlt}
          crop="circle"
          focalX={focal?.x}
          focalY={focal?.y}
          scale={focal?.scale ?? 1.2}
        />
      </div>
    )}
    <h2 className="ds-empty-state__title">{title}</h2>
    {body && <p className="ds-empty-state__body">{body}</p>}
    {insight && (
      <p className="ds-empty-state__insight">
        <span className="ds-empty-state__insight-lead">{insight.lead}</span>
        {insight.detail}
      </p>
    )}
    {actions && <div className="ds-empty-state__actions">{actions}</div>}
  </div>
  );
};
