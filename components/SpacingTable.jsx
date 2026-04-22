import { useState, useEffect } from 'react';

function parseCSSText(text) {
  const vars = {};
  const regex = /--([\w\u00C0-\u024F\u2024-]+)\s*:\s*([^;}\n]+)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

export function SpacingTable() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then(r => r.text())
      .then(text => setTokens(parseCSSText(text)))
      .catch(() => {});
  }, []);

  if (!tokens) return <p>Loading spacing tokens...</p>;

  // Primitive spacing (Spacing/0 (0px) format)
  const primitives = Object.entries(tokens)
    .filter(([k]) => k.startsWith('--spacing-') && k.includes('-') && k.match(/--spacing-\d/))
    .map(([cssVar, value]) => {
      const name = cssVar.replace('--', '');
      return { name, cssVar, value: Number(value) };
    })
    .sort((a, b) => a.value - b.value);

  // Semantic spacing (spacingNone, spacingXs format)
  const semantics = Object.entries(tokens)
    .filter(([k]) => k.match(/^--spacing[A-Z]/) || k.match(/^--spacing\d+xl$/i))
    .map(([cssVar, value]) => {
      const name = cssVar.replace('--', '');
      return { name, cssVar, value: Number(value) };
    })
    .sort((a, b) => a.value - b.value);

  const maxBarWidth = 320;

  return (
    <div>
      {/* Primitive Spacing */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Spacing Primitives</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          기본 간격 단위입니다. 4px 배수 기반으로 구성됩니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {primitives.filter(s => s.value <= 96).map(s => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '8px 0', borderBottom: '1px solid #f5f5f5',
            }}>
              <div style={{ minWidth: 60, fontSize: 13, fontWeight: 600, color: '#181d27' }}>
                {s.value}px
              </div>
              <div style={{
                width: Math.max(s.value * 2, 2),
                maxWidth: maxBarWidth,
                height: 12,
                background: '#7f56d9',
                borderRadius: 2,
                transition: 'width 0.3s',
              }} />
              <code style={{ fontSize: 11, color: '#717680', background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
                var({s.cssVar})
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Spacing */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Semantic Spacing</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          용도 기반 간격 토큰입니다. 컴포넌트와 레이아웃에서 사용합니다.
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
            {semantics.map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '10px 12px' }}>{s.value}px</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{
                    width: Math.max(s.value * 1.5, 2),
                    maxWidth: maxBarWidth,
                    height: 12,
                    background: '#9e77ed',
                    borderRadius: 2,
                  }} />
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <code style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
                    {s.cssVar}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Large Spacing */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Large Spacing</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          레이아웃 수준의 큰 간격입니다. 섹션 간격, 페이지 여백 등에 사용합니다.
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
            {primitives.filter(s => s.value > 96).map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '10px 12px' }}>{s.value}px</td>
                <td style={{ padding: '10px 12px' }}>
                  <code style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
                    {s.cssVar}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
