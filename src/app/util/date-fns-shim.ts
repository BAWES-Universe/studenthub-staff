const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseISO(value: string): Date {
  return new Date(value);
}

export function format(value: Date | string | number, pattern: string): string {
  const date = value instanceof Date ? value : new Date(value);
  const hours12 = date.getHours() % 12 || 12;
  const replacements: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    MMM: MONTHS[date.getMonth()],
    dd: pad(date.getDate()),
    d: String(date.getDate()),
    HH: pad(date.getHours()),
    hh: pad(hours12),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    a: date.getHours() >= 12 ? 'PM' : 'AM',
  };

  return pattern.replace(/yyyy|MMM|MM|dd|d|HH|hh|mm|ss|a/g, token => replacements[token]);
}

export function startOfMonth(value: Date | number): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(value: Date | number): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function eachDayOfInterval(interval: { start: Date; end: Date }): Date[] {
  const days: Date[] = [];
  const current = new Date(interval.start);

  while (current <= interval.end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function getDate(value: Date | number): number {
  return toDate(value).getDate();
}

export function getMonth(value: Date | number): number {
  return toDate(value).getMonth();
}

export function getYear(value: Date | number): number {
  return toDate(value).getFullYear();
}

export function isSameDay(left: Date | number, right: Date | number): boolean {
  return format(toDate(left), 'yyyy-MM-dd') === format(toDate(right), 'yyyy-MM-dd');
}

export function isSameMonth(left: Date | number, right: Date | number): boolean {
  return toDate(left).getMonth() === toDate(right).getMonth();
}

export function isSameYear(left: Date | number, right: Date | number): boolean {
  return toDate(left).getFullYear() === toDate(right).getFullYear();
}

export function isToday(value: Date | number): boolean {
  return isSameDay(toDate(value), new Date());
}

function toDate(value: Date | number): Date {
  return value instanceof Date ? value : new Date(value);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
