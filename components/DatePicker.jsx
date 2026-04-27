import React, { useMemo, useState } from 'react';
import styles from './DatePicker.module.css';

/* ── Icons ── */
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PRESETS = [
  'Today', 'Yesterday', 'This week', 'Last week',
  'This month', 'Last month', 'This year', 'Last year', 'All time',
];

/* ── Helpers ── */
function pad(n) { return n < 10 ? `0${n}` : `${n}`; }

function formatDate(d) {
  if (!d) return '';
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function buildMonthGrid(year, month) {
  // Monday-first 6-row grid
  const first = new Date(year, month, 1);
  const dow = (first.getDay() + 6) % 7; // 0=Mon
  const start = new Date(year, month, 1 - dow);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

function sameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function inRange(d, start, end) {
  if (!start || !end) return false;
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

/* ── Calendar cell ── */
function Cell({
  date,
  monthYear,
  today,
  selected,
  rangeStart,
  rangeEnd,
  hasDot,
  disabled,
}) {
  const isOutside = date.getMonth() !== monthYear.month;
  const isToday = sameDay(date, today);
  const isSelected = sameDay(date, selected);
  const isRangeStart = sameDay(date, rangeStart);
  const isRangeEnd = sameDay(date, rangeEnd);
  const isInRange = !isRangeStart && !isRangeEnd && inRange(date, rangeStart, rangeEnd);

  const classes = [styles.cell];
  if (isOutside) classes.push(styles.cellOutside);
  if (disabled) classes.push(styles.cellDisabled);
  if (isToday && !isSelected && !isRangeStart && !isRangeEnd) classes.push(styles.cellToday);
  if (isSelected || isRangeStart || isRangeEnd) classes.push(styles.cellSelected);

  const wrapClasses = [styles.cellWrap];
  if (isInRange) wrapClasses.push(styles.cellInRange);
  if (isRangeStart && rangeEnd) wrapClasses.push(styles.cellRangeStart);
  if (isRangeEnd && rangeStart) wrapClasses.push(styles.cellRangeEnd);

  return (
    <div className={wrapClasses.join(' ')}>
      <button type="button" className={classes.join(' ')} disabled={disabled}>
        <span>{date.getDate()}</span>
        {hasDot && !isSelected && !isRangeStart && !isRangeEnd && (
          <span className={styles.cellDot} />
        )}
      </button>
    </div>
  );
}

/* ── Single calendar block ── */
function CalendarBlock({
  monthYear,
  today,
  selected,
  rangeStart,
  rangeEnd,
  showLeftArrow = true,
  showRightArrow = true,
  onPrev,
  onNext,
  dotDates = [],
}) {
  const cells = useMemo(
    () => buildMonthGrid(monthYear.year, monthYear.month),
    [monthYear.year, monthYear.month]
  );

  const dotSet = useMemo(() => new Set(dotDates.map(d => d.toDateString())), [dotDates]);

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onPrev}
          aria-label="Previous month"
          style={{ visibility: showLeftArrow ? 'visible' : 'hidden' }}
        >
          <ChevronLeft />
        </button>
        <div className={styles.monthLabel}>
          {MONTH_LABELS[monthYear.month]} {monthYear.year}
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onNext}
          aria-label="Next month"
          style={{ visibility: showRightArrow ? 'visible' : 'hidden' }}
        >
          <ChevronRight />
        </button>
      </div>
      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className={styles.weekday}>{d}</div>
        ))}
      </div>
      <div className={styles.grid}>
        {cells.map((d, i) => (
          <Cell
            key={i}
            date={d}
            monthYear={monthYear}
            today={today}
            selected={selected}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hasDot={dotSet.has(d.toDateString())}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Footer ── */
function Footer({ children }) {
  return (
    <div className={styles.footer}>
      {children}
    </div>
  );
}

/* ── Single Date Picker ── */
function SingleDatePicker({
  initialMonth = new Date(2025, 0, 1),
  initialDate = new Date(2025, 0, 10),
  today = new Date(2025, 0, 1),
  dotDates = [new Date(2025, 0, 1), new Date(2025, 0, 30), new Date(2025, 1, 4)],
}) {
  const [monthYear, setMonthYear] = useState({
    year: initialMonth.getFullYear(),
    month: initialMonth.getMonth(),
  });
  const [selected, setSelected] = useState(initialDate);
  const [inputValue, setInputValue] = useState(formatDate(initialDate));

  const goPrev = () => setMonthYear((m) => {
    const d = new Date(m.year, m.month - 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const goNext = () => setMonthYear((m) => {
    const d = new Date(m.year, m.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const handleToday = () => {
    setSelected(today);
    setInputValue(formatDate(today));
    setMonthYear({ year: today.getFullYear(), month: today.getMonth() });
  };

  return (
    <div className={`${styles.menu} ${styles.menuSingle}`} onMouseDown={(e) => e.stopPropagation()}>
      <div className={styles.singleTop}>
        <input
          type="text"
          className={styles.dateInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="button" className={styles.todayBtn} onClick={handleToday}>Today</button>
      </div>
      <CalendarBlock
        monthYear={monthYear}
        today={today}
        selected={selected}
        onPrev={goPrev}
        onNext={goNext}
        dotDates={dotDates}
      />
      <Footer>
        <button type="button" className={styles.btnSecondary}>Cancel</button>
        <button type="button" className={styles.btnPrimary}>Apply</button>
      </Footer>
    </div>
  );
}

/* ── Dual Date Picker ── */
function DualDatePicker({
  initialMonth = new Date(2025, 0, 1),
  initialRange = [new Date(2025, 0, 10), new Date(2025, 0, 16)],
  selectedPreset = 'Last week',
  today = new Date(2025, 0, 1),
  dotDates = [new Date(2025, 0, 1), new Date(2025, 0, 30), new Date(2025, 1, 4), new Date(2025, 1, 14)],
}) {
  const [leftMonthYear, setLeftMonthYear] = useState({
    year: initialMonth.getFullYear(),
    month: initialMonth.getMonth(),
  });
  const rightMonthYear = useMemo(() => {
    const d = new Date(leftMonthYear.year, leftMonthYear.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [leftMonthYear]);

  const [rangeStart, setRangeStart] = useState(initialRange[0]);
  const [rangeEnd, setRangeEnd] = useState(initialRange[1]);
  const [activePreset, setActivePreset] = useState(selectedPreset);
  const [startInput, setStartInput] = useState(formatDate(initialRange[0]));
  const [endInput, setEndInput] = useState(formatDate(initialRange[1]));

  const goPrev = () => setLeftMonthYear((m) => {
    const d = new Date(m.year, m.month - 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const goNext = () => setLeftMonthYear((m) => {
    const d = new Date(m.year, m.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div className={`${styles.menu} ${styles.menuDual}`}>
      <div className={styles.presetList}>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={[styles.presetItem, p === activePreset ? styles.presetItemActive : ''].filter(Boolean).join(' ')}
            onClick={() => setActivePreset(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div className={styles.dualBody}>
        <div className={styles.dualCalendars}>
          <CalendarBlock
            monthYear={leftMonthYear}
            today={today}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onPrev={goPrev}
            onNext={goNext}
            showRightArrow={false}
            dotDates={dotDates}
          />
          <CalendarBlock
            monthYear={rightMonthYear}
            today={today}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onPrev={goPrev}
            onNext={goNext}
            showLeftArrow={false}
            dotDates={dotDates}
          />
        </div>
        <Footer>
          <div className={styles.dualInputs}>
            <input
              type="text"
              className={styles.dateInput}
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
            />
            <input
              type="text"
              className={styles.dateInput}
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
            />
          </div>
          <div className={styles.footerBtns}>
            <button type="button" className={styles.btnSecondary}>Cancel</button>
            <button type="button" className={styles.btnPrimary}>Apply</button>
          </div>
        </Footer>
      </div>
    </div>
  );
}

/* ── DatePicker (input + dropdown menu) ── */
export function DatePicker({
  type = 'single',
  placeholder = 'Select dates',
  value,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const display = value || '';

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={[styles.trigger, open ? styles.triggerOpen : ''].filter(Boolean).join(' ')}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon />
        <span className={display ? styles.triggerValue : styles.triggerPlaceholder}>
          {display || placeholder}
        </span>
      </button>
      {open && (
        <div className={styles.popover}>
          {type === 'dual' ? <DualDatePicker /> : <SingleDatePicker />}
        </div>
      )}
    </div>
  );
}

/* ── Standalone Calendar Menu (always visible, for docs) ── */
export function DatePickerMenu({ type = 'single', ...props }) {
  if (type === 'dual') return <DualDatePicker {...props} />;
  return <SingleDatePicker {...props} />;
}

/* ── Calendar cell preview swatch (for cell variants demo) ── */
export function CalendarCellPreview({ variant = 'default', state = 'default' }) {
  const today = new Date(2025, 0, 1);
  const day = 10;
  const date = new Date(2025, 0, day);
  const monthYear = { year: 2025, month: 0 };

  const props = { date, monthYear, today };
  if (variant === 'today') props.today = date;
  if (variant === 'selected') props.selected = date;
  if (variant === 'active-start') {
    props.rangeStart = date;
    props.rangeEnd = new Date(2025, 0, day + 3);
  }
  if (variant === 'active-end') {
    props.rangeStart = new Date(2025, 0, day - 3);
    props.rangeEnd = date;
  }
  if (variant === 'in-range') {
    props.rangeStart = new Date(2025, 0, day - 1);
    props.rangeEnd = new Date(2025, 0, day + 1);
  }
  if (state === 'disabled') props.disabled = true;
  if (variant === 'has-dot') props.hasDot = true;

  return (
    <div className={styles.cellSwatch}>
      <Cell {...props} />
    </div>
  );
}
