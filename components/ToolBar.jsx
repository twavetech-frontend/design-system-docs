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

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
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
   Figma: Tool Bar (17696:32070) — 2026-06 업데이트
   View 변형: Home | Detail | Join | Search
   - Home: 로고 + 우측 액션 버튼
   - Detail: 뒤로 가기 + 타이틀(좌측 정렬, 옵션 카운트) + 우측 액션 버튼
   - Join: 뒤로 가기 + 타이틀 + 진행 인디케이터(스텝 바)
   - Search: 뒤로 가기 + 검색 인풋
   높이 52px (Search 56px), padding 8px 16px
   =========================== */

const BackButton = ({ onBack }) => (
  <button type="button" className={styles['back-button']} aria-label="뒤로 가기" onClick={onBack}>
    <span className={styles.icon}><ChevronLeftIcon /></span>
  </button>
);

export function ToolBar({
  type = 'home',
  title,
  count,
  actions = [{}, {}],
  progress = 0.5,
  placeholder = '검색어를 입력하세요',
  logo,
  onBack,
  ...props
}) {
  const isSearch = type === 'search';

  // Search: 뒤로 가기 + 검색 인풋 (인풋이 남은 너비를 채움)
  if (isSearch) {
    return (
      <div className={`${styles.toolbar} ${styles.search}`} {...props}>
        <BackButton onBack={onBack} />
        <div className={styles['search-input']}>
          <span className={styles['search-icon']}><SearchIcon /></span>
          <input type="text" className={styles['search-field']} placeholder={placeholder} />
        </div>
      </div>
    );
  }

  // 우측 영역: Join 은 진행 인디케이터, 그 외(Home/Detail)는 액션 버튼
  const right =
    type === 'join' ? (
      <div className={styles.indicator}>
        <div className={styles['indicator-fill']} style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
    ) : (
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
    );

  // 좌측 영역: Home 은 로고, 그 외는 뒤로 가기 + 타이틀(+카운트)
  const left =
    type === 'home' ? (
      logo || <IminLogo />
    ) : (
      <div className={styles['title-group']}>
        <BackButton onBack={onBack} />
        {title && <span className={styles.title}>{title}</span>}
        {count != null && <span className={styles.count}>{count}</span>}
      </div>
    );

  return (
    <div className={styles.toolbar} {...props}>
      {left}
      {right}
    </div>
  );
}
