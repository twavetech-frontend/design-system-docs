import React, { useState } from 'react';
import styles from './Notification.module.css';

const TYPE_CLASS = {
  primary: styles['type-primary'],
  success: styles['type-success'],
  warning: styles['type-warning'],
  error: styles['type-error'],
  gray: styles['type-gray'],
  avatar: styles['type-avatar'],
  'no-icon': styles['type-no-icon'],
};

function SolidInfoCircle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm1.25 10.5h-2.5v-6.5h2.5v6.5z"
      />
    </svg>
  );
}

function SolidCheckCircle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14.41-3.71-3.7 1.42-1.42L11 13.59l5.29-5.3 1.42 1.42L11 16.41z"
      />
    </svg>
  );
}

function SolidAlertTriangle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.13 3.21 2.36 18a1 1 0 0 0 .87 1.5h17.54a1 1 0 0 0 .87-1.5L12.87 3.21a1 1 0 0 0-1.74 0zM13 16.5h-2v-2h2v2zm0-4h-2v-5h2v5z"
      />
    </svg>
  );
}

function SolidXCircle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 13.3-1.4 1.4L12 13.4l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4L12 10.6l2.9-2.9 1.4 1.4-2.9 2.9 2.9 2.9z"
      />
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

const DEFAULT_ICON = {
  primary: <SolidInfoCircle />,
  success: <SolidCheckCircle />,
  warning: <SolidAlertTriangle />,
  error: <SolidXCircle />,
  gray: <SolidInfoCircle />,
};

export function Notification({
  type = 'primary',
  title,
  description,
  icon,
  avatarSrc,
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

  const wrapperClasses = [
    styles.notification,
    TYPE_CLASS[type] || TYPE_CLASS.primary,
    className,
  ].filter(Boolean).join(' ');

  const iconNode = icon ?? DEFAULT_ICON[type];

  return (
    <div className={wrapperClasses} role="status">
      <div className={styles.body}>
        {type === 'avatar' && avatarSrc && (
          <span className={styles.avatar}>
            <img src={avatarSrc} alt="" />
          </span>
        )}
        {type !== 'avatar' && type !== 'no-icon' && iconNode && (
          <span className={styles.icon} aria-hidden="true">{iconNode}</span>
        )}

        <div className={styles.content}>
          <div className={styles['text-wrap']}>
            {title && <p className={styles.title}>{title}</p>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>

      {dismissible && (
        <button type="button" className={styles['close-button']} onClick={handleClose} aria-label="닫기">
          <XCloseIcon />
        </button>
      )}
    </div>
  );
}
