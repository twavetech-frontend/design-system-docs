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
  indigo: styles['badge-indigo'],
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

function HelpIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M6.06 6a2 2 0 0 1 3.89.67c0 1.33-2 2-2 2" />
      <path d="M8 11.33h.01" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.33 5v-.67c0-.93 0-1.4-.18-1.75a1.67 1.67 0 0 0-.73-.73c-.35-.18-.82-.18-1.75-.18H9.33c-.93 0-1.4 0-1.75.18-.31.16-.57.42-.73.73-.18.35-.18.82-.18 1.75V5M2.5 5h15M15.83 5v9.33c0 1.4 0 2.1-.27 2.64-.24.47-.62.85-1.1 1.09-.53.27-1.23.27-2.63.27H8.67c-1.4 0-2.1 0-2.64-.27a2.5 2.5 0 0 1-1.09-1.1c-.27-.53-.27-1.23-.27-2.63V5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.39 15.1c.04-.36.06-.54.11-.7.05-.15.12-.29.2-.42.1-.15.22-.27.48-.53l9.9-9.9a1.77 1.77 0 0 1 2.5 2.5l-9.9 9.9c-.26.26-.38.38-.53.47-.13.09-.27.16-.42.21-.16.05-.34.07-.7.11l-2.9.33.33-2.9Z" />
    </svg>
  );
}

function DotsVertical() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <circle cx="10" cy="4.5" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="10" cy="15.5" r="1.5" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12 6 8l4-4" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 4 4 4-4 4" />
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
  title,
  count,
  headerActions,
  pagination,
}) {
  const [selected, setSelected] = useState(new Set());
  const hasHeader = title != null || count != null || headerActions != null;
  const showDefaultActions = headerActions === undefined && (title != null || count != null);

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
      {hasHeader && (
        <div className={styles['card-header']}>
          <div className={styles['card-header-text']}>
            {title != null && <span className={styles['card-title']}>{title}</span>}
            {count != null && (
              <span className={`${styles.badge} ${styles['badge-brand']} ${styles['badge-count']}`}>{count}</span>
            )}
          </div>
          {headerActions != null
            ? headerActions
            : showDefaultActions && (
                <button type="button" className={styles['icon-btn']} aria-label="더 보기">
                  <DotsVertical />
                </button>
              )}
        </div>
      )}
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
                      {col.help && <span className={styles['th-help']}><HelpIcon /></span>}
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
                          className={`${styles.td} ${col.muted ? styles['td-muted'] : ''}`}
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
      {pagination && (
        <Pagination
          total={typeof pagination === 'object' ? pagination.total : 10}
          page={typeof pagination === 'object' ? pagination.page : undefined}
        />
      )}
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

// Cycle of badge variants used for multi-badge cells (e.g. Teams column)
const BADGE_CYCLE = ['brand', 'info', 'indigo', 'success', 'warning'];

export function Badges({ items = [], max = 3 }) {
  const list = items.map((it) => (typeof it === 'string' ? { label: it } : it));
  const shown = list.slice(0, max);
  const overflow = list.length - shown.length;
  return (
    <div className={styles['badge-group']}>
      {shown.map((it, i) => (
        <span
          key={it.label + i}
          className={`${styles.badge} ${BADGE_VARIANT[it.variant || BADGE_CYCLE[i % BADGE_CYCLE.length]] || BADGE_VARIANT.gray}`}
        >
          {it.label}
        </span>
      ))}
      {overflow > 0 && (
        <span className={`${styles.badge} ${styles['badge-gray']}`}>+{overflow}</span>
      )}
    </div>
  );
}

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className={styles['row-actions']}>
      <button type="button" className={styles['icon-btn']} aria-label="삭제" onClick={onDelete}>
        <TrashIcon />
      </button>
      <button type="button" className={styles['icon-btn']} aria-label="편집" onClick={onEdit}>
        <EditIcon />
      </button>
    </div>
  );
}

export function Pagination({ total = 10, page: controlledPage, onChange }) {
  const [internal, setInternal] = useState(controlledPage || 1);
  const page = controlledPage || internal;

  const go = (p) => {
    const next = Math.min(Math.max(1, p), total);
    if (!controlledPage) setInternal(next);
    onChange?.(next);
  };

  // Build page list with ellipsis: 1 2 3 … total-2 total-1 total
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i <= 3 || i > total - 3 || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles['page-nav']}
        onClick={() => go(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft />
        <span>Previous</span>
      </button>
      <div className={styles['page-numbers']}>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className={styles['page-ellipsis']}>…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`${styles['page-num']} ${p === page ? styles['page-num-active'] : ''}`}
              onClick={() => go(p)}
            >
              {p}
            </button>
          )
        )}
      </div>
      <button
        type="button"
        className={styles['page-nav']}
        onClick={() => go(page + 1)}
        disabled={page === total}
      >
        <span>Next</span>
        <ChevronRight />
      </button>
    </div>
  );
}
