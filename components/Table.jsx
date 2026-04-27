import React, { useState } from 'react';
import styles from './Table.module.css';

const SIZE_CLASS = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
};

const BADGE_VARIANT = {
  gray: styles['badge-gray'],
  success: styles['badge-success'],
  warning: styles['badge-warning'],
  error: styles['badge-error'],
  brand: styles['badge-brand'],
  info: styles['badge-info'],
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="m3 7 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" />
    </svg>
  );
}

function ChevronSelector() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
    </svg>
  );
}

function Checkbox({ checked, indeterminate, onChange, ariaLabel }) {
  const cls = [
    styles.checkbox,
    (checked || indeterminate) && styles['checkbox-checked'],
  ].filter(Boolean).join(' ');

  return (
    <span
      className={cls}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : !!checked}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange?.();
        }
      }}
    >
      {indeterminate ? <MinusIcon /> : checked ? <CheckIcon /> : null}
    </span>
  );
}

export function StatusBadge({ children, variant = 'gray', dot = true }) {
  return (
    <span className={`${styles.badge} ${BADGE_VARIANT[variant] || BADGE_VARIANT.gray}`}>
      {dot && <span className={styles['badge-dot']} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Table({
  columns = [],
  data = [],
  size = 'md',
  selectable = false,
  onSelect,
  emptyText = '데이터가 없습니다.',
  className = '',
}) {
  const [selected, setSelected] = useState(new Set());

  const toggleAll = () => {
    let next;
    if (selected.size === data.length) {
      next = new Set();
    } else {
      next = new Set(data.map((_, i) => i));
    }
    setSelected(next);
    onSelect?.(Array.from(next));
  };

  const toggleRow = (i) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
    onSelect?.(Array.from(next));
  };

  const allSelected = data.length > 0 && selected.size === data.length;
  const someSelected = selected.size > 0 && selected.size < data.length;

  const wrapperClasses = [
    styles.wrapper,
    SIZE_CLASS[size] || SIZE_CLASS.md,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {selectable && (
                <th className={`${styles.th} ${styles['col-checkbox']}`}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    ariaLabel="모두 선택"
                  />
                </th>
              )}
              {columns.map((col, i) => {
                const align = col.align || 'left';
                return (
                  <th
                    key={col.key || i}
                    className={styles.th}
                    style={{ textAlign: align, width: col.width }}
                  >
                    <span className={`${styles['th-label']} ${styles[`align-${align}`]}`}>
                      {col.header}
                      {col.sort === 'asc' && <ArrowUp />}
                      {col.sort === 'desc' && <ArrowDown />}
                      {col.sort === 'none' && <ChevronSelector />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.empty}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, ri) => {
                const isSelected = selected.has(ri);
                return (
                  <tr key={row.id ?? ri} className={`${styles.tr} ${isSelected ? styles.selected : ''}`}>
                    {selectable && (
                      <td className={`${styles.td} ${styles['col-checkbox']}`}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRow(ri)}
                          ariaLabel={`${ri + 1}번 행 선택`}
                        />
                      </td>
                    )}
                    {columns.map((col, ci) => {
                      const align = col.align || 'left';
                      const value = col.render ? col.render(row, ri) : row[col.key];
                      return (
                        <td
                          key={col.key || ci}
                          className={styles.td}
                          style={{ textAlign: align }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UserCell({ src, name, email, initials, avatarSize }) {
  const initialsText = initials || (name ? name.trim().slice(0, 2) : '');
  const finalSize = avatarSize || 32;
  return (
    <div className={styles['user-cell']}>
      <span className={styles['user-avatar']} style={{ width: finalSize, height: finalSize }}>
        {src ? (
          <img src={src} alt={name || ''} />
        ) : (
          <span className={styles['user-initials']}>{initialsText}</span>
        )}
      </span>
      <span className={styles['user-text']}>
        {name && <span className={styles['user-name']}>{name}</span>}
        {email && <span className={styles['user-email']}>{email}</span>}
      </span>
    </div>
  );
}
