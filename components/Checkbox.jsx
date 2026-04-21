import React from 'react';
import styles from './Checkbox.module.css';

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IndeterminateIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Checkbox({
  type = 'checkbox',
  size = 'sm',
  checked = false,
  indeterminate = false,
  state = 'default',
  label,
  description,
}) {
  const isChecked = checked || indeterminate;
  const isRadio = type === 'radio';

  const controlClasses = [
    styles.control,
    styles[`size-${size}`],
    isRadio ? styles.radio : styles.checkbox,
    isChecked && styles.checked,
    state === 'hover' && styles.hover,
    state === 'focus' && styles.focus,
    state === 'disabled' && styles.disabled,
  ].filter(Boolean).join(' ');

  const hasText = label || description;

  const control = (
    <div className={controlClasses}>
      {isRadio && isChecked && <div className={styles.radioDot} />}
      {!isRadio && isChecked && (
        <span className={styles.icon}>
          {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
        </span>
      )}
    </div>
  );

  if (hasText) {
    return (
      <div className={`${styles.wrapper} ${state === 'disabled' ? styles.wrapperDisabled : ''}`}>
        {control}
        <div className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      </div>
    );
  }

  return control;
}
