import React from 'react';
import styles from './Pagination.module.css';

const ArrowLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ExternalLink = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M2.5 2H7v4.5M7 2L2 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function PageNumbers({ currentPage, totalPages, shape, onPageChange }) {
  const pages = buildPages(currentPage, totalPages);
  return (
    <div className={styles.numbers}>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className={`${styles.numberCell} ${styles.ellipsis}`} aria-hidden>…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={[
              styles.numberCell,
              p === currentPage ? styles.numberActive : '',
              shape === 'circle' ? styles.shapeCircle : styles.shapeSquare,
            ].filter(Boolean).join(' ')}
            onClick={() => onPageChange?.(p)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
}

function IconArrowButton({ direction, disabled, shape = 'square', onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.iconBtn,
        shape === 'circle' ? styles.shapeCircle : styles.shapeSquare,
      ].join(' ')}
      aria-label={ariaLabel || (direction === 'prev' ? 'Previous page' : 'Next page')}
    >
      {direction === 'prev' ? <ArrowLeft /> : <ArrowRight />}
    </button>
  );
}

function TextButton({ children, disabled, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={styles.textBtn}>
      {children}
    </button>
  );
}

function PrevNextLink({ direction, onClick, withIcon = false, withExternal = false }) {
  return (
    <button type="button" onClick={onClick} className={styles.linkBtn}>
      {withIcon && direction === 'prev' && <ArrowLeft size={14} />}
      <span>{direction === 'prev' ? 'Previous' : 'Next'}</span>
      {withExternal && <ExternalLink />}
      {withIcon && direction === 'next' && <ArrowRight size={14} />}
    </button>
  );
}

export function Pagination({
  type = 'page-default',
  align = 'center',
  shape = 'square',
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}) {
  const goPrev = () => onPageChange?.(Math.max(1, currentPage - 1));
  const goNext = () => onPageChange?.(Math.min(totalPages, currentPage + 1));

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  if (type === 'page-default') {
    return (
      <div className={`${styles.root} ${styles.pageContainer}`}>
        <div className={styles.sideStart}>
          <PrevNextLink direction="prev" onClick={goPrev} withExternal />
        </div>
        <PageNumbers
          currentPage={currentPage}
          totalPages={totalPages}
          shape={shape}
          onPageChange={onPageChange}
        />
        <div className={styles.sideEnd}>
          <PrevNextLink direction="next" onClick={goNext} withExternal />
        </div>
      </div>
    );
  }

  if (type === 'page-minimal') {
    return (
      <div className={`${styles.root} ${styles.pageContainer} ${styles.justifyCenter}`}>
        <IconArrowButton direction="prev" shape={shape} disabled={prevDisabled} onClick={goPrev} />
        <span className={styles.pageLabel}>Page {currentPage} of {totalPages}</span>
        <IconArrowButton direction="next" shape={shape} disabled={nextDisabled} onClick={goNext} />
      </div>
    );
  }

  if (type === 'card-default') {
    return (
      <div className={styles.root}>
        <div className={styles.sideStart}>
          <PrevNextLink direction="prev" onClick={goPrev} withIcon />
        </div>
        <PageNumbers
          currentPage={currentPage}
          totalPages={totalPages}
          shape={shape}
          onPageChange={onPageChange}
        />
        <div className={styles.sideEnd}>
          <PrevNextLink direction="next" onClick={goNext} withIcon />
        </div>
      </div>
    );
  }

  if (type === 'card-minimal') {
    const label = <span className={styles.pageLabel}>Page {currentPage} of {totalPages}</span>;
    const buttons = (
      <div className={styles.textBtnGroup}>
        <TextButton disabled={prevDisabled} onClick={goPrev}>Previous</TextButton>
        <TextButton disabled={nextDisabled} onClick={goNext}>Next</TextButton>
      </div>
    );

    if (align === 'right') {
      return <div className={styles.root}>{label}<div className={styles.spacer} />{buttons}</div>;
    }
    if (align === 'left') {
      return <div className={styles.root}>{buttons}<div className={styles.spacer} />{label}</div>;
    }
    return (
      <div className={`${styles.root} ${styles.threeCol}`}>
        <TextButton disabled={prevDisabled} onClick={goPrev}>Previous</TextButton>
        <div className={styles.centerLabel}>{label}</div>
        <TextButton disabled={nextDisabled} onClick={goNext}>Next</TextButton>
      </div>
    );
  }

  if (type === 'card-button-group') {
    const group = (
      <div className={[
        styles.buttonGroup,
        shape === 'circle' ? styles.groupCircle : styles.groupSquare,
      ].join(' ')}>
        <button type="button" onClick={goPrev} disabled={prevDisabled} className={styles.groupBtn}>Previous</button>
        {buildPages(currentPage, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className={`${styles.groupBtn} ${styles.ellipsis}`} aria-hidden>…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={[
                styles.groupBtn,
                p === currentPage ? styles.groupBtnActive : '',
              ].filter(Boolean).join(' ')}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button type="button" onClick={goNext} disabled={nextDisabled} className={styles.groupBtn}>Next</button>
      </div>
    );

    const justifyClass =
      align === 'left' ? styles.justifyStart :
      align === 'right' ? styles.justifyEnd :
      styles.justifyCenter;

    return <div className={`${styles.root} ${justifyClass}`}>{group}</div>;
  }

  return null;
}
