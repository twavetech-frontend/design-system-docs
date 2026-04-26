import React from 'react';
import styles from './AppStoreButton.module.css';

/* Per-store icon glyphs */

const GooglePlayIcon = ({ brand }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {brand ? (
      <>
        <path fill="#00D7B5" d="M3.6 1.1c-.4.3-.6.8-.6 1.4v18.9c0 .6.3 1.1.6 1.4l10.6-10.6V11.8z" />
        <path fill="#00F076" d="M17.7 15.2l-3.5-3.5V11.8l3.5-3.5.1.1 4.1 2.4c1.2.7 1.2 1.8 0 2.5z" />
        <path fill="#FFBC00" d="M17.8 15.3l-3.6-3.6L3.6 22.7c.4.4 1.1.5 1.8.1z" />
        <path fill="#FF3A44" d="M17.8 8.2L5.4 1.2c-.7-.4-1.4-.3-1.8.1l10.6 10.4z" />
      </>
    ) : (
      <path fill="currentColor" d="M3.6 1.1c-.4.3-.6.8-.6 1.4v18.9c0 .6.3 1.1.6 1.4l10.6-10.6zM17.7 15.2l-3.5-3.5V11.8l3.5-3.5.1.1 4.1 2.4c1.2.7 1.2 1.8 0 2.5zM17.8 15.3l-3.6-3.6L3.6 22.7c.4.4 1.1.5 1.8.1zM17.8 8.2L5.4 1.2c-.7-.4-1.4-.3-1.8.1l10.6 10.4z" />
    )}
  </svg>
);

const AppleLogoIcon = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill={color} d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GalaxyStoreIcon = ({ brand }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill={brand ? '#1428A0' : 'currentColor'} />
    <path fill={brand ? '#fff' : '#000'} d="M9 8c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2v2h4v2h-4c-1.1 0-2-.9-2-2v-4zm0 8h6v2H9z" />
  </svg>
);

const AppGalleryIcon = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill={color} d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 4.5c2.2 0 4 1.8 4 4v.5h-1.5V10c0-1.4-1.1-2.5-2.5-2.5S9.5 8.6 9.5 10v.5H8V10c0-2.2 1.8-3.5 4-3.5zM8 13h8v4.5H8z" />
  </svg>
);

const CONFIGS = {
  'google-play': {
    pre: 'GET IT ON',
    main: 'Google Play',
    Icon: GooglePlayIcon,
  },
  'app-store': {
    pre: 'Download on the',
    main: 'App Store',
    Icon: AppleLogoIcon,
  },
  'mac-app-store': {
    pre: 'Download on the',
    main: 'Mac App Store',
    Icon: AppleLogoIcon,
  },
  'galaxy-store': {
    pre: 'GET IT ON',
    main: 'Galaxy Store',
    Icon: GalaxyStoreIcon,
  },
  'appgallery': {
    pre: 'EXPLORE IT ON',
    main: 'AppGallery',
    Icon: AppGalleryIcon,
  },
};

export function AppStoreButton({
  store = 'google-play',
  style = 'brand',
  size = 'md',
  ...props
}) {
  const config = CONFIGS[store] || CONFIGS['google-play'];
  const { pre, main, Icon } = config;
  const isBrand = style === 'brand';

  const classes = [
    styles.button,
    styles[`size-${size}`],
    styles[`style-${style}`],
  ].join(' ');

  return (
    <button className={classes} type="button" {...props}>
      <span className={styles.icon}>
        {Icon && <Icon brand={isBrand} color={isBrand ? '#fff' : '#000'} />}
      </span>
      <span className={styles.text}>
        <span className={styles.pre}>{pre}</span>
        <span className={styles.main}>{main}</span>
      </span>
    </button>
  );
}
