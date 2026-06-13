declare const require: any;

const dateFns = require('date-fns');

export const eachDayOfInterval: (interval: { start: Date | number; end: Date | number }) => Date[] =
  dateFns.eachDayOfInterval;
export const endOfMonth: (date: Date | number) => Date = dateFns.endOfMonth;
export const format: (date: Date | number, formatStr: string, options?: any) => string = dateFns.format;
export const getDate: (date: Date | number) => number = dateFns.getDate;
export const getMonth: (date: Date | number) => number = dateFns.getMonth;
export const getYear: (date: Date | number) => number = dateFns.getYear;
export const isSameDay: (dateLeft: Date | number, dateRight: Date | number) => boolean = dateFns.isSameDay;
export const isSameMonth: (dateLeft: Date | number, dateRight: Date | number) => boolean = dateFns.isSameMonth;
export const isSameYear: (dateLeft: Date | number, dateRight: Date | number) => boolean = dateFns.isSameYear;
export const isToday: (date: Date | number) => boolean = dateFns.isToday;
export const parseISO: (argument: string, options?: any) => Date = dateFns.parseISO;
export const startOfMonth: (date: Date | number) => Date = dateFns.startOfMonth;
