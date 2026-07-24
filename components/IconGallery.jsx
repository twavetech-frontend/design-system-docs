'use client';
import { useState, useEffect } from 'react';

function IconCard({ icon, basePath }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(null); // 'svg' | 'name' | null

  const copySvg = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${basePath}${icon.file}`);
      const svg = await res.text();
      await navigator.clipboard?.writeText(svg);
      setCopied('svg');
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const copyName = () => {
    navigator.clipboard?.writeText(icon.name);
    setCopied('name');
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div
      onClick={copyName}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '16px 8px 10px',
        borderRadius: 8,
        border: `1px solid ${hover ? '#bbb' : '#eee'}`,
        background: '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        boxShadow: hover ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {copied && (
        <div style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: '#111',
          color: '#fff',
          fontSize: 9,
          padding: '2px 6px',
          borderRadius: 4,
          zIndex: 2,
        }}>
          {copied === 'svg' ? 'SVG Copied!' : 'Name Copied!'}
        </div>
      )}
      {hover && !copied && (
        <button
          onClick={copySvg}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            background: '#111',
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          Copy SVG
        </button>
      )}
      <img
        src={`${basePath}${icon.file}`}
        alt={icon.name}
        width={24}
        height={24}
        style={{ display: 'block', opacity: hover && !copied ? 0.3 : 1, transition: 'opacity 0.15s' }}
      />
      <span style={{
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        lineHeight: 1.3,
        wordBreak: 'break-all',
        maxWidth: '100%',
      }}>
        {icon.name}
      </span>
    </div>
  );
}

// --- Style tab styles ---
const styleTabBar = {
  display: 'inline-flex',
  gap: 0,
  marginBottom: 20,
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
};
const styleTabBase = {
  padding: '8px 20px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  background: '#fff',
  border: 'none',
  color: '#667085',
  transition: 'background 0.15s, color 0.15s',
};
const styleTabActive = {
  ...styleTabBase,
  background: '#344054',
  color: '#fff',
  fontWeight: 600,
};

export function IconGallery() {
  const [lineData, setLineData] = useState(null);
  const [solidData, setSolidData] = useState(null);
  const [style, setStyle] = useState('line');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    fetch(`${basePath}/icons-data.json`)
      .then((r) => r.json())
      .then(setLineData);
    fetch(`${basePath}/icons-solid-data.json`)
      .then((r) => r.json())
      .then(setSolidData)
      .catch(() => setSolidData(null));
  }, []);

  const data = style === 'solid' ? solidData : lineData;

  if (!lineData) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading icons...</div>;
  }

  const categories = data ? Object.keys(data) : [];
  const allIcons = data
    ? categories.flatMap((cat) => data[cat].map((icon) => ({ ...icon, category: cat })))
    : [];

  const filtered = allIcons.filter((icon) => {
    const matchesSearch = !search || icon.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || icon.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Style tabs (Line / Solid) */}
      <div style={styleTabBar}>
        <button style={style === 'line' ? styleTabActive : styleTabBase} onClick={() => { setStyle('line'); setActiveCategory('all'); }}>
          Line
        </button>
        <button style={style === 'solid' ? styleTabActive : styleTabBase} onClick={() => { setStyle('solid'); setActiveCategory('all'); }}>
          Solid
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search icons... (e.g. arrow, check, user)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          marginBottom: 16,
          border: '1px solid #ddd',
          borderRadius: 8,
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {style === 'solid' && !solidData ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
          Solid 아이콘이 아직 준비되지 않았습니다.<br />
          <span style={{ fontSize: 13 }}><code>node scripts/sync-icons.js --solid</code>을 실행해 Figma에서 동기화하세요.</span>
        </div>
      ) : (
        <>
          {/* Category tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #ddd',
                background: activeCategory === 'all' ? '#111' : '#fff',
                color: activeCategory === 'all' ? '#fff' : '#666',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              All ({allIcons.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid #ddd',
                  background: activeCategory === cat ? '#111' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#666',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {cat} ({data[cat].length})
              </button>
            ))}
          </div>

          {/* Results count */}
          <div style={{ marginBottom: 16, fontSize: 13, color: '#999' }}>
            {filtered.length} icons
          </div>

          {/* Icon grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>No icons found.</div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: 8,
              }}
            >
              {filtered.map((icon) => (
                <IconCard key={icon.name} icon={icon} basePath={basePath} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
