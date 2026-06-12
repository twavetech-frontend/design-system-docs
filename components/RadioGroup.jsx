'use client';
import React, { useState } from 'react';
import styles from './RadioGroup.module.css';

const TYPE_CLASS = {
  radio: styles['type-radio'],
  'icon-simple': styles['type-icon-simple'],
  'icon-card': styles['type-icon-card'],
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </svg>
);

function RadioInput({ checked, disabled, square = false }) {
  const cls = [
    styles.radio,
    square && styles['check-square'],
    checked && styles['radio-checked'],
    disabled && styles['radio-disabled'],
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} aria-hidden="true">
      {checked && !square && <span className={styles['radio-dot']} />}
      {checked && square && (
        <span className={styles['check-icon']}>
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  );
}

export function RadioGroup({
  type = 'radio',
  size = 'sm',
  items = [],
  value: controlledValue,
  defaultValue,
  onChange,
  name,
}) {
  const initial = controlledValue ?? defaultValue ?? items.find((it) => it.selected)?.value ?? null;
  const [internal, setInternal] = useState(initial);
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internal;

  const handleSelect = (item) => {
    if (item.disabled) return;
    if (!isControlled) setInternal(item.value);
    onChange?.(item.value, item);
  };

  const groupClasses = [
    styles.group,
    TYPE_CLASS[type] || TYPE_CLASS.radio,
    styles[`size-${size}`],
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} role="radiogroup">
      {items.map((item) => {
        const isSelected = item.value === selectedValue;
        const itemClasses = [
          styles.item,
          isSelected && styles.selected,
          item.disabled && styles.disabled,
        ].filter(Boolean).join(' ');

        if (type === 'icon-card') {
          return (
            <div
              key={item.value}
              className={itemClasses}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : 0}
              onClick={() => handleSelect(item)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleSelect(item);
                }
              }}
            >
              <div className={styles['card-header']}>
                <div className={styles['card-header-content']}>
                  <span className={styles['featured-icon']}>{item.icon || DEFAULT_ICON}</span>
                  <span className={styles['card-title']}>{item.title}</span>
                </div>
                <RadioInput checked={isSelected} disabled={item.disabled} square />
              </div>

              <div className={styles['card-body']}>
                <div className={styles['card-text']}>
                  {(item.price || item.pricePeriod) && (
                    <div className={styles.price}>
                      {item.price && <span className={styles['price-value']}>{item.price}</span>}
                      {item.pricePeriod && <span className={styles['price-period']}>{item.pricePeriod}</span>}
                    </div>
                  )}
                  {item.description && (
                    <p className={styles.description}>{item.description}</p>
                  )}
                </div>
                {item.badge && (
                  <span className={styles.badge}>
                    <span className={styles['badge-dot']} />
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          );
        }

        return (
          <label
            key={item.value}
            className={itemClasses}
            aria-disabled={item.disabled || undefined}
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={isSelected}
              disabled={item.disabled}
              onChange={() => handleSelect(item)}
              className={styles['visually-hidden']}
            />
            <div className={styles['item-content']}>
              {type === 'icon-simple' && (
                <span className={styles['simple-icon']}>{item.icon || DEFAULT_ICON}</span>
              )}
              <RadioInput checked={isSelected} disabled={item.disabled} />
              <div className={styles['text-wrap']}>
                <div className={styles['text-row']}>
                  <span className={styles.title}>{item.title}</span>
                  {item.subTitle && <span className={styles.subtitle}>{item.subTitle}</span>}
                </div>
                {item.description && (
                  <p className={styles.description}>{item.description}</p>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
