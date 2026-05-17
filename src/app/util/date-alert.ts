import { AlertController } from '@ionic/angular';
import { format } from 'date-fns';

export interface DateRangeSelection {
  from: string;
  to: string;
}

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateInput(value: Date | string | number): Date {
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

function toInputDate(value?: Date | string | number): string {
  if (!value) {
    return format(new Date(), 'yyyy-MM-dd');
  }

  const date = parseDateInput(value);

  return Number.isNaN(date.getTime()) ? format(new Date(), 'yyyy-MM-dd') : format(date, 'yyyy-MM-dd');
}

export async function presentDateRangeAlert(
  alertCtrl: AlertController,
  defaultRange: { from?: Date | string | number; to?: Date | string | number } = {},
  header = 'Select Date Range'
): Promise<DateRangeSelection | null> {
  const alert = await alertCtrl.create({
    header,
    inputs: [
      { name: 'from', type: 'date', value: toInputDate(defaultRange.from) },
      { name: 'to', type: 'date', value: toInputDate(defaultRange.to) },
    ],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Ok', role: 'confirm' },
    ],
  });

  await alert.present();
  const result = await alert.onDidDismiss();
  const values = result.data?.values;

  if (result.role !== 'confirm' || !values?.from || !values?.to) {
    return null;
  }

  const from = toInputDate(values.from);
  const to = toInputDate(values.to);

  if (from > to) {
    return { from: to, to: from };
  }

  return {
    from,
    to,
  };
}

export async function presentDateAlert(
  alertCtrl: AlertController,
  defaultDate?: Date | string | number,
  header = 'Select Date'
): Promise<string | null> {
  const alert = await alertCtrl.create({
    header,
    inputs: [
      { name: 'date', type: 'date', value: toInputDate(defaultDate) },
    ],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Ok', role: 'confirm' },
    ],
  });

  await alert.present();
  const result = await alert.onDidDismiss();
  const value = result.data?.values?.date;

  return result.role === 'confirm' && value ? value : null;
}
