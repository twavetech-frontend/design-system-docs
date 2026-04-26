import React from 'react';
import styles from './SocialButton.module.css';

/* Brand SVG icons */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M23.76 12.27c0-.81-.07-1.58-.2-2.32H12v4.39h6.6c-.28 1.53-1.14 2.83-2.43 3.7v3.08h3.93c2.3-2.12 3.66-5.25 3.66-8.85z" />
    <path fill="#34A853" d="M12 24c3.28 0 6.02-1.09 8.03-2.95l-3.93-3.08c-1.09.73-2.49 1.16-4.1 1.16-3.15 0-5.82-2.13-6.77-4.99H1.17v3.14C3.17 21.31 7.27 24 12 24z" />
    <path fill="#FBBC05" d="M5.23 14.14A7.19 7.19 0 014.83 12c0-.74.13-1.46.35-2.14V6.72H1.17A11.97 11.97 0 000 12c0 1.93.46 3.76 1.17 5.28l4.06-3.14z" />
    <path fill="#EA4335" d="M12 4.75c1.78 0 3.38.61 4.64 1.81l3.48-3.48C18.01 1.15 15.27 0 12 0 7.27 0 3.17 2.69 1.17 6.72l4.06 3.14C6.18 6.88 8.85 4.75 12 4.75z" />
  </svg>
);

const FacebookIconColor = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#1877F2" d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.96 10.12 11.85V15.47H7.08V12h3.04V9.35c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38C19.61 22.96 24 17.99 24 12z" />
  </svg>
);

const FacebookIconMono = ({ color }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill={color} d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.96 10.12 11.85V15.47H7.08V12h3.04V9.35c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38C19.61 22.96 24 17.99 24 12z" />
  </svg>
);

const AppleIcon = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill={color} d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const XIcon = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill={color} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LABELS = {
  google: 'Sign in with Google',
  facebook: 'Sign in with Facebook',
  apple: 'Sign in with Apple',
  twitter: 'Sign in with X',
};

function renderIcon(social, theme) {
  if (social === 'google') {
    // Google logo is always full color
    return <GoogleIcon />;
  }
  if (social === 'facebook') {
    if (theme === 'color') return <FacebookIconColor />;
    if (theme === 'gray') return <FacebookIconMono color="#535862" />;
    return <FacebookIconMono color="#ffffff" />;
  }
  if (social === 'apple') {
    if (theme === 'color') return <AppleIcon color="#000" />;
    if (theme === 'gray') return <AppleIcon color="#535862" />;
    return <AppleIcon color="#ffffff" />;
  }
  if (social === 'twitter') {
    if (theme === 'color') return <XIcon color="#000" />;
    if (theme === 'gray') return <XIcon color="#535862" />;
    return <XIcon color="#ffffff" />;
  }
  return null;
}

export function SocialButton({
  social = 'google',
  theme = 'brand',
  supportingText = true,
  state = 'default',
  label,
  ...props
}) {
  const classes = [
    styles.button,
    styles[`social-${social}`],
    styles[`theme-${theme}`],
    !supportingText && styles['icon-only'],
    state === 'hover' && styles['force-hover'],
    state === 'focused' && styles['force-focused'],
    state === 'disabled' && styles.disabled,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} type="button" disabled={state === 'disabled'} {...props}>
      <span className={styles.icon}>{renderIcon(social, theme)}</span>
      {supportingText && <span className={styles.label}>{label || LABELS[social]}</span>}
    </button>
  );
}
