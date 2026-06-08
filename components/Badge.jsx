'use client';
import React from 'react';
import styles from './Badge.module.css';

export function Badge({
  children,
  size = 'md',
  color = 'gray',
  type = 'pill',
  icon = false,
  ...props
}) {
  const classes = [
    styles.badge,
    styles[size],
    styles[color],
    type === 'pill' ? styles.pill : styles.rounded,
  ];

  return (
    <span className={classes.join(' ')} {...props}>
      {icon === 'dot' && <span className={styles.dot} />}
      {icon === 'icon' && (
        <span className={styles.icon}>
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.43L6 8.885 2.91 10.5l.59-3.43L1 4.635l3.455-.505L6 1z"
              fill="currentColor"
            />
          </svg>
        </span>
      )}
      {icon === 'circle' && (
        <span className={styles.icon}>
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      )}
      {children}
    </span>
  );
}
