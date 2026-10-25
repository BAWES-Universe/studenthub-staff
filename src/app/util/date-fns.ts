type DateInput = Date | string | number;

const formatModule = require('date-fns/format');
const parseIsoModule = require('date-fns/parseISO');
const eachDayOfIntervalModule = require('date-fns/eachDayOfInterval');
const endOfMonthModule = require('date-fns/endOfMonth');
const getDateModule = require('date-fns/getDate');
const getMonthModule = require('date-fns/getMonth');
const getYearModule = require('date-fns/getYear');
const isSameDayModule = require('date-fns/isSameDay');
const isSameMonthModule = require('date-fns/isSameMonth');
const isSameYearModule = require('date-fns/isSameYear');
const startOfMonthModule = require('date-fns/startOfMonth');

function pick<T>(moduleValue: any, exportName: string): T {
  return (moduleValue[exportName] || moduleValue.default || moduleValue) as T;
}

export const format = pick<(date: DateInput, formatStr: string, options?: any) => string>(formatModule, 'format');
export const parseISO = pick<(argument: string, options?: any) => Date>(parseIsoModule, 'parseISO');
export const eachDayOfInterval = pick<(interval: { start: DateInput; end: DateInput }, options?: any) => Date[]>(eachDayOfIntervalModule, 'eachDayOfInterval');
export const endOfMonth = pick<(date: DateInput) => Date>(endOfMonthModule, 'endOfMonth');
export const getDate = pick<(date: DateInput) => number>(getDateModule, 'getDate');
export const getMonth = pick<(date: DateInput) => number>(getMonthModule, 'getMonth');
export const getYear = pick<(date: DateInput) => number>(getYearModule, 'getYear');
export const isSameDay = pick<(dateLeft: DateInput, dateRight: DateInput) => boolean>(isSameDayModule, 'isSameDay');
export const isSameMonth = pick<(dateLeft: DateInput, dateRight: DateInput) => boolean>(isSameMonthModule, 'isSameMonth');
export const isSameYear = pick<(dateLeft: DateInput, dateRight: DateInput) => boolean>(isSameYearModule, 'isSameYear');
export const startOfMonth = pick<(date: DateInput) => Date>(startOfMonthModule, 'startOfMonth');
