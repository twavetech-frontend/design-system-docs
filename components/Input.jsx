import React from 'react';
import styles from './Input.module.css';

/* ===========================
   SVG Icons
   =========================== */

const HelpCircle = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.667" />
    <path d="M6.06 6a2 2 0 0 1 3.887.667c0 1.333-2 2-2 2" />
    <path d="M8 11.333h.007" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.667 5.833l7.133 4.988c.387.27.58.406.792.458.187.046.383.046.57 0 .212-.052.405-.188.792-.458l7.133-4.988M5.667 16.667h8.666c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.093-1.092c.272-.535.272-1.235.272-2.635V7.333c0-1.4 0-2.1-.272-2.635a2.5 2.5 0 0 0-1.093-1.092c-.535-.273-1.235-.273-2.635-.273H5.667c-1.4 0-2.1 0-2.635.273a2.5 2.5 0 0 0-1.093 1.092c-.272.535-.272 1.235-.272 2.635v5.334c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.092c.535.273 1.235.273 2.635.273z" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const AlertCircle = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.667" />
    <path d="M8 5.333V8M8 10.667h.007" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.667 6.667V4.333c0-.933 0-1.4.182-1.756a1.667 1.667 0 0 1 .728-.729c.357-.181.824-.181 1.757-.181h6.333c.933 0 1.4 0 1.757.181.313.16.568.415.728.729.182.356.182.823.182 1.756v6.334c0 .933 0 1.4-.182 1.756a1.667 1.667 0 0 1-.728.729c-.357.181-.824.181-1.757.181h-2.334M4.333 18.333h6.334c.933 0 1.4 0 1.756-.181a1.667 1.667 0 0 0 .729-.729c.181-.356.181-.823.181-1.756V9.333c0-.933 0-1.4-.181-1.756a1.667 1.667 0 0 0-.729-.729c-.356-.181-.823-.181-1.756-.181H4.333c-.933 0-1.4 0-1.756.181a1.667 1.667 0 0 0-.729.729c-.181.356-.181.823-.181 1.756v6.334c0 .933 0 1.4.181 1.756.16.314.415.569.729.729.356.181.823.181 1.756.181z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3L3 9M3 3l6 6" />
  </svg>
);

/* ===========================
   Input Field
   =========================== */

export function Input({
  label,
  hint,
  placeholder = '',
  value,
  size = 'md',
  state = 'default',
  destructive = false,
  type = 'default',
  required = false,
  helpIcon = false,
  leadingIcon,
  leadingText,
  leadingDropdown,
  trailingDropdown,
  trailingButton,
  paymentBrand,
  tags = [],
  ...props
}) {
  const wrapperClasses = [
    styles.wrapper,
    styles[`size-${size}`],
    state === 'focused' && styles.focused,
    state === 'disabled' && styles.disabled,
    destructive && styles.destructive,
  ].filter(Boolean).join(' ');

  const showAlertIcon = destructive && state !== 'disabled';
  const showHelpIcon = helpIcon && !showAlertIcon;

  return (
    <div className={wrapperClasses} {...props}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles['input-container']}>
        {/* Leading addons */}
        {type === 'leading-dropdown' && leadingDropdown && (
          <button className={styles['leading-dropdown']} type="button">
            {leadingDropdown}
            <ChevronDown />
          </button>
        )}

        <div className={styles['input-content']}>
          {type === 'leading-text' && leadingText && (
            <span className={styles['leading-text']}>{leadingText}</span>
          )}
          {type === 'payment' && (
            <span className={styles['payment-icon']}>
              <span style={{ background: paymentBrand || '#f04438', borderRadius: 3 }} />
            </span>
          )}
          {type === 'default' && leadingIcon && (
            <span className={styles['leading-icon']}>{leadingIcon}</span>
          )}

          {type === 'tags' ? (
            <div className={styles['tags-container']}>
              {tags.map((tag, i) => {
                const isObject = typeof tag === 'object' && tag !== null;
                const label = isObject ? tag.label : tag;
                const avatarSrc = isObject ? tag.avatarSrc : undefined;
                return (
                  <span key={i} className={styles.tag}>
                    <span className={styles['tag-avatar']}>
                      {avatarSrc && (
                        <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      )}
                    </span>
                    {label}
                    <span className={styles['tag-close']}><XIcon /></span>
                  </span>
                );
              })}
              <input
                className={styles['tags-input']}
                type="text"
                placeholder={tags.length === 0 ? placeholder : ''}
                disabled={state === 'disabled'}
                readOnly
              />
            </div>
          ) : (
            <input
              className={styles.input}
              type="text"
              placeholder={placeholder}
              value={value}
              disabled={state === 'disabled'}
              readOnly
            />
          )}
        </div>

        {/* Trailing addons */}
        {showAlertIcon && (
          <span className={styles['trailing-icon']}>
            <AlertCircle />
          </span>
        )}
        {showHelpIcon && (
          <span className={styles['help-icon']}>
            <HelpCircle />
          </span>
        )}
        {type === 'trailing-dropdown' && trailingDropdown && (
          <button className={styles['trailing-dropdown']} type="button">
            {trailingDropdown}
            <ChevronDown />
          </button>
        )}
        {type === 'trailing-button' && trailingButton && (
          <button className={styles['trailing-button']} type="button">
            {trailingButton}
          </button>
        )}
      </div>

      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/* ===========================
   Textarea
   =========================== */

export function Textarea({
  label,
  hint,
  placeholder = '',
  value,
  state = 'default',
  destructive = false,
  required = false,
  helpIcon = false,
  tags = [],
  type = 'default',
  ...props
}) {
  const wrapperClasses = [
    styles.wrapper,
    state === 'focused' && styles.focused,
    state === 'disabled' && styles.disabled,
    destructive && styles.destructive,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} {...props}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
          {helpIcon && <span className={styles['help-icon']}><HelpCircle /></span>}
        </label>
      )}

      <div className={styles['textarea-container']}>
        {type === 'tags' ? (
          <div className={styles['textarea-tags']}>
            {tags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {tag}
                <span className={styles['tag-close']}><XIcon /></span>
              </span>
            ))}
            <input
              className={styles['tags-input']}
              type="text"
              placeholder={tags.length === 0 ? placeholder : ''}
              disabled={state === 'disabled'}
              readOnly
            />
          </div>
        ) : (
          <textarea
            className={styles.textarea}
            placeholder={placeholder}
            value={value}
            disabled={state === 'disabled'}
            readOnly
          />
        )}
      </div>

      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/* ===========================
   Verification Code Input
   =========================== */

export function VerificationCodeInput({
  label,
  hint,
  size = 'md',
  digits = 4,
  value = '',
  state = 'default',
  destructive = false,
  ...props
}) {
  const groupSize = digits === 6 ? 3 : digits;
  const groups = digits === 6 ? [0, 1] : [0];
  const valueChars = String(value).split('');

  const wrapperClasses = [
    styles['verify-wrapper'],
    styles[`verify-size-${size}`],
    destructive && styles['verify-destructive'],
    state === 'disabled' && styles['verify-disabled'],
  ].filter(Boolean).join(' ');

  const renderBox = (index) => {
    const char = valueChars[index];
    const isFilled = char !== undefined && char !== '';
    const isFocused = state === 'focused' && index === valueChars.length;
    const boxClasses = [
      styles['verify-box'],
      isFilled && styles['verify-box-filled'],
      isFocused && styles['verify-box-focused'],
    ].filter(Boolean).join(' ');

    return (
      <div key={index} className={boxClasses}>
        <span className={styles['verify-digit']}>{isFilled ? char : '0'}</span>
      </div>
    );
  };

  return (
    <div className={wrapperClasses} {...props}>
      {label && <label className={styles['verify-label']}>{label}</label>}

      <div className={styles['verify-boxes']}>
        {groups.map((g, groupIdx) => (
          <React.Fragment key={groupIdx}>
            {Array.from({ length: groupSize }, (_, i) => renderBox(g * groupSize + i))}
            {digits === 6 && groupIdx === 0 && (
              <span className={styles['verify-separator']}>-</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {hint && <span className={styles['verify-hint']}>{hint}</span>}
    </div>
  );
}

/* Re-export icons */
export { MailIcon, CopyIcon };
