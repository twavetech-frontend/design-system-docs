import React from 'react';
import styles from './LoadingIndicator.module.css';

const SIZE_MAP = {
  sm: { circle: 32, stroke: 3, dot: 3, font: 12, gap: 12 },
  md: { circle: 48, stroke: 4, dot: 4, font: 14, gap: 16 },
  lg: { circle: 64, stroke: 5, dot: 5, font: 16, gap: 18 },
  xl: { circle: 80, stroke: 6, dot: 6, font: 18, gap: 20 },
};

/* Style 1: Line simple — gray track + small purple arc */
function LineSimpleSpinner({ size }) {
  const { circle, stroke } = SIZE_MAP[size];
  const r = (circle - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * 0.25; // 25% arc

  return (
    <svg
      className={`${styles.spinner} ${styles.spinnerRotate}`}
      width={circle}
      height={circle}
      viewBox={`0 0 ${circle} ${circle}`}
    >
      <circle
        cx={circle / 2}
        cy={circle / 2}
        r={r}
        fill="none"
        stroke="var(--colors-grayNeutral-200, #e6e8ea)"
        strokeWidth={stroke}
      />
      <circle
        cx={circle / 2}
        cy={circle / 2}
        r={r}
        fill="none"
        stroke="var(--colors-brand-500, #7700ff)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${circle / 2} ${circle / 2})`}
      />
    </svg>
  );
}

/* Style 2: Line spinner — purple arc only (no track), with gradient tail */
function LineSpinnerSpinner({ size }) {
  const { circle, stroke } = SIZE_MAP[size];
  const r = (circle - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * 0.5; // 50% arc
  const gradId = `lineSpinnerGrad-${size}`;

  return (
    <svg
      className={`${styles.spinner} ${styles.spinnerRotate}`}
      width={circle}
      height={circle}
      viewBox={`0 0 ${circle} ${circle}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--colors-brand-500, #7700ff)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--colors-brand-500, #7700ff)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle
        cx={circle / 2}
        cy={circle / 2}
        r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${circle / 2} ${circle / 2})`}
      />
    </svg>
  );
}

/* Style 3: Dot circle — 12 dots in ring with opacity gradient */
function DotCircleSpinner({ size }) {
  const { circle, dot } = SIZE_MAP[size];
  const r = circle / 2 - dot;
  const cx = circle / 2;
  const cy = circle / 2;
  const count = 12;

  return (
    <svg
      className={`${styles.spinner} ${styles.dotRotate}`}
      width={circle}
      height={circle}
      viewBox={`0 0 ${circle} ${circle}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        // Opacity: head dot (i=0) is full, decreasing around the ring
        const opacity = 0.15 + (0.85 * (count - i)) / count;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={dot}
            fill="var(--colors-brand-500, #7700ff)"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

const STYLE_MAP = {
  'line-simple': LineSimpleSpinner,
  'line-spinner': LineSpinnerSpinner,
  'dot-circle': DotCircleSpinner,
};

export function LoadingIndicator({
  style = 'line-simple',
  size = 'md',
  supportingText = 'Loading...',
}) {
  const Spinner = STYLE_MAP[style] || LineSimpleSpinner;
  const { font, gap } = SIZE_MAP[size];

  return (
    <div className={styles.root} style={{ gap }}>
      <Spinner size={size} />
      {supportingText && (
        <span className={styles.label} style={{ fontSize: font }}>
          {supportingText}
        </span>
      )}
    </div>
  );
}
