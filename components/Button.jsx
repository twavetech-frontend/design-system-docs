'use client';
import React from 'react';
import styles from './Button.module.css';

export const Button = ({
    variant = 'primary',
    size = 'md',
    state = 'default',
    disabled = false,
    isLoading = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    ...props
}) => {
    const classes = [
        styles.button,
        styles[`size-${size}`],
        styles[`variant-${variant}`],
    ];

    if (iconOnly) classes.push(styles['icon-only']);
    if (state === 'hover') classes.push(styles['force-hover']);
    if (state === 'active') classes.push(styles['force-active']);
    if (state === 'focused') classes.push(styles['force-focused']);
    if (className) classes.push(className);

    return (
        <button
            className={classes.join(' ')}
            disabled={disabled || isLoading || state === 'disabled'}
            {...props}
        >
            {isLoading && <div className={styles['loading-spinner']} />}
            {!isLoading && leftIcon}
            {!isLoading && children}
            {!isLoading && rightIcon}
        </button>
    );
};
