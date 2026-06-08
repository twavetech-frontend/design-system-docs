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

export function RadiusTable() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then(r => r.text())
      .then(text => setTokens(parseCSSText(text)))
      .catch(() => {});
  }, []);

  if (!tokens) return <p>Loading radius tokens...</p>;

  const radii = Object.entries(tokens)
    .filter(([k]) => k.startsWith('--radius'))
    .map(([cssVar, value]) => {
      const name = cssVar.replace('--', '');
      return { name, cssVar, value: Number(value) };
    })
    .sort((a, b) => a.value - b.value);

  return (
    <div>
      {/* Visual Preview */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Radius Scale</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          모서리 둥글기 토큰입니다. 컴포넌트의 크기와 용도에 맞게 사용합니다.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {radii.map(r => {
            const size = 80;
            const displayRadius = r.value >= 9999 ? size / 2 : Math.min(r.value, size / 2);
            return (
              <div key={r.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: size,
                  height: size,
                  borderRadius: displayRadius,
                  border: '2px solid #7f56d9',
                  background: '#f4ebff',
                  marginBottom: 8,
                }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: '#181d27' }}>
                  {r.name.replace('radius', '')}
                </div>
                <div style={{ fontSize: 12, color: '#717680' }}>
                  {r.value >= 9999 ? '9999px' : `${r.value}px`}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Token Table */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Radius Tokens</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          전체 Radius 토큰 목록과 CSS 변수입니다.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Token</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Value</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Preview</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>CSS Variable</th>
            </tr>
          </thead>
          <tbody>
            {radii.map(r => {
              const previewRadius = r.value >= 9999 ? 20 : Math.min(r.value, 20);
              return (
                <tr key={r.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '10px 12px' }}>{r.value >= 9999 ? '9999px' : `${r.value}px`}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: previewRadius,
                      background: '#7f56d9',
                    }} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <code style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
                      {r.cssVar}
                    </code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
