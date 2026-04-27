import styles from './Chart.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* ─────────────────────────── helpers ─────────────────────────── */

function smoothPath(points) {
  if (points.length < 2) return '';
  const d = [`M ${points[0][0]} ${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[Math.max(0, i - 1)];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[Math.min(points.length - 1, i + 2)];
    const t = 0.18;
    const cp1x = x1 + (x2 - x0) * t;
    const cp1y = y1 + (y2 - y0) * t;
    const cp2x = x2 - (x3 - x1) * t;
    const cp2y = y2 - (y3 - y1) * t;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`);
  }
  return d.join(' ');
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const startRad = ((startDeg - 90) * Math.PI) / 180;
  const endRad = ((endDeg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/* ─────────────────────────── Legend ─────────────────────────── */

const LEGEND_DEFAULTS = [
  { name: 'Series 1', color: 'var(--series-1)' },
  { name: 'Series 2', color: 'var(--series-2)' },
  { name: 'Series 3', color: 'var(--series-3)' },
];

export function ChartLegend({ items = LEGEND_DEFAULTS, variant = 'dot' }) {
  return (
    <div className={styles.legendRow}>
      {items.map((it, i) => (
        <div key={i} className={styles.legendItem}>
          <span
            className={variant === 'bar' ? styles.legendVerticalBar : styles.legendDot}
            style={{ background: it.color }}
          />
          <span>{it.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── LineChart ─────────────────────────── */

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_LINE_DATA = [
  [620, 640, 600, 660, 680, 660, 720, 750, 770, 760, 800, 820],
  [380, 400, 420, 410, 430, 440, 460, 480, 500, 510, 520, 530],
  [120, 150, 220, 260, 290, 300, 220, 380, 350, 400, 450, 480],
];

export function LineChart({
  data = DEFAULT_LINE_DATA,
  labels = MONTH_LABELS,
  axisLabels = false,
  legend = false,
  yLabel = 'Active users',
  xLabel = 'Month',
  yMax = 1000,
  yStep = 200,
  filled = false,
  height = 240,
}) {
  const W = 1100;
  const H = height;
  const padTop = 16;
  const padBottom = axisLabels ? 56 : 28;
  const padLeft = axisLabels ? 64 : 16;
  const padRight = 24;
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;
  const yTicks = [];
  for (let v = yMax; v >= 0; v -= yStep) yTicks.push(v);

  const toPoint = (v, i) => [
    padLeft + (innerW * i) / (labels.length - 1),
    padTop + innerH - (innerH * v) / yMax,
  ];

  const seriesColors = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)'];

  return (
    <div className={cx(styles.chart, styles.lineBarChart)}>
      {legend && (
        <div className={styles.chartHeader}>
          <ChartLegend />
        </div>
      )}
      <div className={styles.chartArea}>
        <svg className={styles.lineBarSvg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {axisLabels && (
            <text
              className={styles.axisLabel}
              x={20}
              y={padTop + innerH / 2}
              textAnchor="middle"
              transform={`rotate(-90 20 ${padTop + innerH / 2})`}
            >
              {yLabel}
            </text>
          )}
          {yTicks.map((v, i) => {
            const y = padTop + (innerH * i) / (yTicks.length - 1);
            return (
              <g key={v}>
                {axisLabels && (
                  <text className={styles.axisText} x={padLeft - 10} y={y + 4} textAnchor="end">
                    {v.toLocaleString()}
                  </text>
                )}
                <line className={styles.gridLine} x1={padLeft} x2={W - padRight} y1={y} y2={y} />
              </g>
            );
          })}
          {data.map((series, sIdx) => {
            const points = series.map((v, i) => toPoint(v, i));
            return (
              <g key={sIdx}>
                {filled && (
                  <path
                    className={styles.lineFill}
                    style={{ fill: seriesColors[sIdx % seriesColors.length] }}
                    d={`${smoothPath(points)} L ${padLeft + innerW} ${padTop + innerH} L ${padLeft} ${padTop + innerH} Z`}
                  />
                )}
                <path
                  className={styles.linePath}
                  style={{ stroke: seriesColors[sIdx % seriesColors.length] }}
                  d={smoothPath(points)}
                />
              </g>
            );
          })}
          {labels.map((lbl, i) => {
            const x = padLeft + (innerW * i) / (labels.length - 1);
            return (
              <text key={lbl} className={styles.axisText} x={x} y={H - (axisLabels ? 28 : 8)} textAnchor="middle">
                {lbl}
              </text>
            );
          })}
          {axisLabels && (
            <text className={styles.axisLabel} x={padLeft + innerW / 2} y={H - 6} textAnchor="middle">
              {xLabel}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────── BarChart ─────────────────────────── */

const DEFAULT_BAR_DATA = [
  [200, 280, 200, 240, 200, 280, 240, 250, 240, 280, 290, 200],
  [180, 200, 100, 180, 100, 220, 200, 200, 180, 200, 220, 200],
  [180, 200, 120, 180, 120, 220, 220, 240, 240, 240, 220, 140],
];

export function BarChart({
  data = DEFAULT_BAR_DATA,
  labels = MONTH_LABELS,
  axisLabels = false,
  legend = false,
  yLabel = 'Active users',
  xLabel = 'Month',
  yMax = 1000,
  yStep = 200,
  height = 240,
}) {
  const W = 1100;
  const H = height;
  const padTop = 16;
  const padBottom = axisLabels ? 56 : 28;
  const padLeft = axisLabels ? 64 : 16;
  const padRight = 24;
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;
  const yTicks = [];
  for (let v = yMax; v >= 0; v -= yStep) yTicks.push(v);

  const colCount = labels.length;
  const slot = innerW / colCount;
  const barWidth = Math.min(32, slot * 0.45);

  return (
    <div className={cx(styles.chart, styles.lineBarChart)}>
      {legend && (
        <div className={styles.chartHeader}>
          <ChartLegend variant="bar" />
        </div>
      )}
      <div className={styles.chartArea}>
        <svg className={styles.lineBarSvg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {axisLabels && (
            <text
              className={styles.axisLabel}
              x={20}
              y={padTop + innerH / 2}
              textAnchor="middle"
              transform={`rotate(-90 20 ${padTop + innerH / 2})`}
            >
              {yLabel}
            </text>
          )}
          {yTicks.map((v, i) => {
            const y = padTop + (innerH * i) / (yTicks.length - 1);
            return (
              <g key={v}>
                {axisLabels && (
                  <text className={styles.axisText} x={padLeft - 10} y={y + 4} textAnchor="end">
                    {v.toLocaleString()}
                  </text>
                )}
                <line className={styles.gridLine} x1={padLeft} x2={W - padRight} y1={y} y2={y} />
              </g>
            );
          })}
          {labels.map((_, i) => {
            const cx0 = padLeft + slot * (i + 0.5);
            let cursor = padTop + innerH;
            const segs = data.map((series, sIdx) => {
              const v = series[i];
              const segH = (innerH * v) / yMax;
              cursor -= segH;
              const y = cursor;
              const fillVar =
                sIdx === 0
                  ? 'var(--series-3)'
                  : sIdx === 1
                  ? 'var(--series-2)'
                  : 'var(--series-1)';
              const isTop = sIdx === data.length - 1;
              const isBottom = sIdx === 0;
              return (
                <rect
                  key={sIdx}
                  x={cx0 - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={segH}
                  rx={isTop ? 4 : 0}
                  ry={isTop ? 4 : 0}
                  style={{
                    fill: fillVar,
                    ...(isBottom ? { transform: `translateY(0)` } : null),
                  }}
                />
              );
            });
            return <g key={i}>{segs}</g>;
          })}
          {labels.map((lbl, i) => {
            const x = padLeft + slot * (i + 0.5);
            return (
              <text key={lbl} className={styles.axisText} x={x} y={H - (axisLabels ? 28 : 8)} textAnchor="middle">
                {lbl}
              </text>
            );
          })}
          {axisLabels && (
            <text className={styles.axisLabel} x={padLeft + innerW / 2} y={H - 6} textAnchor="middle">
              {xLabel}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────── ActivityGauge ─────────────────────────── */

const GAUGE_SIZES = {
  xs: { px: 160, ringGap: 14, stroke: 12, label: 12, value: 22 },
  sm: { px: 200, ringGap: 18, stroke: 14, label: 13, value: 26 },
  md: { px: 240, ringGap: 20, stroke: 16, label: 14, value: 30 },
  lg: { px: 280, ringGap: 22, stroke: 18, label: 14, value: 36 },
};

export function ActivityGauge({
  size = 'md',
  values = [0.85, 0.66, 0.42],
  label = 'Active users',
  value = '1,000',
  legend = false,
  legendPosition = 'bottom',
}) {
  const cfg = GAUGE_SIZES[size] || GAUGE_SIZES.md;
  const px = cfg.px;
  const stroke = cfg.stroke;
  const ringColors = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)'];

  const rings = values.map((v, i) => {
    const r = (px - stroke) / 2 - i * cfg.ringGap;
    const C = 2 * Math.PI * r;
    return { r, C, dash: C * v, gap: C * (1 - v), color: ringColors[i] };
  });

  const gauge = (
    <div className={styles.gaugeWrap} style={{ width: px, height: px }}>
      <svg className={styles.gaugeSvg} width={px} height={px} viewBox={`0 0 ${px} ${px}`}>
        <g transform={`rotate(-90 ${px / 2} ${px / 2})`}>
          {rings.map((ring, i) => (
            <g key={i}>
              <circle cx={px / 2} cy={px / 2} r={ring.r} className={styles.gaugeTrack} strokeWidth={stroke} />
              <circle
                cx={px / 2}
                cy={px / 2}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${ring.dash} ${ring.gap}`}
              />
            </g>
          ))}
        </g>
      </svg>
      <div className={styles.gaugeCenter}>
        <span className={styles.gaugeCenterLabel} style={{ fontSize: cfg.label }}>
          {label}
        </span>
        <span className={styles.gaugeCenterValue} style={{ fontSize: cfg.value }}>
          {value}
        </span>
      </div>
    </div>
  );

  if (!legend) {
    return <div className={cx(styles.chart, styles.gauge)}>{gauge}</div>;
  }

  const legendItems = [
    { name: 'Series 1', color: 'var(--series-1)' },
    { name: 'Series 2', color: 'var(--series-2)' },
    { name: 'Series 3', color: 'var(--series-3)' },
  ];

  return (
    <div
      className={cx(styles.chart, styles.gauge, legendPosition === 'right' ? styles.gaugeRow : null)}
    >
      {gauge}
      <ChartLegend items={legendItems} />
    </div>
  );
}

/* ─────────────────────────── PieChart ─────────────────────────── */

const PIE_SIZES = { xxs: 120, xs: 160, sm: 200, md: 240, lg: 280 };

const DEFAULT_PIE_DATA = [
  { name: 'Series 1', value: 30 },
  { name: 'Series 2', value: 20 },
  { name: 'Series 3', value: 15 },
  { name: 'Series 4', value: 12 },
  { name: 'Series 5', value: 13 },
  { name: 'Series 6', value: 10 },
];

const PIE_COLORS = [
  'var(--series-2)',
  'var(--series-1)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
];

export function PieChart({
  size = 'md',
  hole = '50%',
  data = DEFAULT_PIE_DATA,
  legend = false,
}) {
  const px = PIE_SIZES[size] || PIE_SIZES.md;
  const r = px / 2;
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const holeFrac =
    typeof hole === 'string' ? parseFloat(hole) / 100 : typeof hole === 'number' ? hole : 0;
  const innerR = r * holeFrac;

  const segments = data.map((d, i) => {
    const start = (acc / total) * 360;
    acc += d.value;
    const end = (acc / total) * 360;
    const startA = ((start - 90) * Math.PI) / 180;
    const endA = ((end - 90) * Math.PI) / 180;
    const large = end - start > 180 ? 1 : 0;
    const x1 = r + r * Math.cos(startA);
    const y1 = r + r * Math.sin(startA);
    const x2 = r + r * Math.cos(endA);
    const y2 = r + r * Math.sin(endA);
    let path;
    if (innerR > 0) {
      const xi1 = r + innerR * Math.cos(endA);
      const yi1 = r + innerR * Math.sin(endA);
      const xi2 = r + innerR * Math.cos(startA);
      const yi2 = r + innerR * Math.sin(startA);
      path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${innerR} ${innerR} 0 ${large} 0 ${xi2} ${yi2} Z`;
    } else {
      path = `M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    }
    return { path, color: PIE_COLORS[i % PIE_COLORS.length], name: d.name };
  });

  const pie = (
    <svg className={styles.pieSvg} width={px} height={px} viewBox={`0 0 ${px} ${px}`}>
      {segments.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} />
      ))}
    </svg>
  );

  if (!legend) {
    return <div className={cx(styles.chart, styles.pie)}>{pie}</div>;
  }

  return (
    <div className={cx(styles.chart, styles.pie)}>
      {pie}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.map((d, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.legendVerticalBar} style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── RadarChart ─────────────────────────── */

const DEFAULT_RADAR_DATA = [
  { name: 'Series 1', color: 'var(--series-2)', values: [600, 700, 500, 400, 600, 800, 500] },
  { name: 'Series 2', color: 'var(--series-pink)', values: [800, 600, 200, 700, 300, 400, 1000] },
  { name: 'Series 3', color: 'var(--series-blue)', values: [400, 800, 700, 900, 500, 700, 600] },
];

const RADAR_AXIS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function RadarChart({
  data = DEFAULT_RADAR_DATA,
  axes = RADAR_AXIS,
  rings = [200, 400, 600, 800, 1000],
  legend = 'right',
}) {
  const W = 392;
  const H = 372;
  const cx0 = W / 2;
  const cy0 = H / 2 + 8;
  const maxR = 150;
  const max = rings[rings.length - 1];
  const angleFor = (i) => ((i / axes.length) * 360 - 90) * (Math.PI / 180);

  const ringPaths = rings.map((v) => {
    const rad = (v / max) * maxR;
    const pts = axes.map((_, i) => {
      const a = angleFor(i);
      return [cx0 + Math.cos(a) * rad, cy0 + Math.sin(a) * rad];
    });
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';
  });

  const seriesPaths = data.map((s) => {
    const pts = s.values.map((v, i) => {
      const a = angleFor(i);
      const rad = (v / max) * maxR;
      return [cx0 + Math.cos(a) * rad, cy0 + Math.sin(a) * rad];
    });
    const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';
    return { d, color: s.color };
  });

  const labelPositions = axes.map((lbl, i) => {
    const a = angleFor(i);
    const rad = maxR + 24;
    return { lbl, x: cx0 + Math.cos(a) * rad, y: cy0 + Math.sin(a) * rad };
  });

  const radar = (
    <svg className={styles.radarSvg} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {axes.map((_, i) => {
        const a = angleFor(i);
        const x = cx0 + Math.cos(a) * maxR;
        const y = cy0 + Math.sin(a) * maxR;
        return <line key={i} className={styles.radarRay} x1={cx0} y1={cy0} x2={x} y2={y} />;
      })}
      {ringPaths.map((d, i) => (
        <path key={i} className={styles.radarGrid} d={d} />
      ))}
      {seriesPaths.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} stroke={s.color} className={styles.radarSeries} />
      ))}
      {rings.map((v, i) => {
        const rad = (v / max) * maxR;
        const yPos = cy0 - rad;
        return (
          <g key={v}>
            <rect
              className={styles.radarValueBadge}
              x={cx0 - 22}
              y={yPos - 9}
              width={44}
              height={18}
              rx={9}
            />
            <text className={styles.radarValueText} x={cx0} y={yPos + 4} textAnchor="middle">
              {v.toLocaleString()}
            </text>
          </g>
        );
      })}
      {labelPositions.map((p) => (
        <text key={p.lbl} className={styles.radarLabel} x={p.x} y={p.y + 5} textAnchor="middle">
          {p.lbl}
        </text>
      ))}
    </svg>
  );

  if (legend === false || legend === 'none') {
    return <div className={cx(styles.chart, styles.radar)}>{radar}</div>;
  }

  const legendItems = data.map((s) => ({ name: s.name, color: s.color }));

  return (
    <div className={cx(styles.chart, styles.radar, legend === 'bottom' ? styles.radarColumn : null)}>
      {radar}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {legendItems.map((it, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.legendVerticalBar} style={{ background: it.color }} />
            <span>{it.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── ChartMarker ─────────────────────────── */

export function ChartMarker({ type = 'line' }) {
  const W = 12;
  const H = 200;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={styles.markerSvg}>
      {type === 'line' && (
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="var(--series-2)" strokeWidth={2} />
      )}
      {type === 'dash' && (
        <line
          x1={W / 2}
          y1={0}
          x2={W / 2}
          y2={H}
          stroke="var(--series-2)"
          strokeWidth={2}
          strokeDasharray="6 6"
        />
      )}
      {type === 'minimal' && (
        <>
          <circle cx={W / 2} cy={6} r={4} fill="var(--series-2)" />
          <line
            x1={W / 2}
            y1={12}
            x2={W / 2}
            y2={H - 12}
            stroke="var(--chart-grid)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <circle cx={W / 2} cy={H - 6} r={4} fill="var(--series-2)" />
        </>
      )}
    </svg>
  );
}

export function ChartMarkerSet() {
  return (
    <div className={cx(styles.chart, styles.markerWrap)}>
      <div className={styles.markerCol}>
        <ChartMarker type="line" />
        <span className={styles.markerLabel}>Line</span>
      </div>
      <div className={styles.markerCol}>
        <ChartMarker type="dash" />
        <span className={styles.markerLabel}>Dash</span>
      </div>
      <div className={styles.markerCol}>
        <ChartMarker type="minimal" />
        <span className={styles.markerLabel}>Minimal</span>
      </div>
    </div>
  );
}
