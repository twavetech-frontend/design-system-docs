import React from 'react';
import styles from './ProgressBar.module.css';

export function ProgressBar({
  value = 0,
  label = 'right',
  width,
}) {
  const pct = Math.max(0, Math.min(100, value));
  const showInline = label === 'right' || label === 'bottom';
  const showFloating = label === 'top-floating' || label === 'bottom-floating';

  const wrapperClass = [
    styles.wrapper,
    label === 'bottom' ? styles.wrapperBottom : '',
    label === 'right' ? styles.wrapperRight : '',
    label === 'top-floating' ? styles.wrapperTopFloating : '',
    label === 'bottom-floating' ? styles.wrapperBottomFloating : '',
  ].filter(Boolean).join(' ');

  const inlineLabel = showInline && (
    <span className={styles.label}>{pct}%</span>
  );

  const floatingLabel = showFloating && (
    <span
      className={[
        styles.floatingLabel,
        label === 'top-floating' ? styles.floatingTop : styles.floatingBottom,
      ].join(' ')}
      style={{ left: `${pct}%` }}
    >
      {pct}%
    </span>
  );

  const bar = (
    <div className={styles.track} style={width ? { width } : undefined}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
      {showFloating && floatingLabel}
    </div>
  );

  if (label === 'right') {
    return (
      <div className={wrapperClass}>
        {bar}
        {inlineLabel}
      </div>
    );
  }
  if (label === 'bottom') {
    return (
      <div className={wrapperClass}>
        {bar}
        {inlineLabel}
      </div>
    );
  }
  if (showFloating) {
    return <div className={wrapperClass}>{bar}</div>;
  }

  return <div className={wrapperClass}>{bar}</div>;
}
