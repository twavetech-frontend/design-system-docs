import { useState, useEffect } from 'react';

function parseCSSText(text) {
  const vars = {};
  const regex = /--([\w\u00C0-\u024F()-]+)\s*:\s*([^;}\n]+)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

const GROUPS = [
  { label: 'Gray', test: (k) => k.startsWith('--gradient-gray') },
  { label: 'Brand', test: (k) => k.startsWith('--gradient-brand') },
  { label: 'Linear', test: (k) => k.startsWith('--gradient-linear') },
];

function extractNumber(name) {
  const m = name.match(/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

function GradientSwatch({ name, value }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const shortName = name
    .replace('--gradient-', '')
    .replace('skeuemorphicGradientBorder', 'skeuemorphic');

  return (
    <div onClick={copy} title={`${name}\nClick to copy`} style={{ cursor: 'pointer' }}>
      <div
        style={{
          height: 80,
          borderRadius: '8px 8px 0 0',
          border: '1px solid rgba(0,0,0,0.06)',
          borderBottom: 'none',
          backgroundImage: value,
        }}
      >
        {copied && (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
            }}>
              Copied!
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          padding: '6px 8px',
          borderRadius: '0 0 8px 8px',
          border: '1px solid rgba(0,0,0,0.06)',
          borderTop: 'none',
          background: '#fff',
        }}
      >
        <div style={{ fontWeight: 600, color: '#333', fontSize: 11 }}>{shortName}</div>
        <div style={{
          color: '#888',
          fontFamily: 'monospace',
          fontSize: 9,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function GradientGroup({ label, gradients }) {
  const isLinear = label === 'Linear';
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#111' }}>{label}</h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isLinear
          ? 'repeat(auto-fill, minmax(140px, 1fr))'
          : `repeat(${Math.min(gradients.length, 7)}, minmax(0, 1fr))`,
        gap: 6,
      }}>
        {gradients.map((g) => <GradientSwatch key={g.name} {...g} />)}
      </div>
    </div>
  );
}

export function GradientTable() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/tokens.css`)
      .then((r) => r.text())
      .then((text) => {
        const allVars = parseCSSText(text);
        const result = [];

        for (const group of GROUPS) {
          const items = Object.entries(allVars)
            .filter(([k, v]) => group.test(k) && v.includes('gradient'))
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => extractNumber(a.name) - extractNumber(b.name));
          if (items.length > 0) {
            result.push({ label: group.label, gradients: items });
          }
        }

        setGroups(result);
      });
  }, []);

  if (groups.length === 0) {
    return <div style={{ padding: 20, color: '#999', textAlign: 'center' }}>Loading gradients...</div>;
  }

  const filtered = search
    ? groups
        .map((g) => ({
          ...g,
          gradients: g.gradients.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.value.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((g) => g.gradients.length > 0)
    : groups;

  return (
    <div>
      <input
        type="text"
        placeholder="Search gradients... (e.g. brand, linear-30)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          marginBottom: 24,
          border: '1px solid #ddd',
          borderRadius: 8,
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {filtered.length === 0 && (
        <div style={{ padding: 20, color: '#999', textAlign: 'center' }}>No matching gradients found.</div>
      )}
      {filtered.map((g) => (
        <GradientGroup key={g.label} label={g.label} gradients={g.gradients} />
      ))}
    </div>
  );
}
