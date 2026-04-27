import React, { useState, useRef, useCallback } from 'react';
import styles from './Slider.module.css';

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function pctOf(value, min, max) {
  return ((value - min) / (max - min)) * 100;
}

function Handle({
  position,
  value,
  label,
  handleType = 'plain',
  onPointerDown,
}) {
  return (
    <div
      className={styles.handleWrap}
      style={{ left: `${position}%` }}
      onPointerDown={onPointerDown}
    >
      {handleType === 'tooltip' && (
        <span className={styles.tooltip}>
          {value}%
          <span className={styles.tooltipArrow} />
        </span>
      )}
      <span className={styles.handle}>
        {handleType === 'text' && (
          <span className={styles.handleText}>{value}%</span>
        )}
      </span>
      {label === 'bottom' && (
        <span className={styles.bottomLabel}>{value}%</span>
      )}
      {label === 'top-floating' && (
        <span className={styles.floatingLabel}>{value}%</span>
      )}
    </div>
  );
}

export function Slider({
  value: valueProp,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  label = false,
  handleType = 'plain',
  width,
  onChange,
}) {
  const isControlled = valueProp !== undefined;
  const initial = defaultValue !== undefined
    ? defaultValue
    : (range ? [25, 75] : 50);
  const [internal, setInternal] = useState(initial);
  const value = isControlled ? valueProp : internal;

  const trackRef = useRef(null);
  const draggingRef = useRef(null); // 'low' | 'high' | 'single' | null

  const setValue = (v) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const valueFromClientX = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
  }, [min, max, step]);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const next = valueFromClientX(e.clientX);
    if (range) {
      const [lo, hi] = value;
      if (draggingRef.current === 'low') {
        setValue([Math.min(next, hi), hi]);
      } else {
        setValue([lo, Math.max(next, lo)]);
      }
    } else {
      setValue(next);
    }
  }, [valueFromClientX, range, value, setValue]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const startDrag = (which) => (e) => {
    e.preventDefault();
    draggingRef.current = which;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleTrackClick = (e) => {
    if (e.target.closest(`.${styles.handleWrap}`)) return;
    const next = valueFromClientX(e.clientX);
    if (range) {
      const [lo, hi] = value;
      // Move closer thumb
      if (Math.abs(next - lo) < Math.abs(next - hi)) {
        setValue([next, hi]);
      } else {
        setValue([lo, next]);
      }
    } else {
      setValue(next);
    }
  };

  const lowPct = range ? pctOf(value[0], min, max) : 0;
  const highPct = range ? pctOf(value[1], min, max) : pctOf(value, min, max);

  const wrapClasses = [
    styles.wrapper,
    label === 'bottom' ? styles.wrapperBottom : '',
    label === 'top-floating' ? styles.wrapperTopFloating : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapClasses} style={width ? { width } : undefined}>
      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={handleTrackClick}
      >
        <div
          className={styles.fill}
          style={{
            left: `${lowPct}%`,
            width: `${highPct - lowPct}%`,
          }}
        />
        {range ? (
          <>
            <Handle
              position={lowPct}
              value={value[0]}
              label={label}
              handleType={handleType}
              onPointerDown={startDrag('low')}
            />
            <Handle
              position={highPct}
              value={value[1]}
              label={label}
              handleType={handleType}
              onPointerDown={startDrag('high')}
            />
          </>
        ) : (
          <Handle
            position={highPct}
            value={value}
            label={label}
            handleType={handleType}
            onPointerDown={startDrag('single')}
          />
        )}
      </div>
    </div>
  );
}
