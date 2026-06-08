'use client';
import { useState } from 'react';

/* ── Icon SVGs ── */
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Syntax Highlighting ── */
function highlightCode(code) {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    const tokens = [];
    const regex = /(<\/?)([\w.-]+)|(\w+)(=)|("[^"]*"|'[^']*'|{`[^`]*`})|(\/\/.*$)|(import|from|export|const|let|var|return|function|true|false|null|undefined)(?=\s|$|[;,)}])/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', value: line.slice(lastIndex, match.index) });
      }
      if (match[1] && match[2]) {
        tokens.push({ type: 'text', value: match[1] });
        tokens.push({ type: 'tag', value: match[2] });
      } else if (match[3] && match[4]) {
        tokens.push({ type: 'attr', value: match[3] });
        tokens.push({ type: 'text', value: match[4] });
      } else if (match[5]) {
        tokens.push({ type: 'string', value: match[5] });
      } else if (match[6]) {
        tokens.push({ type: 'comment', value: match[6] });
      } else if (match[7]) {
        tokens.push({ type: 'keyword', value: match[7] });
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      tokens.push({ type: 'text', value: line.slice(lastIndex) });
    }

    if (tokens.length === 0) {
      return <div key={i} style={{ minHeight: '1.5em' }}>{line || ' '}</div>;
    }

    const colorMap = {
      keyword: '#8b5cf6',
      tag: '#2563eb',
      attr: '#d97706',
      string: '#16a34a',
      comment: '#9ca3af',
      text: '#1f2937',
    };

    return (
      <div key={i} style={{ minHeight: '1.5em' }}>
        {tokens.map((t, j) => (
          <span key={j} style={{ color: colorMap[t.type] || colorMap.text }}>
            {t.value}
          </span>
        ))}
      </div>
    );
  });
}

/* ── Styles ── */
const labelStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '8px',
};

const containerStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '24px',
};

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '4px',
  padding: '8px 12px',
};

const iconBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 6,
  border: '1px solid #e5e7eb',
  background: '#fff',
  cursor: 'pointer',
  color: '#667085',
  transition: 'all 0.15s',
  padding: 0,
};

const pillTabBar = {
  display: 'inline-flex',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  marginLeft: 4,
};

const pillTabBase = {
  padding: '6px 14px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  background: '#fff',
  border: 'none',
  color: '#667085',
  transition: 'all 0.15s',
  lineHeight: '20px',
};

const pillTabActive = {
  ...pillTabBase,
  background: '#344054',
  color: '#fff',
  fontWeight: 600,
};

const previewArea = {
  padding: '40px 24px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  minHeight: 120,
  transition: 'background 0.2s',
};

const codeArea = {
  padding: '20px 24px',
  background: '#fafafa',
  overflow: 'auto',
  fontSize: '13px',
  lineHeight: '1.6',
  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
};

/* ── ComponentPreview ── */
export function ComponentPreview({ children, dark = false, label, direction = 'row', code }) {
  const [tab, setTab] = useState('preview');
  const [isDark, setIsDark] = useState(dark);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard?.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const previewContent = (extraStyle = {}) => (
    <div
      data-theme={isDark ? 'dark' : undefined}
      style={{
        ...previewArea,
        ...extraStyle,
        background: isDark ? '#0f0f1a' : '#fff',
        flexDirection: direction,
        alignItems: direction === 'column' ? 'flex-start' : 'center',
        justifyContent: direction === 'column' ? 'center' : 'center',
      }}
    >
      {children}
    </div>
  );

  if (!code) {
    return (
      <div style={{ marginBottom: '24px' }}>
        {label && <div style={labelStyle}>{label}</div>}
        <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {previewContent({ borderRadius: 12 })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {label && <div style={labelStyle}>{label}</div>}
      <div style={containerStyle}>
        {/* Toolbar */}
        <div style={toolbarStyle}>
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              ...iconBtnStyle,
              background: isDark ? '#f3f4f6' : '#fff',
            }}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          {/* Copy code */}
          <button
            onClick={copyCode}
            style={{
              ...iconBtnStyle,
              color: copied ? '#16a34a' : '#667085',
            }}
            title="Copy code"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          {/* Preview / Code tabs */}
          <div style={pillTabBar}>
            <button
              style={tab === 'preview' ? pillTabActive : pillTabBase}
              onClick={() => setTab('preview')}
            >
              Preview
            </button>
            <button
              style={tab === 'code' ? pillTabActive : pillTabBase}
              onClick={() => setTab('code')}
            >
              Code
            </button>
          </div>
        </div>

        {/* Content */}
        {tab === 'preview' ? (
          previewContent()
        ) : (
          <div style={codeArea}>
            {highlightCode(code.trim())}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── PropsTable ── */
export function PropsTable({ data }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>Prop</th>
            <th style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>Type</th>
            <th style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>Default</th>
            <th style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 12px' }}>
                <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: '#7c3aed' }}>{row.name}</code>
              </td>
              <td style={{ padding: '10px 12px', color: '#6b7280', fontFamily: 'monospace', fontSize: '13px' }}>{row.type}</td>
              <td style={{ padding: '10px 12px' }}>
                <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>{row.default}</code>
              </td>
              <td style={{ padding: '10px 12px', color: '#4b5563' }}>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── StateLabel ── */
export function StateLabel({ children }) {
  return (
    <span style={{
      fontSize: '11px',
      color: '#9ca3af',
      textAlign: 'center',
      display: 'block',
      marginTop: '6px',
    }}>
      {children}
    </span>
  );
}
