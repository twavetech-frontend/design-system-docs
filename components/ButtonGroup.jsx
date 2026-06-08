'use client';
import React from 'react';
import styles from './ButtonGroup.module.css';

export function ButtonGroupItem({
  children,
  current = false,
  state = 'default',
  iconOnly = false,
  disabled = false,
  icon,
  dot = false,
  ...props
}) {
  const classes = [styles.item];
  if (current) classes.push(styles.current);
  if (iconOnly) classes.push(styles['icon-only']);
  if (state === 'hover') classes.push(styles['force-hover']);
  if (state === 'focused') classes.push(styles['force-focused']);
  if (state === 'disabled') classes.push(styles['force-disabled']);

  const isDisabled = disabled || state === 'disabled';

  return (
    <button className={classes.join(' ')} disabled={isDisabled} {...props}>
      {dot && <span className={`${styles.dot} ${isDisabled ? styles['dot-disabled'] : ''}`} />}
      {icon === 'circle' && <span className={styles['circle-icon']} />}
      {icon === 'left-arrow' && (
        <span className={styles['arrow-icon']}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.833 10H4.167M4.167 10l5 5M4.167 10l5-5" />
          </svg>
        </span>
      )}
      {icon === 'plus' && (
        <span className={styles['arrow-icon']}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4.167v11.666M4.167 10h11.666" />
          </svg>
        </span>
      )}
      {icon === 'right-arrow' && (
        <span className={styles['arrow-icon']}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.167 10h11.666M15.833 10l-5 5M15.833 10l-5-5" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}

export function ButtonGroup({ children }) {
  return (
    <div className={styles['button-group']}>
      {children}
    </div>
  );
}
