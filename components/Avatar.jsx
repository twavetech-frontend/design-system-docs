import React from 'react';
import styles from './Avatar.module.css';

const SIZE_CLASS = {
  xs: styles['size-xs'],
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
  xl: styles['size-xl'],
  '2xl': styles['size-2xl'],
};

function getInitials(value) {
  if (!value) return '';
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function VerifiedTick() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1570EF"
        d="M12 1.5l2.4 2.4 3.4-.5.5 3.4L20.7 9 19.5 12l1.2 3-2.4 2.2-.5 3.4-3.4-.5L12 22.5l-2.4-2.4-3.4.5-.5-3.4L3.3 15 4.5 12 3.3 9l2.4-2.2.5-3.4 3.4.5L12 1.5z"
      />
      <path
        d="m8.5 12 2.5 2.5L15.5 9.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="8" fill="#7700ff" />
      <path
        d="M5 6.5 8 4.5l3 2v3L8 11.5l-3-2v-3z"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function PlaceholderUser() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function Avatar({
  src,
  alt = '',
  name,
  initials,
  size = 'md',
  status,
  placeholder = false,
  className = '',
}) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;
  const showInitials = !src && !placeholder;
  const initialsText = initials ?? getInitials(name);

  const wrapperClasses = [styles.avatar, sizeClass, className].filter(Boolean).join(' ');

  return (
    <span className={wrapperClasses}>
      {src && <img src={src} alt={alt || name || ''} className={styles.image} />}
      {!src && placeholder && (
        <span className={styles.placeholder}>
          <PlaceholderUser />
        </span>
      )}
      {showInitials && (
        <span className={styles.initials}>{initialsText}</span>
      )}

      {status === 'online' && <span className={styles['indicator-online']} aria-hidden="true" />}
      {status === 'verified' && (
        <span className={styles['indicator-verified']} aria-hidden="true">
          <VerifiedTick />
        </span>
      )}
      {status === 'company' && (
        <span className={styles['indicator-company']} aria-hidden="true">
          <CompanyIcon />
        </span>
      )}
    </span>
  );
}

function AddButton({ size = 'md', onClick }) {
  return (
    <button type="button" className={`${styles['add-button']} ${SIZE_CLASS[size] || SIZE_CLASS.md}`} onClick={onClick} aria-label="Add">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}

export function AvatarGroup({
  avatars = [],
  size = 'md',
  max = 5,
  showAddButton = false,
  onAdd,
}) {
  const visible = max ? avatars.slice(0, max) : avatars;
  const remaining = avatars.length - visible.length;

  return (
    <div className={`${styles.group} ${SIZE_CLASS[size] || SIZE_CLASS.md}`}>
      <div className={styles['group-stack']}>
        {visible.map((a, i) => (
          <Avatar
            key={i}
            src={a.src}
            name={a.name}
            initials={a.initials}
            size={size}
            placeholder={a.placeholder}
            className={styles['group-avatar']}
          />
        ))}
        {remaining > 0 && (
          <span className={`${styles.avatar} ${styles['group-avatar']} ${styles['group-more']}`}>
            <span className={styles.initials}>+{remaining}</span>
          </span>
        )}
      </div>
      {showAddButton && <AddButton size={size} onClick={onAdd} />}
    </div>
  );
}

export function AvatarLabelGroup({
  src,
  name,
  email,
  initials,
  size = 'md',
  status,
  placeholder = false,
}) {
  const groupSize = ['xs', 'sm'].includes(size) ? 'sm' : size;
  return (
    <div className={`${styles['label-group']} ${SIZE_CLASS[groupSize]}`}>
      <Avatar
        src={src}
        name={name}
        initials={initials}
        size={groupSize}
        status={status}
        placeholder={placeholder}
      />
      <div className={styles['label-text']}>
        {name && <span className={styles['label-name']}>{name}</span>}
        {email && <span className={styles['label-email']}>{email}</span>}
      </div>
    </div>
  );
}
