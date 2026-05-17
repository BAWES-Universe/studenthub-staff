import { AlertController } from '@ionic/angular';
import { format } from 'date-fns';

export interface DateRangeSelection {
  from: string;
  to: string;
}

function toInputDate(value?: Date | string | number): string {
  if (!value) {
    return format(new Date(), 'yyyy-MM-dd');
  }

  const date = value instanceof Date
    ? value
    : new Date(typeof value === 'string' ? value.replace(/-/g, '/') : value);

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

  return {
    from: values.from,
    to: values.to,
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
