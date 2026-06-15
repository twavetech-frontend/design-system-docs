'use client';
import { useState, useEffect } from 'react';

// --- Fetch and parse tokens.css directly (reliable across all environments) ---
function parseCSSText(text) {
  const vars = {};
  const regex = /--([\w\u00C0-\u024F-]+)\s*:\s*([^;}\n]+)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

function humanize(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\D)(\d)/g, '$1 $2')
    .trim();
}

// --- Group Definitions ---
// Figma "Colors" 페이지(2026-06 개편)의 표시 순서를 따른다.
// Primary: Base ~ Success / Secondary: Gray Neutral ~ Yellow
const PRIMITIVE_GROUPS = [
  { label: 'Base', prefix: '--colors-base' },
  { label: 'Gray (Light Mode)', prefix: '--colors-grayLight' },
  { label: 'Gray (Dark Mode)', prefix: '--colors-grayDark' },
  { label: 'Brand', prefix: '--colors-brand' },
  { label: 'Error', prefix: '--colors-error' },
  { label: 'Warning', prefix: '--colors-warning' },
  { label: 'Success', prefix: '--colors-success' },
  { label: 'Gray Neutral', prefix: '--colors-grayNeutral' },
  { label: 'Green', prefix: '--colors-green' },
  { label: 'Aqua', prefix: '--colors-aqua' },
  { label: 'Blue', prefix: '--colors-blue' },
  { label: 'Purple', prefix: '--colors-purple' },
  { label: 'Pink', prefix: '--colors-pink' },
  { label: 'Red', prefix: '--colors-red' },
  { label: 'Orange', prefix: '--colors-orange' },
  { label: 'Yellow', prefix: '--colors-yellow' },
  // Figma 변수로는 발행되지만 Colors 페이지에는 노출되지 않는 보조 색상.
  { label: 'Gray Dark Alpha', prefix: '--colors-grayDarkAlpha' },
];

const SEMANTIC_GROUPS = [
  { label: 'Text', prefix: '--colors-text' },
  { label: 'Background', prefix: '--colors-background' },
  { label: 'Border', prefix: '--colors-border' },
  { label: 'Foreground', prefix: '--colors-foreground' },
  { label: 'Effects', prefix: '--colors-effects' },
];

const COMPONENT_GROUPS = [
  { label: 'Utility Brand', prefix: '--componentColors-utility-brand' },
  { label: 'Utility Gray', prefix: '--componentColors-utility-gray' },
  { label: 'Utility Error', prefix: '--componentColors-utility-error' },
  { label: 'Utility Warning', prefix: '--componentColors-utility-warning' },
  { label: 'Utility Success', prefix: '--componentColors-utility-success' },
  { label: 'Utility Aqua', prefix: '--componentColors-utility-aqua' },
  { label: 'Utility Blue', prefix: '--componentColors-utility-blue' },
  { label: 'Utility Green', prefix: '--componentColors-utility-green' },
  { label: 'Utility Pink', prefix: '--componentColors-utility-pink' },
  { label: 'Utility Purple', prefix: '--componentColors-utility-purple' },
  { label: 'Utility Orange', prefix: '--componentColors-utility-orange' },
  { label: 'Utility Yellow', prefix: '--componentColors-utility-yellow' },
  { label: 'Components', prefix: '--componentColors-components' },
  { label: 'Alpha', prefix: '--componentColors-alpha' },
];

// --- 타입별 토큰 스코프 ---
// 각 ColorPalette 인스턴스(primitive/semantic/component)가 자기 타입의 토큰만 보도록
// 거른다. 이렇게 하지 않으면 분류되지 않은 토큰을 줍는 auto-discovery 안전망이
// 시맨틱 색상(--colors-text-* 등)을 Primitive 섹션에 "(auto)" 그룹으로 흘려보낸다.
const SEMANTIC_PREFIXES = SEMANTIC_GROUPS.map((g) => g.prefix); // text/background/border/foreground/effects

function scopeTokens(vars, type) {
  const isSemantic = (k) => SEMANTIC_PREFIXES.some((p) => k.startsWith(p));
  const pred =
    type === 'primitive'
      ? (k) => k.startsWith('--colors-') && !isSemantic(k)
      : type === 'semantic'
      ? isSemantic
      : (k) => k.startsWith('--componentColors-');
  return Object.fromEntries(Object.entries(vars).filter(([k]) => pred(k)));
}

// --- Deprecated 토큰 필터 ---
// 2026-06 Figma 변수 개편에서 삭제됐지만, 업스트림 tokens.css(Token Studio 빌드
// 산출물)에는 아직 잔존하는 토큰들. 문서가 Figma 현재 상태를 반영하도록 표시에서
// 제외한다. 업스트림 소스가 정리되면 이 필터는 자동으로 무동작이 된다(토큰이
// 사라지면 걸러낼 것도 없음). tokens.css 자체는 동기화 산출물이라 수정하지 않는다.
const DEPRECATED_PREFIXES = [
  '--colors-blueLight',   // 삭제된 프리미티브 패밀리
  '--colors-cyan',
  '--colors-orangeDark',
  '--colors-rosé',
  '--componentColors-utility-orangeDark', // 삭제된 유틸리티 패밀리
];
// 알파 스케일이 4·8·12·16·24·32·40·48·60·80·100 체계로 변경됨 (옛 10·20·30·50·70·90, black 3·5 제거)
const VALID_ALPHA_STEPS = new Set([4, 8, 12, 16, 24, 32, 40, 48, 60, 80, 100]);

function isDeprecatedToken(name) {
  if (DEPRECATED_PREFIXES.some((p) => name.startsWith(p))) return true;
  // 시맨틱(text/background/border/foreground)의 *Alt 변수는 전부 삭제됨
  if (/^--colors-(text|background|border|foreground)-.*Alt$/.test(name)) return true;
  // 알파: 신규 스케일에 없는 옛 스텝 제거
  const alpha = name.match(/^--componentColors-alpha-alpha(?:White|Black)(\d+)$/);
  if (alpha && !VALID_ALPHA_STEPS.has(Number(alpha[1]))) return true;
  return false;
}

function dropDeprecated(allVars) {
  const live = {};
  for (const [k, v] of Object.entries(allVars)) {
    if (!isDeprecatedToken(k)) live[k] = v;
  }
  return live;
}

// --- Classification (longest prefix first to avoid ambiguity) ---
function classifyVars(allVars, groups) {
  const sorted = [...groups].sort((a, b) => b.prefix.length - a.prefix.length);
  const used = new Set();
  const classified = new Map();

  for (const group of sorted) {
    const items = [];
    for (const [name, value] of Object.entries(allVars)) {
      if (!used.has(name) && name.startsWith(group.prefix)) {
        let step = name.substring(group.prefix.length).replace(/^-+/, '');
        const labelKey = group.label.replace(/\s/g, '');
        if (step.startsWith(labelKey)) {
          step = step.substring(labelKey.length).replace(/^-+/, '');
        }
        items.push({ name, value, step });
        used.add(name);
      }
    }
    classified.set(group.label, items);
  }

  const result = groups
    .map((g) => ({ label: g.label, colors: classified.get(g.label) || [] }))
    .filter((g) => g.colors.length > 0);

  // --- Safety net: auto-discover any token families not covered by the curated
  // list above, so newly-added design-system families never silently disappear. ---
  const leftovers = new Map();
  for (const [name, value] of Object.entries(allVars)) {
    if (used.has(name)) continue;
    const family = name.replace(/-\d.*$/, '');
    if (!leftovers.has(family)) leftovers.set(family, []);
    leftovers.get(family).push({
      name,
      value,
      step: name.substring(family.length).replace(/^-+/, ''),
    });
  }
  for (const [family, colors] of leftovers) {
    const label = humanize(family.replace(/^--(componentColors|colors)-/, ''));
    result.push({ label: `${label} (auto)`, colors });
  }

  return result;
}

// --- Checkerboard for transparent colors ---
const checkerboard = [
  'linear-gradient(45deg, #ddd 25%, transparent 25%)',
  'linear-gradient(-45deg, #ddd 25%, transparent 25%)',
  'linear-gradient(45deg, transparent 75%, #ddd 75%)',
  'linear-gradient(-45deg, transparent 75%, #ddd 75%)',
].join(',');

// --- Color Swatch (grid item for primitive colors) ---
function ColorSwatch({ name, value, step }) {
  const [copied, setCopied] = useState(false);
  const hasAlpha = value.includes('rgba');

  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div onClick={copy} title={`${name}\nClick to copy`} style={{ cursor: 'pointer' }}>
      <div
        style={{
          position: 'relative',
          height: 56,
          borderRadius: '8px 8px 0 0',
          border: '1px solid rgba(0,0,0,0.06)',
          borderBottom: 'none',
          overflow: 'hidden',
          ...(hasAlpha
            ? { backgroundImage: checkerboard, backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0' }
            : {}),
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: value,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {copied && (
            <span style={{ background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10 }}>
              Copied!
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          padding: '4px 6px',
          borderRadius: '0 0 8px 8px',
          border: '1px solid rgba(0,0,0,0.06)',
          borderTop: 'none',
          background: '#fff',
        }}
      >
        <div style={{ fontWeight: 600, color: '#333', fontSize: 11 }}>{step || 'default'}</div>
        <div style={{ color: '#888', fontFamily: 'monospace', fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

// --- Semantic Row (list item for semantic/component colors) ---
function SemanticRow({ name, value, step }) {
  const [copied, setCopied] = useState(false);
  const hasAlpha = value.includes('rgba');

  const copy = () => {
    navigator.clipboard?.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      onClick={copy}
      title="Click to copy variable name"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        fontSize: 13,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          ...(hasAlpha
            ? { backgroundImage: checkerboard, backgroundSize: '6px 6px', backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0' }
            : {}),
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: value }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, color: '#333' }}>{humanize(step)}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#666', flexShrink: 0 }}>
        {copied ? '✓ Copied' : value}
      </div>
    </div>
  );
}

// --- Group Renderers ---
function PrimitiveGroup({ label, colors }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#111' }}>{label}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(colors.length, 13)}, minmax(0, 1fr))`, gap: 6 }}>
        {colors.map((c) => <ColorSwatch key={c.name} {...c} />)}
      </div>
    </div>
  );
}

function SemanticGroup({ label, colors }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#111' }}>{label}</h4>
      <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
        {colors.map((c) => <SemanticRow key={c.name} {...c} />)}
      </div>
    </div>
  );
}

// --- Shared token cache (fetched once per mode, reused across all instances) ---
const tokenCaches = {};
const tokenPromises = {};

function fetchTokens(mode = 'light') {
  if (tokenCaches[mode]) return Promise.resolve(tokenCaches[mode]);
  if (tokenPromises[mode]) return tokenPromises[mode];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const file = mode === 'dark' ? 'tokens-dark.css' : 'tokens.css';
  tokenPromises[mode] = fetch(`${basePath}/${file}`)
    .then((r) => r.text())
    .then((text) => {
      tokenCaches[mode] = parseCSSText(text);
      return tokenCaches[mode];
    });
  return tokenPromises[mode];
}

// --- Tab styles ---
const modeTabBar = {
  display: 'inline-flex',
  gap: 0,
  marginBottom: 20,
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
};

const modeTabBase = {
  padding: '8px 20px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  background: '#fff',
  border: 'none',
  color: '#667085',
  transition: 'background 0.15s, color 0.15s',
};

const modeTabActive = {
  ...modeTabBase,
  background: '#344054',
  color: '#fff',
  fontWeight: 600,
};

// --- Sticky header style ---
const stickyHeader = {
  position: 'sticky',
  top: 64,
  zIndex: 10,
  background: '#fff',
  paddingTop: 16,
  paddingBottom: 8,
  marginLeft: -4,
  marginRight: -4,
  paddingLeft: 4,
  paddingRight: 4,
};

// --- Main Export ---
export function ColorPalette({ type = 'primitive', title, description }) {
  const hasModeToggle = type === 'semantic' || type === 'component';
  const [mode, setMode] = useState('light');
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMode = hasModeToggle ? mode : 'light';
    fetchTokens(fetchMode).then((allVars) => {
      const live = scopeTokens(dropDeprecated(allVars), type);
      const defs = type === 'primitive' ? PRIMITIVE_GROUPS : type === 'semantic' ? SEMANTIC_GROUPS : COMPONENT_GROUPS;
      setGroups(classifyVars(live, defs));
    });
  }, [type, mode]);

  if (groups.length === 0) {
    return <div style={{ padding: 20, color: '#999', textAlign: 'center' }}>Loading colors...</div>;
  }

  const filtered = search
    ? groups
        .map((g) => ({
          ...g,
          colors: g.colors.filter(
            (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.value.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((g) => g.colors.length > 0)
    : groups;

  const GroupComponent = type === 'primitive' ? PrimitiveGroup : SemanticGroup;

  return (
    <div>
      <div style={stickyHeader}>
        {title && <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#111' }}>{title}</h2>}
        {description && <p style={{ margin: '0 0 12px', fontSize: 14, color: '#666' }}>{description}</p>}
        {hasModeToggle && (
          <div style={{ ...modeTabBar, marginBottom: 12 }}>
            <button style={mode === 'light' ? modeTabActive : modeTabBase} onClick={() => setMode('light')}>
              Light
            </button>
            <button style={mode === 'dark' ? modeTabActive : modeTabBase} onClick={() => setMode('dark')}>
              Dark
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Search tokens... (e.g. brand, #7f56d9)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            marginBottom: 0,
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ paddingTop: 16 }}>
        {filtered.length === 0 && <div style={{ padding: 20, color: '#999', textAlign: 'center' }}>No matching tokens found.</div>}
        {filtered.map((g) => (
          <GroupComponent key={g.label} label={g.label} colors={g.colors} />
        ))}
      </div>
    </div>
  );
}
