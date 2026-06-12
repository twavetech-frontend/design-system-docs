'use client';
import React from 'react';
import styles from './Divider.module.css';

/* ===========================
   Inline icons (Figma source: untitledui icon set)
   =========================== */

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 4.167v11.666M4.167 10h11.666" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15.833 10H4.167m0 0L10 15.833M4.167 10 10 4.167" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833" />
  </svg>
);

const DEFAULT_GROUP_ITEMS = [
  { icon: <ArrowLeftIcon /> },
  { icon: <PlusIcon /> },
  { icon: <ArrowRightIcon /> },
];

/* ===========================
   Divider
   ---------------------------
   Figma: Base components/Divider (1252:126874)
   Variants:
   - type:    line | text | heading | button | button-icon | button-group
   - variant: single (Single line) | dual (Dual line) | fill (Background fill)
   =========================== */

function CenterContent({ type, label, icon, items, onClick }) {
  switch (type) {
    case 'text':
      return <span className={styles.text}>{label}</span>;
    case 'heading':
      return <span className={styles.heading}>{label}</span>;
    case 'button':
      return (
        <button type="button" className={styles.button} onClick={onClick}>
          {label}
        </button>
      );
    case 'button-icon':
      return (
        <button type="button" className={styles['button-icon']} aria-label={label || 'action'} onClick={onClick}>
          <span className={styles.icon}>{icon || <PlusIcon />}</span>
        </button>
      );
    case 'button-group': {
      const groupItems = items?.length ? items : DEFAULT_GROUP_ITEMS;
      return (
        <span className={styles['button-group']}>
          {groupItems.map((item, i) => (
            <button key={i} type="button" className={styles['group-item']} aria-label={item.ariaLabel} onClick={item.onClick}>
              {item.icon ? <span className={styles.icon}>{item.icon}</span> : item.label}
            </button>
          ))}
        </span>
      );
    }
    default:
      return null;
  }
}

export function Divider({
  type = 'line',
  variant = 'single',
  label,
  icon,
  items,
  onClick,
  ...props
}) {
  if (type === 'line') {
    return <div className={styles.line} role="separator" {...props} />;
  }

  const content = <CenterContent type={type} label={label} icon={icon} items={items} onClick={onClick} />;

  if (variant === 'dual') {
    return (
      <div className={`${styles.dual}`} role="separator" {...props}>
        {content}
      </div>
    );
  }

  if (variant === 'fill') {
    return (
      <div className={`${styles.fill}`} role="separator" {...props}>
        {content}
      </div>
    );
  }

  return (
    <div className={styles.single} role="separator" {...props}>
      <span className={styles.line} />
      {content}
      <span className={styles.line} />
    </div>
  );
}
