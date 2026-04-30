function pad(value) {
  return String(value).padStart(2, '0');
}

export function getTodayDateInputValue() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function formatDateInputValue(value) {
  if (!value) return '';

  if (value instanceof Date) {
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }

  const stringValue = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    return stringValue;
  }

  if (stringValue.includes('T')) {
    return stringValue.split('T')[0];
  }

  const parsed = new Date(stringValue);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

export function parseDateInputValue(value) {
  const datePart = formatDateInputValue(value);
  if (!datePart) return null;

  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateDisplay(value) {
  const datePart = formatDateInputValue(value);
  if (!datePart) return '-';

  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
}
