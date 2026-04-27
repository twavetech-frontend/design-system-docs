import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './SegmentedControl.module.css';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function SegmentedControl({
  items = [],
  size = 'md',
  fullWidth = false,
  onChange,
}) {
  const initialIndex = Math.max(0, items.findIndex((item) => item.current));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);
  const segmentRefs = useRef([]);

  const measure = () => {
    const node = segmentRefs.current[activeIndex];
    if (!node) return;
    setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
    setReady(true);
  };

  useIsoLayoutEffect(() => {
    measure();
  }, [activeIndex, items.length, size, fullWidth]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = () => measure();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [activeIndex]);

  const containerClasses = [
    styles.container,
    styles[`size-${size}`],
    fullWidth && styles.fill,
    ready && styles['indicator-ready'],
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="tablist" ref={containerRef}>
      <span
        className={styles.indicator}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
        aria-hidden="true"
      />
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const itemClasses = [
          styles.segment,
          isActive && styles.current,
        ].filter(Boolean).join(' ');

        return (
          <button
            key={i}
            ref={(el) => (segmentRefs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={itemClasses}
            onClick={() => {
              setActiveIndex(i);
              onChange?.(item, i);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
