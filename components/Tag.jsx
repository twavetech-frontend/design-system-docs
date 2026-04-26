import React from 'react';
import styles from './Tag.module.css';

export function Tag({
  children,
  size = 'md',
  icon,
  action,
  checkbox = false,
  checked = false,
  onClose,
  onCheck,
  countValue,
  avatarSrc,
  countryCode,
  flagSrc,
  ...props
}) {
  const hasClose = action === 'close';
  const hasCount = action === 'count';
  const hasDot = icon === 'dot';
  const hasAvatar = icon === 'avatar';
  const hasCountry = icon === 'country';

  // Color variant rules:
  // - Brand: no checkbox AND (close or count action)
  // - Checkbox variant: checkbox present
  // - Subtle: default (no checkbox, text-only)
  const isBrand = !checkbox && (hasClose || hasCount);
  const isCheckboxVariant = checkbox;

  const classes = [
    styles.tag,
    styles[size],
    isBrand && styles.brand,
    isCheckboxVariant && styles.checkboxVariant,
    checkbox && styles.hasCheckbox,
    hasDot && styles.hasDot,
    hasAvatar && styles.hasAvatar,
    hasCountry && styles.hasCountry,
    hasClose && styles.hasClose,
    hasCount && styles.hasCount,
  ].filter(Boolean);

  return (
    <span className={classes.join(' ')} {...props}>
      {checkbox && (
        <span
          className={`${styles.checkbox} ${checked ? styles.checked : ''}`}
          onClick={onCheck}
          role="checkbox"
          aria-checked={checked}
        >
          {checked && (
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 6.5L5 9l4.5-5" />
            </svg>
          )}
        </span>
      )}

      {hasDot && <span className={styles.dot} />}

      {hasAvatar && (
        <span className={styles.avatar}>
          {avatarSrc && (
            <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </span>
      )}

      {hasCountry && (
        <span className={styles.country}>
          {flagSrc ? (
            <img src={flagSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            countryCode || ''
          )}
        </span>
      )}

      {children}

      {hasCount && (
        <span className={styles.count}>{countValue ?? 5}</span>
      )}

      {hasClose && (
        <button className={styles.close} onClick={onClose} aria-label="Remove" type="button">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3L3 9M3 3l6 6" />
          </svg>
        </button>
      )}
    </span>
  );
}
