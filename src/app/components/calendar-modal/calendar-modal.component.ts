import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'src/app/util/date-fns';

export interface CalendarDay {
  dateObj: Date;
  string: string;
  unix: number;
}

export interface CalendarResult extends CalendarDay {
  from?: CalendarDay;
  to?: CalendarDay;
}

export interface CalendarModalOptions {
  canBackwardsSelected?: boolean;
  defaultDate?: Date | string;
  defaultDateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  defaultScrollTo?: Date | string;
  pickMode?: 'single' | 'range';
  title?: string;
}

export type CalendarComponentOptions = CalendarModalOptions;

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
})
export class CalendarModal implements OnInit {
  @Input() options: CalendarModalOptions = {};

  fromValue: string;
  toValue: string;
  value: string;
  minDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const today = new Date();
    const defaultFrom = this.options.defaultDateRange?.from || this.options.defaultDate || today;
    const defaultTo = this.options.defaultDateRange?.to || this.options.defaultDate || today;

    this.fromValue = this.toIonDate(defaultFrom);
    this.toValue = this.toIonDate(defaultTo);
    this.value = this.toIonDate(this.options.defaultDate || defaultTo);

    if (this.options.canBackwardsSelected === false) {
      this.minDate = this.toIonDate(today);
    }
  }

  get isRangeMode() {
    return this.options.pickMode === 'range';
  }

  get title() {
    return this.options.title || 'Select Date';
  }

  onFromChange(event) {
    this.fromValue = event.detail.value;
  }

  onToChange(event) {
    this.toValue = event.detail.value;
  }

  onValueChange(event) {
    this.value = event.detail.value;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.isRangeMode) {
      const from = this.toCalendarDay(this.fromValue);
      const to = this.toCalendarDay(this.toValue);

      this.modalCtrl.dismiss({
        ...from,
        from,
        to,
      });
      return;
    }

    this.modalCtrl.dismiss(this.toCalendarDay(this.value));
  }

  private toIonDate(value: Date | string): string {
    const date = value instanceof Date ? value : parseISO(value);
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

    return format(safeDate, 'yyyy-MM-dd');
  }

  private toCalendarDay(value: string): CalendarDay {
    const date = parseISO(value);

    return {
      dateObj: date,
      string: format(date, 'yyyy-MM-dd'),
      unix: Math.floor(date.getTime() / 1000),
    };
  }
}
