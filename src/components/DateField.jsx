import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateInputValue, parseDateInputValue } from '../lib/date';

const DateInputButton = forwardRef(function DateInputButton(
  { value, onClick, onBlur, placeholder, disabled, invalid = false },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onBlur={onBlur}
      disabled={disabled}
      className={`date-field-trigger field-input flex items-center justify-between gap-3 text-left ${!value ? 'text-gray-400' : 'text-[var(--color-text)]'} ${invalid ? 'date-field-invalid' : ''}`}
    >
      <span>{value || placeholder || 'Seleccionar fecha'}</span>
      <span className="date-field-icon" aria-hidden="true">▦</span>
    </button>
  );
});

const DateField = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Seleccionar fecha',
  className = '',
  minDate,
  maxDate
}) => {
  return (
    <div className={`date-field-wrapper ${className}`.trim()}>
      <DatePicker
        selected={parseDateInputValue(value)}
        onChange={(date) => onChange(date ? formatDateInputValue(date) : '')}
        dateFormat="dd/MM/yyyy"
        locale={es}
        disabled={disabled}
        placeholderText={placeholder}
        calendarClassName="app-datepicker"
        popperClassName="app-datepicker-popper"
        minDate={minDate ? parseDateInputValue(minDate) : undefined}
        maxDate={maxDate ? parseDateInputValue(maxDate) : undefined}
        customInput={<DateInputButton />}
      />
    </div>
  );
};

export default DateField;
