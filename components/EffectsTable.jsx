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

// Shadow definitions: color tokens come from CSS, geometry is from Figma Effect Styles
const SHADOW_DEFS = [
  {
    name: 'shadow-xs',
    desc: '미세한 깊이감. 인풋 필드, 아바타 등',
    layers: [{ colorKey: 'shadowXs', x: 0, y: 1, blur: 2, spread: 0 }],
  },
  {
    name: 'shadow-sm',
    desc: '약한 부상. 카드, 드롭다운 등',
    layers: [
      { colorKey: 'shadowSm01', x: 0, y: 1, blur: 2, spread: 0 },
      { colorKey: 'shadowSm02', x: 0, y: 1, blur: 3, spread: 0 },
    ],
  },
  {
    name: 'shadow-md',
    desc: '중간 부상. 팝오버, 호버 카드 등',
    layers: [
      { colorKey: 'shadowMd01', x: 0, y: 2, blur: 4, spread: -2 },
      { colorKey: 'shadowMd02', x: 0, y: 4, blur: 8, spread: -2 },
    ],
  },
  {
    name: 'shadow-lg',
    desc: '높은 부상. 모달 부분, 플로팅 카드 등',
    layers: [
      { colorKey: 'shadowLg01', x: 0, y: 4, blur: 6, spread: -2 },
      { colorKey: 'shadowLg02', x: 0, y: 12, blur: 16, spread: -4 },
      { colorKey: 'shadowLg03', x: 0, y: -4, blur: 4, spread: -2 },
    ],
  },
  {
    name: 'shadow-xl',
    desc: '강한 부상. 모달, 다이얼로그 등',
    layers: [
      { colorKey: 'shadowXl01', x: 0, y: 8, blur: 8, spread: -4 },
      { colorKey: 'shadowXl02', x: 0, y: 20, blur: 24, spread: -4 },
      { colorKey: 'shadowXl03', x: 0, y: -4, blur: 4, spread: -2 },
    ],
  },
  {
    name: 'shadow-2xl',
    desc: '매우 강한 부상. 시트, 토스트 등',
    layers: [
      { colorKey: 'shadow2xl01', x: 0, y: 24, blur: 48, spread: -12 },
      { colorKey: 'shadow2xl02', x: 0, y: -4, blur: 4, spread: -2 },
    ],
  },
  {
    name: 'shadow-3xl',
    desc: '최대 부상. 풀스크린 모달 등',
    layers: [
      { colorKey: 'shadow3xl01', x: 0, y: 32, blur: 64, spread: -12 },
      { colorKey: 'shadow3xl02', x: 0, y: -4, blur: 4, spread: -2 },
    ],
  },
  {
    name: 'shadow-4xl',
    desc: '광범위한 부상. 풀스크린 모달, 시트 등',
    layers: [
      { colorKey: 'shadow3xl01', x: 0, y: 21, blur: 120, spread: -12 },
      { colorKey: 'shadow3xl02', x: 0, y: 14, blur: 60, spread: -2.5 },
    ],
  },
  {
    name: 'shadow-field',
    desc: '인풋 필드용. 미세한 깊이감',
    layers: [
      { colorKey: 'fieldShadow', x: 0, y: 2, blur: 4, spread: 0 },
      { colorKey: 'fieldShadow2', x: 0, y: 1, blur: 2, spread: 0 },
      { colorKey: 'fieldShadow2', x: 0, y: 0, blur: 1, spread: 0 },
    ],
  },
];

const FOCUS_RING_DEFS = [
  { name: 'focus-ring', desc: '기본 포커스 링', colorKey: 'focusRing', width: 4, offset: 1 },
  { name: 'focus-ring-error', desc: '에러 포커스 링', colorKey: 'focusRingError', width: 4, offset: 1 },
];

const BLUR_DEFS = [
  { name: 'backdrop-blur-sm', value: 4, desc: '미세한 블러' },
  { name: 'backdrop-blur-md', value: 8, desc: '중간 블러' },
  { name: 'backdrop-blur-lg', value: 16, desc: '강한 블러' },
  { name: 'backdrop-blur-xl', value: 24, desc: '매우 강한 블러' },
];

// Light mode shadow colors from tokens.json (CSS vars resolve to transparent in some builds)
const SHADOW_COLORS = {
  shadowXs: '#0a0d120d',
  shadowSm01: '#0a0d121a',
  shadowSm02: '#0a0d121a',
  shadowMd01: '#0a0d121a',
  shadowMd02: '#0a0d120f',
  shadowLg01: '#0a0d1214',
  shadowLg02: '#0a0d1208',
  shadowLg03: '#0a0d120a',
  shadowXl01: '#0a0d1214',
  shadowXl02: '#0a0d1208',
  shadowXl03: '#0a0d120a',
  shadow2xl01: '#0a0d122e',
  shadow2xl02: '#0a0d120a',
  shadow3xl01: '#0a0d1224',
  shadow3xl02: '#0a0d120a',
  fieldShadow: '#0000000a',
  fieldShadow2: '#0000000f',
};

function hexToRgba(hex) {
  if (!hex || !hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

function buildBoxShadow(layers) {
  return layers.map(l => {
    const color = hexToRgba(SHADOW_COLORS[l.colorKey] || '#0a0d1214');
    return `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`;
  }).join(', ');
}

export function EffectsTable() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then(r => r.text())
      .then(text => setTokens(parseCSSText(text)))
      .catch(() => {});
  }, []);

  if (!tokens) return <p>Loading effect tokens...</p>;

  return (
    <div>
      {/* Shadows */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Shadows</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          요소의 깊이감과 계층 구조를 표현합니다. xs에서 4xl까지 8단계와 인풋 필드용 shadow-field로 구성됩니다.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 32,
          marginBottom: 32,
          background: '#f5f5f5',
          borderRadius: 16,
          padding: 32,
        }}>
          {SHADOW_DEFS.map(s => {
            const boxShadow = buildBoxShadow(s.layers);
            return (
              <div key={s.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: 100,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow,
                  marginBottom: 12,
                }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: '#181d27' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 2 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Shadow Detail Table */}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Shadow Specs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', color: '#717680', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '8px 12px', color: '#717680', fontWeight: 500 }}>Layers</th>
              <th style={{ padding: '8px 12px', color: '#717680', fontWeight: 500 }}>Color Token</th>
              <th style={{ padding: '8px 12px', color: '#717680', fontWeight: 500 }}>CSS box-shadow</th>
            </tr>
          </thead>
          <tbody>
            {SHADOW_DEFS.map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid #f0f0f0', verticalAlign: 'top' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '10px 12px' }}>
                  {s.layers.map((l, i) => (
                    <div key={i} style={{ fontSize: 12, color: '#535862' }}>
                      {l.x} {l.y} {l.blur} {l.spread}
                    </div>
                  ))}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  {s.layers.map((l, i) => {
                    const colorVar = `--colors-effects-shadows-${l.colorKey}`;
                    const color = tokens[colorVar] || '—';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{
                          display: 'inline-block', width: 14, height: 14, borderRadius: 3,
                          background: color, border: '1px solid #e5e7eb', flexShrink: 0,
                        }} />
                        <code style={{ fontSize: 11, background: '#f0f0f0', padding: '1px 4px', borderRadius: 3 }}>
                          {l.colorKey}
                        </code>
                      </div>
                    );
                  })}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <code style={{ fontSize: 11, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, wordBreak: 'break-all' }}>
                    {buildBoxShadow(s.layers)}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Focus Rings */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Focus Rings</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          키보드 포커스 상태를 시각적으로 표시합니다. 접근성을 위한 필수 요소입니다.
        </p>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
          {FOCUS_RING_DEFS.map(f => {
            const colorVar = `--colors-effects-focusRings-${f.colorKey}`;
            const color = tokens[colorVar] || '#9e77ed';
            return (
              <div key={f.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 120, height: 48, background: '#fff', borderRadius: 8,
                  border: '1px solid #d5d7da',
                  boxShadow: `0 0 0 ${f.offset}px #fff, 0 0 0 ${f.offset + f.width}px ${color}33`,
                  outline: `2px solid ${color}`,
                  outlineOffset: f.offset,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: '#535862',
                  marginBottom: 12,
                }}>
                  Focus
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#181d27' }}>{f.name}</div>
                <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 2 }}>{f.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 6 }}>
                  <span style={{
                    display: 'inline-block', width: 14, height: 14, borderRadius: 3,
                    background: color, border: '1px solid #e5e7eb',
                  }} />
                  <code style={{ fontSize: 11, background: '#f0f0f0', padding: '1px 4px', borderRadius: 3 }}>
                    {color}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        {/* Focus ring on components */}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>적용 예시</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <button style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: '#7f56d9', color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 0 0 1px #fff, 0 0 0 5px ${tokens['--colors-effects-focusRings-focusRing'] || '#9e77ed'}33`,
              outline: `2px solid ${tokens['--colors-effects-focusRings-focusRing'] || '#9e77ed'}`,
              outlineOffset: 1,
            }}>
              Button (focused)
            </button>
            <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 8 }}>Primary Button</div>
          </div>
          <div>
            <input
              readOnly
              value="Input (focused)"
              style={{
                padding: '10px 14px', borderRadius: 8,
                border: `1px solid ${tokens['--colors-effects-focusRings-focusRing'] || '#9e77ed'}`,
                fontSize: 14, width: 200,
                boxShadow: `0 0 0 4px ${tokens['--colors-effects-focusRings-focusRing'] || '#9e77ed'}18`,
                outline: 'none',
              }}
            />
            <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 8 }}>Input Field</div>
          </div>
          <div>
            <button style={{
              padding: '10px 18px', borderRadius: 8,
              border: `1px solid ${tokens['--colors-effects-focusRings-focusRingError'] || '#f04438'}`,
              background: '#fff', color: '#b42318', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 0 0 4px ${tokens['--colors-effects-focusRings-focusRingError'] || '#f04438'}18`,
              outline: 'none',
            }}>
              Destructive (focused)
            </button>
            <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 8 }}>Error Focus</div>
          </div>
        </div>
      </section>

      {/* Backdrop Blurs */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Backdrop Blurs</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>
          배경 흐림 효과입니다. 오버레이, 모달 배경, 글래스모피즘 등에 사용합니다.
        </p>

        {/* No blur reference */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>비교 (원본 vs 블러)</h3>
          <div style={{
            position: 'relative', width: '100%', height: 280,
            borderRadius: 16, overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80"
              alt="Landscape"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', bottom: 12, left: 12,
              background: 'rgba(0,0,0,0.5)', color: '#fff',
              padding: '4px 10px', borderRadius: 6, fontSize: 12,
            }}>
              Original (no blur)
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {BLUR_DEFS.map(b => (
            <div key={b.name} style={{ textAlign: 'center' }}>
              <div style={{
                position: 'relative', width: '100%', height: 200,
                borderRadius: 12, overflow: 'hidden',
              }}>
                {/* Background image */}
                <img
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80"
                  alt="Backdrop"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Blur overlay box in center */}
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '70%', height: '60%',
                  backdropFilter: `blur(${b.value}px)`,
                  WebkitBackdropFilter: `blur(${b.value}px)`,
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 4,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    {b.value}px
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    backdrop-filter
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#181d27', marginTop: 10 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 2 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
