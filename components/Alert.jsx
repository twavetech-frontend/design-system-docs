import React, { useState } from 'react';
import styles from './Alert.module.css';

const COLOR_CLASS = {
  default: styles['color-default'],
  brand: styles['color-brand'],
  gray: styles['color-gray'],
  error: styles['color-error'],
  warning: styles['color-warning'],
  success: styles['color-success'],
};

const SIZE_CLASS = {
  floating: styles['size-floating'],
  'full-width': styles['size-full-width'],
};

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8.33" />
      <path d="M10 13.33V10M10 6.67h.01" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 7.5v3.33M10 14.17h.01" />
      <path d="M8.58 3.21 1.52 15a1.67 1.67 0 0 0 1.43 2.5h14.12A1.67 1.67 0 0 0 18.5 15L11.43 3.21a1.67 1.67 0 0 0-2.85 0z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8.33" />
      <path d="M6.67 10 9.17 12.5l4.16-5" />
    </svg>
  );
}

function XCloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5 5 15M5 5l10 10" />
    </svg>
  );
}

const DEFAULT_ICON_FOR = {
  default: <InfoIcon />,
  brand: <InfoIcon />,
  gray: <InfoIcon />,
  error: <AlertTriangleIcon />,
  warning: <AlertTriangleIcon />,
  success: <CheckCircleIcon />,
};

export function Alert({
  color = 'default',
  size = 'floating',
  title,
  description,
  icon,
  actions,
  dismissible = true,
  onDismiss,
  className = '',
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const handleClose = () => {
    setOpen(false);
    onDismiss?.();
  };

  const finalIcon = icon ?? DEFAULT_ICON_FOR[color] ?? <InfoIcon />;

  const wrapperClasses = [
    styles.alert,
    COLOR_CLASS[color] || COLOR_CLASS.default,
    SIZE_CLASS[size] || SIZE_CLASS.floating,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} role="alert">
      <div className={styles.inner}>
        <span className={styles['featured-icon']} aria-hidden="true">
          {finalIcon}
        </span>

        <div className={styles.content}>
          <div className={styles['text-wrap']}>
            {title && <p className={styles.title}>{title}</p>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>

        {dismissible && (
          <button type="button" className={styles['close-button']} onClick={handleClose} aria-label="닫기">
            <XCloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}
