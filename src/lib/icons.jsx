/**
 * The icon set, kept deliberately small — only what the four approved screens
 * need. 24px box, 1.6 stroke, round caps, currentColor. Matches the stylescape.
 */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const Svg = ({ size = 24, children, ...rest }) => (
  <svg {...base} width={size} height={size} {...rest}>{children}</svg>
);

export const IconBack = (p) => <Svg {...p}><path d="M15 5 8 12l7 7" /></Svg>;
export const IconClose = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const IconSearch = (p) => (
  <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></Svg>
);
export const IconBarcode = (p) => (
  <Svg {...p}>
    <path d="M3 7V5.5A1.5 1.5 0 0 1 4.5 4H6M18 4h1.5A1.5 1.5 0 0 1 21 5.5V7M21 17v1.5a1.5 1.5 0 0 1-1.5 1.5H18M6 20H4.5A1.5 1.5 0 0 1 3 18.5V17" />
    <path d="M7 8.5v7M10.5 8.5v7M14 8.5v7M17 8.5v7" />
  </Svg>
);
export const IconFilter = (p) => (
  <Svg {...p}>
    <path d="M4 7h11M19 7h1M4 17h5M13 17h7M4 12h3M11 12h9" />
    <circle cx="17" cy="7" r="2" /><circle cx="11" cy="17" r="2" /><circle cx="9" cy="12" r="2" />
  </Svg>
);
export const IconPlus = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const IconMinus = (p) => <Svg {...p}><path d="M5 12h14" /></Svg>;
export const IconCheck = (p) => <Svg {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>;
export const IconChevronRight = (p) => <Svg {...p}><path d="m9 5 7 7-7 7" /></Svg>;
export const IconAlert = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 8v4.5M12 16h.01" /></Svg>
);
export const IconOffline = (p) => (
  <Svg {...p}>
    <path d="M3 3l18 18" /><path d="M5 12.5a10 10 0 0 1 3.2-2.1M19 12.5a10 10 0 0 0-6.6-2.4" />
    <path d="M8.5 16a5.5 5.5 0 0 1 6-.6" /><path d="M12 19.5h.01" />
  </Svg>
);
export const IconCalculate = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="3.5" width="15" height="17" rx="3" />
    <path d="M8 8h8M8 12h2M8 16h2M14 12h2M14 16h2" />
  </Svg>
);
export const IconRecipes = (p) => (
  <Svg {...p}>
    <path d="M4 20.5V4a8 8 0 0 1 8 8 8 8 0 0 1-8 8.5Z" />
    <path d="M17 3.5v17M20 3.5v5a3 3 0 0 1-3 3" />
  </Svg>
);
