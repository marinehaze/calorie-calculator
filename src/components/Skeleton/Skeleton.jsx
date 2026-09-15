import './Skeleton.css';

/**
 * Skeleton — the loading primitive, plus the two compositions the four screens
 * need: a search result row and a recipe card.
 *
 * Each skeleton occupies the same box as the content that replaces it, so
 * nothing reflows on arrival. The whole group is announced once as "Loading"
 * rather than each bar announcing itself.
 */
export const Skeleton = ({ width = '100%', height = 16, shape = 'bar', style }) => (
  <span
    className={['ds-skeleton', shape === 'media' && 'ds-skeleton--media', shape === 'circle' && 'ds-skeleton--circle']
      .filter(Boolean).join(' ')}
    style={{ display: 'block', width, height, ...style }}
  />
);

export const SkeletonResultList = ({ rows = 4, label = 'Loading results' }) => (
  <div className="ds-skeleton-list" role="status" aria-label={label}>
    {Array.from({ length: rows }, (_, i) => (
      <div className="ds-skeleton-row" key={i}>
        <Skeleton width={56} height={56} shape="media" />
        <span className="ds-skeleton-row__text">
          <Skeleton width={`${72 - i * 6}%`} height={16} />
          <Skeleton width="44%" height={14} />
        </span>
        <Skeleton width={44} height={22} />
      </div>
    ))}
  </div>
);

export const SkeletonRecipeCards = ({ cards = 2, label = 'Loading recipes' }) => (
  <div className="ds-skeleton-cards" role="status" aria-label={label}>
    {Array.from({ length: cards }, (_, i) => (
      <div className="ds-skeleton-card" key={i}>
        <Skeleton height={228} shape="media" />
        <Skeleton width={i === 0 ? '78%' : '62%'} height={22} />
        <Skeleton width="52%" height={15} />
      </div>
    ))}
  </div>
);
