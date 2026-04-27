import React from 'react';
import styles from './ProgressCircle.module.css';

const SIZE_MAP = {
  xxs: { box: 64, stroke: 6, valueFont: 11, labelFont: 10, gap: 0 },
  xs: { box: 160, stroke: 12, valueFont: 24, labelFont: 14, gap: 4 },
  sm: { box: 200, stroke: 14, valueFont: 30, labelFont: 14, gap: 6 },
  md: { box: 240, stroke: 16, valueFont: 36, labelFont: 14, gap: 6 },
  lg: { box: 280, stroke: 20, valueFont: 48, labelFont: 16, gap: 8 },
};

export function ProgressCircle({
  value = 40,
  size = 'md',
  shape = 'circle',
  label = 'Active users',
  showLabel = true,
}) {
  const dims = SIZE_MAP[size];
  const pct = Math.max(0, Math.min(100, value));
  const { box, stroke, valueFont, labelFont, gap } = dims;
  const r = (box - stroke) / 2;
  const cx = box / 2;
  const cy = box / 2;
  const isHalf = shape === 'half-circle';

  // Half-circle: viewBox crops to top half
  const viewHeight = isHalf ? box / 2 + stroke / 2 : box;

  const fullCircumference = 2 * Math.PI * r;
  const halfCircumference = Math.PI * r;
  const arcLength = isHalf ? halfCircumference : fullCircumference;
  const filled = arcLength * (pct / 100);
  const trackLength = isHalf ? halfCircumference : fullCircumference;

  // Rotation:
  //  - Circle: start at top (12 o'clock) → rotate -90deg
  //  - Half-circle: start at left (9 o'clock) → rotate 180deg, draw upper half
  const rotate = isHalf ? 180 : -90;

  const isXxs = size === 'xxs';

  return (
    <div
      className={styles.wrapper}
      style={{ width: box, gap }}
    >
      <div
        className={styles.svgWrap}
        style={{ width: box, height: viewHeight }}
      >
        <svg
          width={box}
          height={viewHeight}
          viewBox={`0 0 ${box} ${viewHeight}`}
          className={styles.svg}
        >
          {isHalf ? (
            <>
              <path
                d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${box - stroke / 2} ${cy}`}
                fill="none"
                stroke="var(--colors-grayNeutral-100, #f3f4f6)"
                strokeWidth={stroke}
                strokeLinecap="round"
              />
              <path
                d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${box - stroke / 2} ${cy}`}
                fill="none"
                stroke="var(--colors-brand-500, #7700ff)"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${filled} ${trackLength - filled}`}
              />
            </>
          ) : (
            <>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--colors-grayNeutral-100, #f3f4f6)"
                strokeWidth={stroke}
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--colors-brand-500, #7700ff)"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${filled} ${trackLength - filled}`}
                transform={`rotate(${rotate} ${cx} ${cy})`}
              />
            </>
          )}
        </svg>

        {/* Centered text overlay */}
        <div
          className={[
            styles.center,
            isHalf ? styles.centerHalf : styles.centerCircle,
          ].join(' ')}
        >
          {isXxs ? (
            <>
              <span className={styles.value} style={{ fontSize: valueFont, lineHeight: 1.2 }}>{pct}%</span>
              {showLabel && (
                <span className={styles.label} style={{ fontSize: labelFont, lineHeight: 1.2 }}>{label}</span>
              )}
            </>
          ) : (
            <>
              {showLabel && (
                <span className={styles.label} style={{ fontSize: labelFont, lineHeight: 1.4 }}>{label}</span>
              )}
              <span className={styles.value} style={{ fontSize: valueFont, lineHeight: 1.2 }}>{pct}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
