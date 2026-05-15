import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { format } from 'src/app/util/date-fns';

export interface CalendarDateResult {
  time: number;
  unix: number;
  dateObj: Date;
  string: string;
  years: number;
  months: number;
  date: number;
}

export interface CalendarRangeResult {
  from?: CalendarDateResult;
  to?: CalendarDateResult;
}

export type CalendarResult = CalendarDateResult | CalendarRangeResult;

export interface CalendarModalOptions {
  canBackwardsSelected?: boolean;
  defaultDate?: Date | string | number;
  defaultDateRange?: {
    from?: Date | string | number;
    to?: Date | string | number;
  };
  defaultScrollTo?: Date | string | number;
  from?: Date | string | number;
  pickMode?: 'single' | 'range';
  title?: string;
  to?: Date | string | number;
}

export type CalendarComponentOptions = CalendarModalOptions;

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ options?.title || 'Select date' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="calendar-fields">
        <label>
          <span>{{ isRange ? 'From' : 'Date' }}</span>
          <input
            type="date"
            [min]="minValue"
            [max]="maxValue"
            [(ngModel)]="fromValue"
            (ngModelChange)="syncRange()"
          />
        </label>

        <label *ngIf="isRange">
          <span>To</span>
          <input
            type="date"
            [min]="rangeMinValue"
            [max]="maxValue"
            [(ngModel)]="toValue"
          />
        </label>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="confirm()">Done</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [`
    .calendar-fields {
      display: grid;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 8px;
      color: var(--ion-color-medium);
      font-size: 14px;
    }

    input {
      width: 100%;
      min-height: 44px;
      border: 1px solid var(--ion-color-light-shade);
      border-radius: 4px;
      padding: 0 12px;
      background: var(--ion-background-color);
      color: var(--ion-text-color);
      font: inherit;
    }
  `]
})
export class CalendarModal implements OnInit {
  @Input() options: CalendarModalOptions = {};

  fromValue: string;
  toValue: string;
  minValue: string | undefined;
  maxValue: string | undefined;

  constructor(private modalCtrl: ModalController) {}

  get isRange() {
    return this.options?.pickMode === 'range';
  }

  get rangeMinValue() {
    return this.options?.canBackwardsSelected === false ? this.fromValue : this.minValue;
  }

  ngOnInit() {
    const today = new Date();
    const defaultDate = this.coerceDate(
      this.options?.defaultDate ||
      this.options?.defaultScrollTo ||
      this.options?.defaultDateRange?.from ||
      today
    );
    const defaultTo = this.coerceDate(this.options?.defaultDateRange?.to || defaultDate);

    this.fromValue = this.toInputValue(defaultDate);
    this.toValue = this.toInputValue(defaultTo);
    this.minValue = this.options?.canBackwardsSelected === false
      ? this.toInputValue(today)
      : this.toOptionalInputValue(this.options?.from);
    this.maxValue = this.toOptionalInputValue(this.options?.to);
    this.syncRange();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    const from = this.toResult(this.fromValue);

    if (!this.isRange) {
      this.modalCtrl.dismiss(from);
      return;
    }

    const to = this.toResult(this.toValue || this.fromValue);
    this.modalCtrl.dismiss({ from, to });
  }

  syncRange() {
    if (!this.isRange || this.options?.canBackwardsSelected !== false || !this.fromValue || !this.toValue) {
      return;
    }

    if (new Date(this.toValue).getTime() < new Date(this.fromValue).getTime()) {
      this.toValue = this.fromValue;
    }
  }

  private coerceDate(value: Date | string | number): Date {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      console.warn('CalendarModal: Invalid date value coerced to today:', value);
      return new Date();
    }
    return date;
  }

  private toInputValue(value: Date | string | number): string {
    return format(this.coerceDate(value), 'yyyy-MM-dd');
  }

  private toOptionalInputValue(value?: Date | string | number): string | undefined {
    return value ? this.toInputValue(value) : undefined;
  }

  private toResult(value: string): CalendarDateResult {
    const date = this.coerceDate(value);

    return {
      time: date.getTime(),
      unix: Math.floor(date.getTime() / 1000),
      dateObj: date,
      string: format(date, 'yyyy-MM-dd'),
      years: date.getFullYear(),
      months: date.getMonth() + 1,
      date: date.getDate()
    };
  }
}
