'use client';
import { useState, useEffect } from 'react';

function parseCSSText(text) {
  const vars = {};
  const regex = /--([\w\u00C0-\u024F-]+)\s*:\s*([^;}\n]+)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

// Figma "Spacing, radius & grids" 페이지의 layout grid 정의(2026-06 개편)와 동일.
const GRID_SPECS = [
  {
    name: 'Desktop',
    width: 1280,
    columns: 12,
    gutter: 32,
    margin: 32,
    color: '#7700ff',
  },
  {
    name: 'Tablet',
    width: 768,
    columns: 6,
    gutter: 32,
    margin: 32,
    color: '#9b55ff',
  },
  {
    name: 'Phone',
    width: 375,
    columns: 4,
    gutter: 16,
    margin: 16,
    color: '#b685ff',
  },
];

function GridVisual({ spec, scale }) {
  const scaledWidth = spec.width * scale;
  const scaledMargin = spec.margin * scale;
  const scaledGutter = spec.gutter * scale;
  const contentWidth = scaledWidth - scaledMargin * 2;
  const totalGutters = (spec.columns - 1) * scaledGutter;
  const colWidth = (contentWidth - totalGutters) / spec.columns;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{spec.name}</h3>
        <span style={{ fontSize: 13, color: '#717680' }}>
          {spec.width}px · {spec.columns} columns · {spec.gutter}px gutter · {spec.margin}px margin
        </span>
      </div>
      <div style={{
        width: scaledWidth,
        maxWidth: '100%',
        height: 64,
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        padding: `0 ${scaledMargin}px`,
        gap: scaledGutter,
      }}>
        {Array.from({ length: spec.columns }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            background: `${spec.color}20`,
            borderLeft: `1px solid ${spec.color}40`,
            borderRight: `1px solid ${spec.color}40`,
          }} />
        ))}
      </div>
    </div>
  );
}

export function GridTable() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then(r => r.text())
      .then(text => setTokens(parseCSSText(text)))
      .catch(() => {});
  }, []);

  if (!tokens) return <p>Loading grid tokens...</p>;

  // Container tokens
  const containers = Object.entries(tokens)
    .filter(([k]) => k.startsWith('--container'))
    .map(([cssVar, value]) => ({
      name: cssVar.replace('--', ''),
      cssVar,
      value: Number(value),
    }));

  // Width tokens
  const widths = Object.entries(tokens)
    .filter(([k]) => k.startsWith('--width'))
    .map(([cssVar, value]) => ({
      name: cssVar.replace('--', ''),
      cssVar,
      value: Number(value),
    }))
    .sort((a, b) => a.value - b.value);

  const scale = 0.6;

  return (
    <div>
      {/* Grid Layouts */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Grid System</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          반응형 그리드 레이아웃입니다. 브레이크포인트별 컬럼 수와 거터, 마진이 다릅니다.
        </p>
        {GRID_SPECS.map(spec => (
          <GridVisual key={spec.name} spec={spec} scale={scale} />
        ))}
      </section>

      {/* Grid Spec Table */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Breakpoint Specs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Breakpoint</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Width</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Columns</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Gutter</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Margin</th>
            </tr>
          </thead>
          <tbody>
            {GRID_SPECS.map(spec => (
              <tr key={spec.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{spec.name}</td>
                <td style={{ padding: '10px 12px' }}>{spec.width}px</td>
                <td style={{ padding: '10px 12px' }}>{spec.columns}</td>
                <td style={{ padding: '10px 12px' }}>{spec.gutter}px</td>
                <td style={{ padding: '10px 12px' }}>{spec.margin}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Container Tokens */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Container Tokens</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          컨테이너 최대 너비와 패딩 토큰입니다.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Token</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Value</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>CSS Variable</th>
            </tr>
          </thead>
          <tbody>
            {containers.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '10px 12px' }}>{c.value}px</td>
                <td style={{ padding: '10px 12px' }}>
                  <code style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
                    {c.cssVar}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Width Tokens */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Width Tokens</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          컴포넌트와 레이아웃에서 사용하는 너비 토큰입니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {widths.map(w => (
            <div key={w.name} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '8px 0', borderBottom: '1px solid #f5f5f5',
            }}>
              <div style={{ minWidth: 100, fontSize: 13, fontWeight: 600, color: '#181d27' }}>
                {w.name}
              </div>
              <div style={{ minWidth: 60, fontSize: 13, color: '#717680' }}>
                {w.value}px
              </div>
              <div style={{
                width: Math.min(w.value * 0.4, 500),
                height: 12,
                background: '#7f56d9',
                borderRadius: 2,
              }} />
              <code style={{ fontSize: 11, color: '#717680', background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
                var({w.cssVar})
              </code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
