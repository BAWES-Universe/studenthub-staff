const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function toDate(value: Date | number | string): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    const dateOnly = DATE_ONLY_RE.exec(value);
    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  return new Date(value);
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

export function parseISO(value: string): Date {
  return toDate(value);
}

export function format(value: Date | number | string, pattern: string): string {
  const date = toDate(value);
  const hours = date.getHours();
  const twelveHour = hours % 12 || 12;
  const monthShort = date.toLocaleString('en-US', { month: 'short' });

  return pattern
    .replace(/yyyy/g, String(date.getFullYear()))
    .replace(/MMM/g, monthShort)
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/dd/g, pad(date.getDate()))
    .replace(/d/g, String(date.getDate()))
    .replace(/HH/g, pad(hours))
    .replace(/hh/g, pad(twelveHour))
    .replace(/mm/g, pad(date.getMinutes()))
    .replace(/ss/g, pad(date.getSeconds()))
    .replace(/a/g, hours >= 12 ? 'PM' : 'AM');
}

export function startOfMonth(value: Date | number | string): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(value: Date | number | string): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function eachDayOfInterval(interval: { start: Date; end: Date }): Date[] {
  const days: Date[] = [];
  const current = startOfDay(interval.start);
  const end = startOfDay(interval.end);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function getDate(value: Date | number | string): number {
  return toDate(value).getDate();
}

export function getMonth(value: Date | number | string): number {
  return toDate(value).getMonth();
}

export function getYear(value: Date | number | string): number {
  return toDate(value).getFullYear();
}

export function isSameDay(left: Date | number | string, right: Date | number | string): boolean {
  const leftDate = toDate(left);
  const rightDate = toDate(right);
  return leftDate.getFullYear() === rightDate.getFullYear()
    && leftDate.getMonth() === rightDate.getMonth()
    && leftDate.getDate() === rightDate.getDate();
}

export function isSameMonth(left: Date | number | string, right: Date | number | string): boolean {
  const leftDate = toDate(left);
  const rightDate = toDate(right);
  return leftDate.getFullYear() === rightDate.getFullYear()
    && leftDate.getMonth() === rightDate.getMonth();
}

export function isSameYear(left: Date | number | string, right: Date | number | string): boolean {
  return toDate(left).getFullYear() === toDate(right).getFullYear();
}

export function isToday(value: Date | number | string): boolean {
  return isSameDay(value, new Date());
}

function startOfDay(value: Date | number | string): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
