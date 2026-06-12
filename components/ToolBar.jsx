'use client';
import React from 'react';
import styles from './ToolBar.module.css';

/* ===========================
   Inline icons (Figma source: untitledui icon set)
   =========================== */

const ChatCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21c5 0 9-4 9-9s-4-9-9-9-9 4-9 9c0 1.6.4 3.1 1.2 4.4.2.3.3.5.2.8l-.8 2.6c-.2.6.4 1.2 1 1l2.6-.8c.3-.1.5 0 .8.2A8.96 8.96 0 0 0 12 21z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

/* imin 로고 (약식 — 심볼 + 워드마크) */
const IminLogo = () => (
  <span className={styles.logo} aria-label="imin">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="4.4" fill="#9b55ff" />
      <circle cx="16" cy="8" r="4.4" fill="#7700ff" />
      <circle cx="8" cy="16" r="4.4" fill="#7700ff" />
      <circle cx="16" cy="16" r="4.4" fill="#340078" />
    </svg>
    <span className={styles['logo-text']}>imin</span>
  </span>
);

/* ===========================
   ToolBar
   ---------------------------
   Figma: Base components/Tool Bar (17696:32070)
   Variants:
   - type: home | detail
   하위 컴포넌트:
   - _button top sets: 1/2/3 Symbol, Back Button
   - _button_type: Icon | Text
   =========================== */

export function ToolBar({
  type = 'home',
  title,
  actions = [{}, {}],
  logo,
  onBack,
  ...props
}) {
  const isDetail = type === 'detail';

  return (
    <div className={`${styles.toolbar} ${isDetail ? styles.detail : ''}`} {...props}>
      {isDetail ? (
        <button type="button" className={styles['back-button']} aria-label="뒤로 가기" onClick={onBack}>
          <span className={styles.icon}><ChevronLeftIcon /></span>
        </button>
      ) : (
        logo || <IminLogo />
      )}

      {isDetail && title && <span className={styles.title}>{title}</span>}

      <div className={styles.actions}>
        {actions.slice(0, 3).map((action, i) =>
          action.label ? (
            <button key={i} type="button" className={styles['text-button']} onClick={action.onClick}>
              {action.label}
            </button>
          ) : (
            <button key={i} type="button" className={styles['icon-button']} aria-label={action.ariaLabel || 'action'} onClick={action.onClick}>
              <span className={styles.icon}>{action.icon || <ChatCircleIcon />}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
