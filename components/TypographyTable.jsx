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

const FONT_WEIGHT_MAP = {
  'Regular': 400,
  'Regular italic': 400,
  'Medium': 500,
  'Medium italic': 500,
  'Semibold': 600,
  'Semibold italic': 600,
  'Bold': 700,
  'Bold italic': 700,
};

export function TypographyTable() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then(r => r.text())
      .then(text => setTokens(parseCSSText(text)))
      .catch(() => {});
  }, []);

  if (!tokens) return <p>Loading typography tokens...</p>;

  // Extract font sizes & line heights
  const textSizes = [];
  const displaySizes = [];

  const sizeKeys = Object.keys(tokens).filter(k => k.startsWith('--fontSize-'));
  for (const key of sizeKeys) {
    const name = key.replace('--fontSize-', '');
    // Only include semantic tokens (display* or text*), skip primitives (numbers)
    if (!name.startsWith('display') && !name.startsWith('text')) continue;
    const rawSize = tokens[key];
    const fontSize = String(rawSize).replace('px', '');
    const lhKey = `--lineHeight-${name}`;
    const rawLh = tokens[lhKey];
    const lineHeight = rawLh ? String(rawLh).replace('px', '') : '—';

    const entry = { name, fontSize, lineHeight, cssVar: key };
    if (name.startsWith('text')) {
      textSizes.push(entry);
    } else {
      displaySizes.push(entry);
    }
  }

  // Sort by font size ascending
  const sortBySize = (a, b) => Number(a.fontSize) - Number(b.fontSize);
  textSizes.sort(sortBySize);
  displaySizes.sort(sortBySize);

  // Font weights
  const weightKeys = Object.keys(tokens).filter(k => k.startsWith('--fontWeight-'));
  const weights = weightKeys.map(k => ({
    name: k.replace('--fontWeight-', ''),
    value: tokens[k],
    numeric: FONT_WEIGHT_MAP[tokens[k]] || '—',
    cssVar: k,
  }));

  // Font families
  const familyKeys = Object.keys(tokens).filter(k => k.startsWith('--fontFamily-'));
  const families = familyKeys.map(k => ({
    name: k.replace('--fontFamily-', ''),
    value: tokens[k],
    cssVar: k,
  }));

  return (
    <div>
      {/* Font Family */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Font Family</h2>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {families.map(f => (
            <div key={f.name} style={{
              flex: '1 1 280px',
              padding: 24,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#fafafa',
            }}>
              <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8, fontFamily: f.value }}>
                {f.value}
              </div>
              <div style={{ fontSize: 13, color: '#717680' }}>
                <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
                  var({f.cssVar})
                </code>
              </div>
              <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 4 }}>
                {f.name === 'fontFamilyDisplay' ? 'Display' : 'Body'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weight */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Font Weight</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Value</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Numeric</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Preview</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>CSS Variable</th>
            </tr>
          </thead>
          <tbody>
            {weights.map(w => (
              <tr key={w.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{w.name}</td>
                <td style={{ padding: '12px' }}>{w.value}</td>
                <td style={{ padding: '12px' }}>{w.numeric}</td>
                <td style={{ padding: '12px', fontWeight: w.numeric, fontFamily: 'Pretendard', fontSize: 16, fontStyle: w.value.includes('italic') ? 'italic' : 'normal' }}>
                  함께 성장하는 습관 소셜 핀테크. 아임인
                </td>
                <td style={{ padding: '12px' }}>
                  <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                    {w.cssVar}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Display Sizes */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Display</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 20 }}>
          큰 제목, 히어로 텍스트, 숫자 강조 등에 사용합니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[...displaySizes].reverse().map(s => (
            <TypeRow key={s.name} entry={s} />
          ))}
        </div>
      </section>

      {/* Text Sizes */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Text</h2>
        <p style={{ fontSize: 14, color: '#717680', marginBottom: 20 }}>
          본문, 캡션, 라벨 등 일반 텍스트에 사용합니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[...textSizes].reverse().map(s => (
            <TypeRow key={s.name} entry={s} />
          ))}
        </div>
      </section>

      {/* Scale Overview */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Type Scale Overview</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Token</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Font Size</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Line Height</th>
              <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>CSS Variable</th>
            </tr>
          </thead>
          <tbody>
            {[...displaySizes].reverse().concat([...textSizes].reverse()).map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '10px 12px' }}>{s.fontSize}px</td>
                <td style={{ padding: '10px 12px' }}>{s.lineHeight}px</td>
                <td style={{ padding: '10px 12px' }}>
                  <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
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

function TypeRow({ entry }) {
  const { name, fontSize, lineHeight } = entry;
  const size = Number(fontSize);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 24,
      padding: '20px 0',
      borderBottom: '1px solid #f0f0f0',
    }}>
      <div style={{ minWidth: 140, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#181d27' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 2 }}>
          {fontSize}px / {lineHeight}px
        </div>
      </div>
      <div style={{
        flex: 1,
        fontFamily: 'Pretendard, sans-serif',
        fontSize: size,
        lineHeight: `${lineHeight}px`,
        fontWeight: size >= 24 ? 700 : 400,
        color: '#181d27',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        함께 성장하는 습관 소셜 핀테크. 아임인
      </div>
    </div>
  );
}
