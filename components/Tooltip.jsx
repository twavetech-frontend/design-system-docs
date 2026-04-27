import React, { useState } from 'react';
import styles from './Tooltip.module.css';

const PLACEMENT_CLASS = {
  top: styles['placement-top'],
  'top-start': styles['placement-top-start'],
  'top-end': styles['placement-top-end'],
  bottom: styles['placement-bottom'],
  'bottom-start': styles['placement-bottom-start'],
  'bottom-end': styles['placement-bottom-end'],
  left: styles['placement-left'],
  right: styles['placement-right'],
};

export function Tooltip({
  children,
  title,
  description,
  placement = 'top',
  arrow = true,
  open: controlledOpen,
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isOpen = controlledOpen ?? (hovered || focused);

  const placementClass = PLACEMENT_CLASS[placement] || PLACEMENT_CLASS.top;
  const tooltipClasses = [
    styles.tooltip,
    placementClass,
    isOpen && styles.open,
    description && styles['has-description'],
    !arrow && styles['no-arrow'],
  ].filter(Boolean).join(' ');

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
      <span className={tooltipClasses} role="tooltip" aria-hidden={!isOpen}>
        <span className={styles.content}>
          {title && <span className={styles.title}>{title}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </span>
        {arrow && <span className={styles.arrow} aria-hidden="true" />}
      </span>
    </span>
  );
}
