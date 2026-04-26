import React from 'react';
import styles from './Select.module.css';

/* ===========================
   Inline icons (Figma source: untitledui icon set)
   =========================== */

const ChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7.5l5 5 5-5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.667 5L7.5 14.167 3.333 10" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 17.5l-3.625-3.625M14.167 8.333a5.833 5.833 0 1 1-11.667 0 5.833 5.833 0 0 1 11.667 0z" />
  </svg>
);

const XCloseIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3L3 9M3 3l6 6" />
  </svg>
);

const HelpCircleIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.06 6a2 2 0 0 1 3.886.667c0 1.333-2 2-2 2M8 11.333h.007m6.66-3.333a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.334 0z" />
  </svg>
);

/* ===========================
   Select
   ---------------------------
   Figma: Base components/Select (3281:377673)
   Variants:
   - size:  sm | md
   - type:  default | icon | avatar | dot | search | tags  (inferred from props)
   - state: default | placeholder | focused | disabled | open
   =========================== */

function inferType({ leadingIcon, leadingAvatar, leadingDot, search, tags }) {
  if (search) return 'search';
  if (tags && tags.length > 0) return 'tags';
  if (leadingIcon) return 'icon';
  if (leadingAvatar) return 'avatar';
  if (leadingDot) return 'dot';
  return 'default';
}

export function Select({
  label,
  hint,
  placeholder,
  value,
  supportingText,
  size = 'md',
  state,
  required = false,
  helpIcon = false,
  leadingIcon,
  leadingAvatar,
  leadingDot,
  search = false,
  shortcut,
  tags,
  children,
  ...props
}) {
  const type = inferType({ leadingIcon, leadingAvatar, leadingDot, search, tags });
  const hasLeading = type !== 'default' && type !== 'tags';
  const resolvedState =
    state || (!value && (placeholder || search || type === 'tags') ? 'placeholder' : 'default');
  const isDisabled = resolvedState === 'disabled';

  const inputClasses = [styles.input, styles[`size-${size}`], styles[`state-${resolvedState}`]];
  if (hasLeading) inputClasses.push(styles['has-leading']);

  return (
    <div className={styles.wrapper} {...props}>
      {label && (
        <span className={styles.labelWrap}>
          <span className={styles.label}>{label}</span>
          {required && <span className={styles.required}>*</span>}
          {helpIcon && (
            <span className={styles.helpIcon} aria-hidden="true">
              <HelpCircleIcon />
            </span>
          )}
        </span>
      )}

      <div className={inputClasses.join(' ')}>
        <span className={styles.content}>
          {type === 'icon' && (
            <span className={styles.leadingIcon}>{leadingIcon}</span>
          )}
          {type === 'avatar' && (
            <span className={styles.leadingAvatar}>
              {typeof leadingAvatar === 'string' ? <img src={leadingAvatar} alt="" /> : leadingAvatar}
            </span>
          )}
          {type === 'dot' && (
            <span className={styles.leadingDot}>
              <span className={styles.dotInner} style={{ background: leadingDot }} />
            </span>
          )}
          {(type === 'search' || type === 'tags') && (
            <span className={styles.leadingIcon}><SearchIcon /></span>
          )}

          {type === 'tags' ? (
            <>
              <span className={styles.tagList}>
                {tags.map((tag, i) => {
                  const isObj = typeof tag === 'object' && tag !== null;
                  return (
                    <span key={i} className={styles.tag}>
                      {isObj && tag.avatar && (
                        <span className={styles.tagAvatar}>
                          <img src={tag.avatar} alt="" />
                        </span>
                      )}
                      <span className={styles.tagLabel}>{isObj ? tag.label : tag}</span>
                      <span className={styles.tagClose} aria-hidden="true">
                        <XCloseIcon />
                      </span>
                    </span>
                  );
                })}
              </span>
              {placeholder && (
                <span className={styles.tagsPlaceholder}>{placeholder}</span>
              )}
            </>
          ) : type === 'search' ? (
            <input
              className={styles.searchInput}
              type="text"
              placeholder={placeholder || 'Search'}
              defaultValue={value}
              disabled={isDisabled}
            />
          ) : resolvedState === 'placeholder' ? (
            <span className={styles.placeholder}>{placeholder || ''}</span>
          ) : (
            <>
              <span className={styles.value}>{value}</span>
              {value && supportingText && (
                <span className={styles.supporting}>{supportingText}</span>
              )}
            </>
          )}
        </span>

        {shortcut && <span className={styles.shortcut}>{shortcut}</span>}

        {type !== 'search' && type !== 'tags' && (
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDown />
          </span>
        )}
      </div>

      {hint && <span className={styles.hint}>{hint}</span>}
      {children}
    </div>
  );
}

/* ===========================
   SelectMenu
   ---------------------------
   Container for SelectItem children — drawn as the open dropdown panel.
   =========================== */

export function SelectMenu({ children, maxHeight, ...props }) {
  return (
    <div className={styles.menu} style={maxHeight ? { maxHeight } : undefined} {...props}>
      {children}
    </div>
  );
}

/* ===========================
   SelectItem
   ---------------------------
   Figma: Base components/_Select menu item (3281:380429)
   Variants:
   - size:     sm | md
   - selected: true | false
   - type:     default | icon | avatar | dot  (inferred)
   - state:    default | hover | disabled
   =========================== */

export function SelectItem({
  children,
  supportingText,
  selected = false,
  disabled = false,
  state = 'default',
  size = 'md',
  icon,
  avatar,
  avatarSrc,
  dot,
  ...props
}) {
  const classes = [styles.item, styles[`itemSize-${size}`]];
  if (state === 'hover') classes.push(styles.itemHover);
  if (disabled || state === 'disabled') classes.push(styles.itemDisabled);
  if (selected) classes.push(styles.itemSelected);

  return (
    <button
      className={classes.join(' ')}
      disabled={disabled || state === 'disabled'}
      type="button"
      {...props}
    >
      <span className={styles.itemContent}>
        <span className={styles.itemRow}>
          {icon && <span className={styles.itemIcon}>{icon}</span>}
          {(avatar || avatarSrc) && (
            <span className={styles.itemAvatar}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="" />
              ) : (
                <span className={styles.itemAvatarText}>{typeof avatar === 'string' ? avatar : 'U'}</span>
              )}
            </span>
          )}
          {dot && (
            <span className={styles.itemDot}>
              <span className={styles.dotInner} style={{ background: dot }} />
            </span>
          )}
          <span className={styles.itemLabel}>{children}</span>
          {supportingText && (
            <span className={styles.itemSupporting}>{supportingText}</span>
          )}
        </span>
        {selected && (
          <span className={styles.itemCheck} aria-hidden="true">
            <CheckIcon />
          </span>
        )}
      </span>
    </button>
  );
}
