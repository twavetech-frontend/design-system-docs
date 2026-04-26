import React from 'react';
import styles from './Link.module.css';

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 9 9" width="9" height="9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M2.25 2.25h4.5v4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 2.25l-4.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Link({
  color = 'brand',
  size = 'md',
  state = 'default',
  showIcon = true,
  href = '#',
  children = 'Click to Download',
  destructive = false,
  ...props
}) {
  const classes = [
    styles.link,
    styles[`size-${size}`],
    destructive ? styles['color-destructive'] : styles[`color-${color}`],
  ];

  if (state === 'hover') classes.push(styles['force-hover']);
  if (state === 'focused') classes.push(styles['force-focused']);
  if (state === 'disabled') classes.push(styles['force-disabled']);

  return (
    <a
      className={classes.join(' ')}
      href={href}
      aria-disabled={state === 'disabled' || undefined}
      onClick={(e) => {
        if (state === 'disabled') e.preventDefault();
        props.onClick?.(e);
      }}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      {showIcon && (
        <span className={styles['icon-container']}>
          <span className={styles.icon}>
            <ExternalLinkIcon />
          </span>
        </span>
      )}
    </a>
  );
}
