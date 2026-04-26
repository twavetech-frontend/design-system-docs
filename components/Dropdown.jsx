import React from 'react';
import styles from './Dropdown.module.css';

/* ===========================
   SVG Icons (inline)
   =========================== */

const ChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7.5l5 5 5-5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.667 5L7.5 14.167 3.333 10" />
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="4" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="10" cy="16" r="1.5" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 17.5l-3.625-3.625M14.167 8.333a5.833 5.833 0 1 1-11.667 0 5.833 5.833 0 0 1 11.667 0z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3L3 9M3 3l6 6" />
  </svg>
);

const HelpCircleIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.06 6a2 2 0 0 1 3.886.667c0 1.333-2 2-2 2M8 11.333h.007m6.66-3.333a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.334 0z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.667 5.833l7.133 4.988c.387.27.58.406.792.458.187.046.383.046.57 0 .212-.052.405-.188.792-.458l7.133-4.988M5.667 16.667h8.666c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.093-1.092c.272-.535.272-1.235.272-2.635V7.333c0-1.4 0-2.1-.272-2.635a2.5 2.5 0 0 0-1.093-1.092c-.535-.273-1.235-.273-2.635-.273H5.667c-1.4 0-2.1 0-2.635.273a2.5 2.5 0 0 0-1.093 1.092c-.272.535-.272 1.235-.272 2.635v5.334c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.092c.535.273 1.235.273 2.635.273z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.53 1.864c.154-.462.231-.692.352-.769a.417.417 0 0 1 .236-.074c.144 0 .296.183.6.55l2.878 3.468c.068.082.102.123.144.152a.417.417 0 0 0 .126.06c.049.013.102.013.207.013h4.508c.562 0 .843 0 .962.1a.417.417 0 0 1 .146.221c.025.13-.1.28-.348.582l-2.872 3.476c-.066.08-.1.12-.12.165a.417.417 0 0 0-.032.137c-.002.05.01.102.034.206l1.167 4.47c.142.546.214.819.14.955a.417.417 0 0 1-.19.183c-.14.068-.4-.027-.92-.218l-4.368-1.6c-.1-.036-.15-.054-.201-.061a.417.417 0 0 0-.114 0c-.052.007-.102.025-.201.06l-4.37 1.601c-.52.19-.779.286-.919.218a.417.417 0 0 1-.19-.183c-.073-.136-.002-.41.14-.955l1.168-4.47c.025-.104.037-.156.034-.206a.416.416 0 0 0-.032-.137c-.019-.045-.053-.085-.12-.165L3.73 6.267c-.25-.301-.374-.452-.349-.582a.417.417 0 0 1 .146-.221c.12-.1.4-.1.962-.1h4.508c.106 0 .158 0 .207-.013a.417.417 0 0 0 .126-.06c.042-.03.076-.07.144-.152L12.35 1.67" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    <path d="M15.606 12.273a1.25 1.25 0 0 0 .25 1.378l.045.046a1.515 1.515 0 1 1-2.143 2.143l-.045-.046a1.25 1.25 0 0 0-1.378-.25 1.25 1.25 0 0 0-.758 1.144v.129a1.515 1.515 0 1 1-3.03 0v-.068a1.25 1.25 0 0 0-.819-1.144 1.25 1.25 0 0 0-1.378.25l-.046.046a1.515 1.515 0 1 1-2.143-2.143l.046-.046a1.25 1.25 0 0 0 .25-1.378 1.25 1.25 0 0 0-1.144-.757h-.13a1.515 1.515 0 0 1 0-3.03h.069a1.25 1.25 0 0 0 1.144-.819 1.25 1.25 0 0 0-.25-1.378l-.046-.045a1.515 1.515 0 1 1 2.143-2.143l.046.045a1.25 1.25 0 0 0 1.378.25h.06a1.25 1.25 0 0 0 .759-1.143v-.13a1.515 1.515 0 0 1 3.03 0v.069a1.25 1.25 0 0 0 .758 1.144 1.25 1.25 0 0 0 1.378-.25l.045-.046a1.515 1.515 0 1 1 2.143 2.143l-.045.046a1.25 1.25 0 0 0-.25 1.378v.06a1.25 1.25 0 0 0 1.143.759h.13a1.515 1.515 0 1 1 0 3.03h-.069a1.25 1.25 0 0 0-1.144.758z" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.667 10l7.77 4.317c.199.11.298.166.404.187a.833.833 0 0 0 .318 0c.106-.021.205-.077.404-.187L18.333 10M1.667 14.167l7.77 4.316c.199.111.298.167.404.188a.833.833 0 0 0 .318 0c.106-.021.205-.077.404-.188l7.77-4.316M1.667 5.833L9.437 1.517c.199-.111.298-.167.404-.188a.833.833 0 0 1 .318 0c.106.021.205.077.404.188l7.77 4.316-7.77 4.317c-.199.11-.298.166-.404.187a.833.833 0 0 1-.318 0c-.106-.021-.205-.077-.404-.187L1.667 5.833z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.333 14c0-.93 0-1.395-.115-1.773a2.667 2.667 0 0 0-1.778-1.778C11.062 10.333 10.597 10.333 9.667 10.333H6.333c-.93 0-1.395 0-1.773.115a2.667 2.667 0 0 0-1.778 1.778C2.667 12.605 2.667 13.07 2.667 14M11 5.333a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.667 1.333 2.413 8.838c-.245.294-.367.44-.369.564a.333.333 0 0 0 .12.264c.095.08.286.08.668.08h5.168l-.667 5.334 6.254-7.505c.245-.294.367-.441.369-.565a.333.333 0 0 0-.12-.264c-.095-.08-.286-.08-.668-.08H8l.667-5.333z" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12.667h4m-6.735-8.98L2.14 4.571c-.225.175-.338.263-.419.373a1 1 0 0 0-.171.352c-.05.133-.05.276-.05.562v6.475c0 .748 0 1.121.145 1.407a1.333 1.333 0 0 0 .583.583c.286.145.66.145 1.407.145h8.667c.747 0 1.12 0 1.407-.145a1.333 1.333 0 0 0 .583-.583c.146-.286.146-.66.146-1.407V5.858c0-.286 0-.429-.05-.562a1 1 0 0 0-.172-.352c-.08-.11-.193-.198-.418-.373l-1.126-.884M10 11.333a2 2 0 1 0-4 0M10.667 3.333 8.477 1.631c-.171-.133-.257-.2-.351-.225a.5.5 0 0 0-.253 0c-.094.025-.18.092-.351.225L5.333 3.333" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.667 14c0-.93 0-1.395-.115-1.773a2.667 2.667 0 0 0-1.778-1.778C12.395 10.333 11.93 10.333 11 10.333M10.667 5.333a3 3 0 0 1 0 5.667M1.333 14c0-.93 0-1.395.115-1.773a2.667 2.667 0 0 1 1.778-1.778c.378-.115.843-.115 1.773-.115h1.334c.93 0 1.395 0 1.773.115a2.667 2.667 0 0 1 1.778 1.778c.115.378.115.843.115 1.773M9.333 5.333a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 10.333H5c-.931 0-1.396 0-1.775.115a2.667 2.667 0 0 0-1.777 1.778C1.333 12.604 1.333 13.07 1.333 14m11.334-4v4m-2-2h4m-3.334-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

const MessageSmileIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9.333s.75 1 2 1 2-1 2-1M9.667 6h.006M6.333 6h.007M8 14c3.313 0 6-2.687 6-6s-2.687-6-6-6-6 2.687-6 6c0 .67.11 1.314.313 1.916.076.226.114.34.12.427a.6.6 0 0 1-.018.188c-.02.084-.068.171-.163.346l-.832 1.526c-.167.306-.25.459-.232.577a.333.333 0 0 0 .14.22c.102.065.275.047.623.011L5.32 13.82c.11-.011.165-.017.214-.014.047.001.081.007.127.019.048.012.107.036.227.082A6 6 0 0 0 8 14z" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.06 6a2 2 0 0 1 3.886.667c0 1.333-2 2-2 2M8 11.333h.007m6.66-3.333a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.334 0z" />
  </svg>
);

const ContainerIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.333 11.667V4.333m5.334 7.334V4.333M2 5.733v4.534c0 .746 0 1.12.145 1.406.128.251.332.455.583.583.286.145.66.145 1.406.145h7.733c.747 0 1.12 0 1.407-.145.25-.128.455-.332.583-.583.145-.286.145-.66.145-1.406V5.733c0-.746 0-1.12-.145-1.406a1.333 1.333 0 0 0-.583-.583c-.286-.145-.66-.145-1.407-.145H4.134c-.747 0-1.12 0-1.406.145-.251.128-.455.332-.583.583C2 4.614 2 4.987 2 5.733z" />
  </svg>
);

const LogOutIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.667 11.333 14 8m0 0-3.333-3.333M14 8H6m0-6.667h-.8c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874c-.218.428-.218.988-.218 2.108v7.334c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218H6" />
  </svg>
);

/* ===========================
   Dropdown (container + trigger)
   =========================== */

export function Dropdown({
  children,
  trigger = 'button',
  label = 'Options',
  open = false,
  avatarText,
  avatarSrc,
  ...props
}) {
  const renderTrigger = () => {
    if (trigger === 'icon') {
      return (
        <button className={styles['trigger-icon']} type="button">
          <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DotsIcon />
          </span>
        </button>
      );
    }
    if (trigger === 'avatar') {
      return (
        <button className={styles['trigger-avatar']} type="button">
          <span className={styles['avatar-circle']}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="" />
            ) : (
              avatarText || 'JL'
            )}
          </span>
        </button>
      );
    }
    // default: button
    return (
      <button className={styles.trigger} type="button">
        {label}
        <span className={styles.chevron}><ChevronDown /></span>
      </button>
    );
  };

  return (
    <div className={styles.dropdown} {...props}>
      {renderTrigger()}
      <div className={`${styles.menu} ${open ? styles.open : ''}`}>
        {children}
      </div>
    </div>
  );
}

/* Static menu (for documentation demos without trigger) */
export function DropdownMenu({ children, ...props }) {
  return (
    <div className={`${styles.menu} ${styles['static-open']}`} {...props}>
      {children}
    </div>
  );
}

/* ===========================
   DropdownItem
   =========================== */

export function DropdownItem({
  children,
  icon,
  shortcut,
  disabled = false,
  checked,
  state = 'default',
  ...props
}) {
  const classes = [styles['menu-item']];
  if (state === 'hover') classes.push(styles['force-hover']);
  if (disabled || state === 'disabled') classes.push(styles.disabled);

  return (
    <button className={classes.join(' ')} disabled={disabled || state === 'disabled'} type="button" {...props}>
      {checked !== undefined && (
        <span className={`${styles['item-checkbox']} ${checked ? styles.checked : ''}`}>
          {checked && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L4.5 8.5 2 6" />
            </svg>
          )}
        </span>
      )}
      {icon && (
        <span className={styles['item-icon']}>
          {icon}
        </span>
      )}
      <span className={styles['item-label']}>{children}</span>
      {shortcut && <span className={styles['item-shortcut']}>{shortcut}</span>}
    </button>
  );
}

/* ===========================
   DropdownHeader
   =========================== */

export function DropdownHeader({ children, avatar = false, name, email, avatarSrc }) {
  if (avatar) {
    return (
      <div className={styles['menu-header-avatar']}>
        <span className={styles['avatar-circle']}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="" />
          ) : (
            name ? name.charAt(0) : 'U'
          )}
        </span>
        <div className={styles['header-avatar-info']}>
          <span className={styles['header-avatar-name']}>{name}</span>
          <span className={styles['header-avatar-email']}>{email}</span>
        </div>
      </div>
    );
  }
  return <div className={styles['menu-header']}>{children}</div>;
}

/* ===========================
   DropdownDivider
   =========================== */

export function DropdownDivider() {
  return <div className={styles['menu-divider']} />;
}

/* Re-export icons for MDX usage */
export {
  MailIcon,
  StarIcon,
  SettingsIcon,
  LayersIcon,
  SearchIcon,
  UserIcon,
  ZapIcon,
  HomeIcon,
  UsersIcon,
  UserPlusIcon,
  MessageSmileIcon,
  HelpIcon,
  ContainerIcon,
  LogOutIcon,
};
