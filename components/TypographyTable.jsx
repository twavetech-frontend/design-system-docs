'use client';
import { useState, useEffect } from 'react';

function parseCSSText(text) {
  const vars = {};
  const regex = /--([\wÀ-ɏ-]+)\s*:\s*([^;}\n]+)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

// Numeric font-weight per variant name. Driven by the token *name* (not its
// value) so that removed/renamed variants — e.g. italics — never render.
const WEIGHT_NUMERIC = {
  regular: 400,
  regualr: 400, // tolerate typo present in source tokens
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

// Parse a composite font shorthand token like:
//   "400 36px/44 Pretendard"  ->  { size: 36, lineHeight: 44, family: 'Pretendard' }
//   "700 32px/40 'Carmen Sans'" -> { size: 32, lineHeight: 40, family: 'Carmen Sans' }
function parseComposite(value) {
  if (!value) return null;
  const m = value.match(/^\d+\s+([\d.]+)px\s*\/\s*([\d.]+)\s+(.+)$/);
  if (!m) return null;
  return {
    size: Number(m[1]),
    lineHeight: Number(m[2]),
    family: m[3].trim().replace(/^['"]|['"]$/g, ''),
  };
}

// Two typefaces, matching Figma "Typography - UI" and "Typography - Graphic".
const TYPEFACES = [
  {
    title: 'Typography · UI',
    family: 'Pretendard',
    fallback: "'Pretendard', sans-serif",
    description: '제품 UI 전반에 사용하는 본문/제목 서체입니다.',
    sample: '함께 성장하는 습관 소셜 핀테크. 아임인',
    weights: ['regular', 'medium', 'semibold', 'bold'],
    // semantic size token name -> css variable prefix (without weight suffix)
    sizes: [
      'headingMd', 'headingSm', 'headingXs',
      'bodyLg', 'bodyMd', 'bodySm', 'bodyXs', 'bodyXxs',
    ],
    tokenFor: (size, weight) => [`--${size}-${weight}`],
    previewWeight: (size) => (size.startsWith('heading') ? 'semibold' : 'regular'),
  },
  {
    title: 'Typography · Graphic',
    family: 'Carmen Sans',
    fallback: "'Carmen Sans', sans-serif",
    description: '브랜드 그래픽·키비주얼에 사용하는 디스플레이 서체입니다.',
    sample: 'Grow the habit together. Imin',
    weights: ['regular', 'bold', 'extrabold'],
    sizes: [
      'headingLg', 'headingMd', 'headingSm', 'headingXs',
      'bodyMd', 'bodySm', 'bodyXs',
    ],
    // NOTE: 현재 published web/tokens.css 의 carmenSans-* 시맨틱 토큰은 값이 손상돼
    // 있습니다(line-height·weight·오타 "regualr"). Figma 텍스트 스타일이 토큰으로
    // 재추출되기 전까지, 그래픽 스케일은 Figma 기준 정상값으로 고정합니다.
    // 토큰이 정상화되면 staticScale 을 제거하고 tokenFor 파싱으로 되돌리면 됩니다.
    staticScale: {
      headingLg: { size: 40, lineHeight: 48 },
      headingMd: { size: 32, lineHeight: 40 },
      headingSm: { size: 24, lineHeight: 32 },
      headingXs: { size: 20, lineHeight: 28 },
      bodyMd: { size: 16, lineHeight: 24 },
      bodySm: { size: 14, lineHeight: 20 },
      bodyXs: { size: 12, lineHeight: 18 },
    },
    tokenFor: (size, weight) => [`--carmenSans-${size}-${weight}`],
    previewWeight: (size) => (size.startsWith('heading') ? 'bold' : 'regular'),
  },
];

function sizeLabel(size) {
  const m = size.match(/^(heading|body)([A-Za-z]+)$/);
  if (!m) return size;
  return `${m[1][0].toUpperCase()}${m[1].slice(1)} ${m[2].toLowerCase()}`;
}

function weightLabel(weight) {
  if (weight === 'extrabold') return 'Extrabold';
  return weight.charAt(0).toUpperCase() + weight.slice(1);
}

export function TypographyTable() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then((r) => r.text())
      .then((text) => setTokens(parseCSSText(text)))
      .catch(() => {});
  }, []);

  if (!tokens) return <p>Loading typography tokens...</p>;

  // Resolve a typeface's tokens into structured scale data.
  const resolve = (tf) => {
    // The primitive --fontSize-*/--lineHeight-* tokens are the reliable source
    // for size & line-height; some composite shorthand tokens are mis-generated
    // upstream (e.g. bodyXxs/bodyXs ship the wrong px in the shorthand). Prefer
    // primitives when present so the scale stays token-driven yet correct.
    const num = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));
    const primitive = (size) => ({
      size: num(tokens[`--fontSize-${size}`]),
      lineHeight: num(tokens[`--lineHeight-${size}`]),
    });

    const lookup = (size, weight) => {
      for (const key of tf.tokenFor(size, weight)) {
        if (tokens[key]) {
          const parsed = parseComposite(tokens[key]);
          if (parsed) {
            const p = primitive(size);
            return {
              cssVar: key,
              ...parsed,
              ...(p.size != null && { size: p.size }),
              ...(p.lineHeight != null && { lineHeight: p.lineHeight }),
            };
          }
        }
      }
      return null;
    };

    // Graphic(Carmen)처럼 토큰이 손상된 경우엔 Figma 기준 고정 스케일을 사용한다.
    if (tf.staticScale) {
      const weights = tf.weights.map((w) => ({ name: w, numeric: WEIGHT_NUMERIC[w] }));
      const scale = tf.sizes
        .filter((size) => tf.staticScale[size])
        .map((size) => {
          const { size: fontSize, lineHeight } = tf.staticScale[size];
          const base = { size: fontSize, lineHeight, cssVar: tf.tokenFor(size, 'regular')[0] };
          const variants = {};
          for (const w of tf.weights) variants[w] = base;
          return { size, label: sizeLabel(size), base, variants };
        });
      return { weights, scale };
    }

    const weights = tf.weights
      .filter((w) => tf.sizes.some((s) => lookup(s, w)))
      .map((w) => ({ name: w, numeric: WEIGHT_NUMERIC[w] }));

    const scale = tf.sizes
      .map((size) => {
        const variants = {};
        for (const w of tf.weights) {
          const r = lookup(size, w);
          if (r) variants[w] = r;
        }
        const base = variants[tf.previewWeight(size)] || Object.values(variants)[0];
        if (!base) return null;
        return { size, label: sizeLabel(size), base, variants };
      })
      .filter(Boolean);

    return { weights, scale };
  };

  return (
    <div>
      {TYPEFACES.map((tf) => {
        const { weights, scale } = resolve(tf);
        if (!scale.length) return null;
        return (
          <section key={tf.family} style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{tf.title}</h2>
            <p style={{ fontSize: 14, color: '#717680', marginBottom: 24 }}>{tf.description}</p>

            {/* Typeface specimen + weights */}
            <div style={{
              display: 'flex',
              gap: 32,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              padding: 24,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#fafafa',
              marginBottom: 32,
            }}>
              <div style={{ flex: '1 1 320px', minWidth: 280 }}>
                <div style={{ fontSize: 13, color: '#717680', marginBottom: 8 }}>{tf.family}</div>
                <div style={{ fontFamily: tf.fallback, fontSize: 72, fontWeight: 400, lineHeight: 1, marginBottom: 16 }}>
                  Ag
                </div>
                <div style={{ fontFamily: tf.fallback, fontSize: 20, lineHeight: 1.5, color: '#181d27' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&amp;*()
                </div>
              </div>
              <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {weights.map((w) => (
                  <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontFamily: tf.fallback, fontSize: 28, fontWeight: w.numeric, width: 48 }}>
                      Aa
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#181d27' }}>{weightLabel(w.name)}</div>
                      <div style={{ fontSize: 12, color: '#a4a7ae' }}>Font weight: {w.numeric}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type scale */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {scale.map((row) => (
                <div
                  key={row.size}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 24,
                    padding: '20px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ minWidth: 150, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#181d27' }}>{row.label}</div>
                    <div style={{ fontSize: 12, color: '#a4a7ae', marginTop: 2 }}>
                      {row.base.size}px / {row.base.lineHeight}px
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: tf.fallback,
                      fontSize: row.base.size,
                      lineHeight: `${row.base.lineHeight}px`,
                      fontWeight: WEIGHT_NUMERIC[tf.previewWeight(row.size)],
                      color: '#181d27',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tf.sample}
                  </div>
                </div>
              ))}
            </div>

            {/* Token reference table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 24 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Style</th>
                  <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Size</th>
                  <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Line height</th>
                  <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>Weights</th>
                  <th style={{ padding: '10px 12px', color: '#717680', fontWeight: 500 }}>CSS Variable</th>
                </tr>
              </thead>
              <tbody>
                {scale.map((row) => (
                  <tr key={row.size} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.label}</td>
                    <td style={{ padding: '10px 12px' }}>{row.base.size}px</td>
                    <td style={{ padding: '10px 12px' }}>{row.base.lineHeight}px</td>
                    <td style={{ padding: '10px 12px' }}>
                      {Object.keys(row.variants).map((w) => `${WEIGHT_NUMERIC[w]}`).join(' / ')}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                        {row.base.cssVar.replace(/-(regular|regualr|medium|semibold|bold|extrabold)$/, '-{weight}')}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
