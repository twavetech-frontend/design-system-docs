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
const PRIMITIVE_GROUPS = [
  { label: 'Base', prefix: '--colors-base' },
  { label: 'Brand', prefix: '--colors-brand' },
  { label: 'Error', prefix: '--colors-error' },
  { label: 'Warning', prefix: '--colors-warning' },
  { label: 'Success', prefix: '--colors-success' },
  { label: 'Gray (Light Mode)', prefix: '--colors-grayLightMode' },
  { label: 'Gray (Dark Mode Alpha)', prefix: '--colors-grayDarkModeAlpha' },
  { label: 'Gray (Dark Mode)', prefix: '--colors-grayDarkMode' },
  { label: 'Gray Blue', prefix: '--colors-grayBlue' },
  { label: 'Gray Cool', prefix: '--colors-grayCool' },
  { label: 'Gray Modern', prefix: '--colors-grayModern' },
  { label: 'Gray Neutral', prefix: '--colors-grayNeutral' },
  { label: 'Gray Iron', prefix: '--colors-grayIron' },
  { label: 'Gray True', prefix: '--colors-grayTrue' },
  { label: 'Gray Warm', prefix: '--colors-grayWarm' },
  { label: 'Green Light', prefix: '--colors-greenLight' },
  { label: 'Green', prefix: '--colors-green' },
  { label: 'Moss', prefix: '--colors-moss' },
  { label: 'Teal', prefix: '--colors-teal' },
  { label: 'Cyan', prefix: '--colors-cyan' },
  { label: 'Blue Light', prefix: '--colors-blueLight' },
  { label: 'Blue Dark', prefix: '--colors-blueDark' },
  { label: 'Blue', prefix: '--colors-blue' },
  { label: 'Indigo', prefix: '--colors-indigo' },
  { label: 'Violet', prefix: '--colors-violet' },
  { label: 'Purple', prefix: '--colors-purple' },
  { label: 'Fuchsia', prefix: '--colors-fuchsia' },
  { label: 'Pink', prefix: '--colors-pink' },
  { label: 'Rose', prefix: '--colors-rosé' },
  { label: 'Orange Dark', prefix: '--colors-orangeDark' },
  { label: 'Orange', prefix: '--colors-orange' },
  { label: 'Yellow', prefix: '--colors-yellow' },
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
  { label: 'Utility Blue Light', prefix: '--componentColors-utility-blueLight' },
  { label: 'Utility Blue Dark', prefix: '--componentColors-utility-blueDark' },
  { label: 'Utility Blue', prefix: '--componentColors-utility-blue' },
  { label: 'Utility Indigo', prefix: '--componentColors-utility-indigo' },
  { label: 'Utility Fuchsia', prefix: '--componentColors-utility-fuchsia' },
  { label: 'Utility Pink', prefix: '--componentColors-utility-pink' },
  { label: 'Utility Purple', prefix: '--componentColors-utility-purple' },
  { label: 'Utility Orange Dark', prefix: '--componentColors-utility-orangeDark' },
  { label: 'Utility Orange', prefix: '--componentColors-utility-orange' },
  { label: 'Utility Gray Blue', prefix: '--componentColors-utility-grayBlue' },
  { label: 'Utility Green', prefix: '--componentColors-utility-green' },
  { label: 'Utility Yellow', prefix: '--componentColors-utility-yellow' },
  { label: 'Components', prefix: '--componentColors-components' },
  { label: 'Alpha', prefix: '--componentColors-alpha' },
];

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

  return groups
    .map((g) => ({ label: g.label, colors: classified.get(g.label) || [] }))
    .filter((g) => g.colors.length > 0);
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
      const defs = type === 'primitive' ? PRIMITIVE_GROUPS : type === 'semantic' ? SEMANTIC_GROUPS : COMPONENT_GROUPS;
      setGroups(classifyVars(allVars, defs));
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
