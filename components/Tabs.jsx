'use client';
import React from 'react';
import styles from './Tabs.module.css';

const TYPE_CLASS_MAP = {
  'button-brand': styles['type-button-brand'],
  'button-gray': styles['type-button-gray'],
  'button-border': styles['type-button-border'],
  'underline': styles['type-underline'],
  'button-minimal': styles['type-button-minimal'],
  'line': styles['type-line'],
};

export function Tabs({
  items = [],
  type = 'button-brand',
  size = 'sm',
  fullWidth = false,
  vertical = false,
}) {
  const containerClasses = [
    vertical ? styles.vertical : (fullWidth ? styles['tabs-full'] : styles.tabs),
    TYPE_CLASS_MAP[type] || '',
    styles[`size-${size}`],
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {items.map((item, i) => {
        const tabClasses = [
          styles.tab,
          item.current && styles.current,
        ].filter(Boolean).join(' ');

        return (
          <button key={i} className={tabClasses} type="button">
            {item.label}
            {item.badge !== undefined && (
              <span className={styles['tab-badge']}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
