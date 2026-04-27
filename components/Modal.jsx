import React from 'react';
import styles from './Modal.module.css';

const VARIANT_CLASS = {
  default: styles['variant-default'],
  warning: styles['variant-warning'],
  destructive: styles['variant-destructive'],
};

const TYPE_CLASS = {
  horizontal: styles['type-horizontal'],
  stacked: styles['type-stacked'],
  centered: styles['type-centered'],
};

const DEFAULT_ICONS = {
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  ),
  destructive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
};

export function Modal({
  type = 'horizontal',
  variant = 'default',
  icon,
  title = '모달 제목',
  description = '모달 설명 텍스트가 여기에 표시됩니다.',
  showClose = true,
  showCheckbox = false,
  checkboxLabel = '다시 보지 않기',
  checkboxChecked = false,
  cancelText = '취소',
  confirmText = '확인',
  actions = 'horizontal',
  showOverlay = false,
  onClose,
  onCancel,
  onConfirm,
}) {
  const containerClasses = [
    styles.container,
    showOverlay && styles['has-overlay'],
  ].filter(Boolean).join(' ');

  const modalClasses = [
    styles.modal,
    TYPE_CLASS[type] || TYPE_CLASS.horizontal,
    VARIANT_CLASS[variant] || VARIANT_CLASS.default,
  ].filter(Boolean).join(' ');

  const actionsClasses = [
    styles['actions-content'],
    actions === 'vertical' && styles['actions-vertical'],
  ].filter(Boolean).join(' ');

  const featuredIcon = icon || DEFAULT_ICONS[variant] || DEFAULT_ICONS.default;
  const isDestructive = variant === 'destructive';

  return (
    <div className={containerClasses}>
      {showOverlay && <div className={styles.overlay} />}

      <div className={modalClasses}>
        <div className={styles.header}>
          <div className={styles['header-content']}>
            <div className={styles['featured-icon']}>{featuredIcon}</div>

            <div className={styles['header-text']}>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
          </div>

          {showClose && (
            <button
              type="button"
              className={styles['close-button']}
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.actions}>
          <div className={actionsClasses}>
            {showCheckbox && (
              <div className={styles.checkbox}>
                <span
                  className={`${styles['checkbox-input']} ${checkboxChecked ? styles['checkbox-checked'] : ''}`}
                  role="checkbox"
                  aria-checked={checkboxChecked}
                >
                  {checkboxChecked && (
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.5L5 9l4.5-5" />
                    </svg>
                  )}
                </span>
                <span className={styles['checkbox-label']}>{checkboxLabel}</span>
              </div>
            )}

            <div className={styles['action-buttons']}>
              <button type="button" className={styles['btn-secondary']} onClick={onCancel}>
                {cancelText}
              </button>
              <button
                type="button"
                className={isDestructive ? styles['btn-destructive'] : styles['btn-primary']}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
