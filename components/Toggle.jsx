import React from 'react';
import styles from './Toggle.module.css';

export function Toggle({
  type = 'default',
  size = 'md',
  pressed = false,
  state = 'default',
  label,
  description,
}) {
  const toggleClasses = [
    styles[`size-${size}`],
    type === 'slim' && styles.slim,
    pressed && styles.pressed,
    state === 'hover' && styles.hover,
    state === 'focus' && styles.focus,
    state === 'disabled' && styles.disabled,
  ].filter(Boolean).join(' ');

  const hasText = label || description;

  if (hasText) {
    return (
      <div className={`${styles.wrapper} ${state === 'disabled' ? styles.disabled : ''}`}>
        <div className={toggleClasses}>
          <div className={styles.track}>
            <div className={styles.thumb} />
          </div>
        </div>
        <div className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={toggleClasses}>
      <div className={styles.track}>
        <div className={styles.thumb} />
      </div>
    </div>
  );
}
