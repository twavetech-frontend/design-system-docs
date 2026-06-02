import React, { useState } from 'react';
import styles from './TabBar.module.css';

/* ── Tab icons — vector paths exported from Figma `Tab bar` ──
   stroke = currentColor (탭의 활성/비활성 색을 따름),
   accent = 선택 시 브랜드 색으로 강조되는 부분 ── */

const BRAND = 'var(--colors-brand-500, #7700ff)';

const HomeIcon = ({ active }) => {
  const accent = active ? BRAND : 'currentColor';
  return (
    <svg className={styles.svg} viewBox="0 -1.625 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.40462 10.0313C2.19975 10.0313 1.62539 8.54901 2.51566 7.73714L9.56813 1.30577C10.3794 0.565968 11.6206 0.565969 12.4319 1.30577L19.4843 7.73714C20.3746 8.54901 19.8002 10.0313 18.5954 10.0313C18.3525 10.0313 18.1556 10.2281 18.1556 10.471V17.2917C18.1556 17.6829 17.8385 18 17.4473 18H4.55272C4.16152 18 3.84439 17.6829 3.84439 17.2917V10.471C3.84439 10.2281 3.6475 10.0313 3.40462 10.0313Z"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 15V12.5C13.5 11.1193 12.3807 10 11 10C9.61929 10 8.5 11.1193 8.5 12.5V15"
        stroke={accent}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CommunityIcon = ({ active }) => {
  const accent = active ? BRAND : 'currentColor';
  return (
    <svg className={styles.svg} viewBox="0 -2.5 23.5 23.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.75 2.75C0.75 1.64543 1.64543 0.75 2.75 0.75H16.75C17.8546 0.75 18.75 1.64543 18.75 2.75V10.75C18.75 11.8546 17.8546 12.75 16.75 12.75H2.75C1.64543 12.75 0.75 11.8546 0.75 10.75V2.75Z"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 5.75H20.75C21.8546 5.75 22.75 6.64543 22.75 7.75V15.75C22.75 16.8546 21.8546 17.75 20.75 17.75H6.75C5.64543 17.75 4.75 16.8546 4.75 15.75V12.75"
        strokeLinejoin="round"
      />
      <path d="M3.75 4.125H9.75" stroke={accent} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.75 7.125H6.75" stroke={accent} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StageIcon = ({ active }) => {
  const accent = active ? BRAND : 'currentColor';
  return (
    <svg className={styles.svg} viewBox="0 0 19 19" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="0.75" y="0.75" width="7.5" height="7.5" rx="1.875" stroke={accent} />
      <rect x="10.75" y="0.75" width="7.5" height="7.5" rx="1.875" />
      <rect x="0.75" y="10.75" width="7.5" height="7.5" rx="1.875" />
      <rect x="10.75" y="10.75" width="7.5" height="7.5" rx="1.875" />
    </svg>
  );
};

const LoungeIcon = ({ active }) =>
  active ? (
    <svg className={styles.svg} viewBox="0 0 20 20" fill="none">
      <path
        d="M15.5794 16.767H4.09267C3.89126 16.767 3.72804 16.6079 3.72804 16.4116V8.44794C3.72804 4.97908 6.55121 2.16698 10.0339 2.16698C13.5165 2.16698 15.9441 4.97908 15.9441 8.44794V7.97196C15.944 3.56916 12.3749 0 7.97207 0C3.56927 0 0 3.56916 0 7.97207V19.4855C0 19.7696 0.230353 20 0.514504 20H15.9441V16.7708L15.5795 16.7671L15.5794 16.767Z"
        fill="url(#tabLoungeGrad)"
      />
      <path
        d="M19.9257 12.3307C16.7009 11.8274 16.506 11.6326 16.0026 8.40763C15.9871 8.30857 15.8444 8.30857 15.8291 8.40763C15.3273 11.6324 15.1324 11.8273 11.9076 12.3305C11.8086 12.346 11.8086 12.4887 11.9076 12.5041C15.1324 13.006 15.3272 13.2007 15.8291 16.4255C15.8446 16.5246 15.9871 16.5247 16.0026 16.4255C16.506 13.2007 16.7007 13.0058 19.9257 12.5041C20.0247 12.4886 20.0249 12.346 19.9257 12.3305V12.3307Z"
        fill={BRAND}
      />
      <defs>
        <linearGradient id="tabLoungeGrad" x1="0" y1="10" x2="15.9441" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0.4" stopColor="#5F2EFF" />
          <stop offset="1" stopColor="#8C2EFF" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg className={styles.svg} viewBox="0 0 21.2 21.2" fill="none" stroke="currentColor">
      <path
        d="M16.5441 8.57196C16.544 4.16916 12.9749 0.6 8.57207 0.6C4.16927 0.6 0.6 4.16916 0.6 8.57208V20.0855C0.6 20.3696 0.830353 20.6 1.1145 20.6H16.5441C16.5441 19.5372 16.5441 18.5532 16.5441 17.6"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <path
        d="M20.5257 12.9307C17.3009 12.4274 17.106 12.2326 16.6026 9.00763C16.5871 8.90857 16.4444 8.90857 16.4291 9.00763C15.9273 12.2324 15.7324 12.4273 12.5076 12.9305C12.4086 12.946 12.4086 13.0887 12.5076 13.1041C15.7324 13.606 15.9272 13.8007 16.4291 17.0255C16.4446 17.1246 16.5871 17.1247 16.6026 17.0255C17.106 13.8007 17.3007 13.6058 20.5257 13.1041C20.6247 13.0886 20.6249 12.9462 20.5257 12.9307Z"
        strokeWidth="1.2"
      />
    </svg>
  );

const MyIcon = ({ active }) => {
  const accent = active ? BRAND : 'currentColor';
  return (
    <svg className={styles.svg} viewBox="0 -0.7879 21.0757 21.0757" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.62098 18.75C1.46678 18.75 0.508084 17.8545 0.804623 16.7391C1.39522 14.5175 3.46592 11.25 10.5379 11.25C17.6098 11.25 19.6805 14.5175 20.2711 16.7391C20.5677 17.8545 19.609 18.75 18.4548 18.75H2.62098Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.5379" cy="4.75" r="4" stroke={accent} />
    </svg>
  );
};

const ICONS = {
  home: HomeIcon,
  community: CommunityIcon,
  stage: StageIcon,
  lounge: LoungeIcon,
  my: MyIcon,
};

export const defaultTabBarItems = [
  { key: 'home', label: '홈', icon: 'home' },
  { key: 'community', label: '커뮤니티', icon: 'community' },
  { key: 'stage', label: '스테이지', icon: 'stage' },
  { key: 'lounge', label: '라운지', icon: 'lounge' },
  { key: 'my', label: '나', icon: 'my' },
];

export function TabBar({
  items = defaultTabBarItems,
  active = 0,
  onChange,
}) {
  const [activeIndex, setActiveIndex] = useState(active);

  return (
    <nav className={styles.tabBar} role="tablist" aria-label="하단 탭 바">
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const Icon = ICONS[item.icon] || ICONS.home;
        const itemClasses = [styles.item, isActive && styles.active]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={item.key ?? i}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={itemClasses}
            onClick={() => {
              setActiveIndex(i);
              onChange?.(item, i);
            }}
          >
            <span className={styles.icon}>
              <Icon active={isActive} />
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
