import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { format } from 'date-fns';

export interface CalendarResult {
  string: string;
  unix: number;
  date: Date;
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

export interface CalendarComponentOptions extends CalendarModalOptions {}

@Component({
  selector: 'ion-calendar-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ options?.title || 'Select Date' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ng-container *ngIf="isRange; else singleDate">
        <ion-item lines="none">
          <ion-label position="stacked">From</ion-label>
          <ion-datetime
            presentation="date"
            [min]="minDate"
            [value]="fromValue"
            (ionChange)="updateFrom($event)"
          ></ion-datetime>
        </ion-item>

        <ion-item lines="none">
          <ion-label position="stacked">To</ion-label>
          <ion-datetime
            presentation="date"
            [min]="minDate"
            [value]="toValue"
            (ionChange)="updateTo($event)"
          ></ion-datetime>
        </ion-item>
      </ng-container>

      <ng-template #singleDate>
        <ion-datetime
          presentation="date"
          [min]="minDate"
          [value]="singleValue"
          (ionChange)="updateSingle($event)"
        ></ion-datetime>
      </ng-template>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="confirm()">Done</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class CalendarModal {
  @Input() options: CalendarModalOptions = {};

  singleValue = this.toInputValue(new Date());
  fromValue = this.toInputValue(new Date());
  toValue = this.toInputValue(new Date());
  minDate: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const today = new Date();
    const range = this.options?.defaultDateRange;

    this.singleValue = this.toInputValue(this.options?.defaultDate || this.options?.defaultScrollTo || today);
    this.fromValue = this.toInputValue(range?.from || this.options?.defaultScrollTo || today);
    this.toValue = this.toInputValue(range?.to || this.options?.defaultScrollTo || today);

    if (this.options?.canBackwardsSelected === false) {
      this.minDate = this.toInputValue(today);
    }
  }

  get isRange() {
    return this.options?.pickMode === 'range';
  }

  normalizeValue(value: string | string[] | null | undefined) {
    if (Array.isArray(value)) {
      return value[0] || this.toInputValue(new Date());
    }

    return value || this.toInputValue(new Date());
  }

  updateFrom(event: Event) {
    this.fromValue = this.normalizeValue((event as CustomEvent).detail?.value);
  }

  updateTo(event: Event) {
    this.toValue = this.normalizeValue((event as CustomEvent).detail?.value);
  }

  updateSingle(event: Event) {
    this.singleValue = this.normalizeValue((event as CustomEvent).detail?.value);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.isRange) {
      this.modalCtrl.dismiss({
        from: this.toResult(this.fromValue),
        to: this.toResult(this.toValue),
      });
      return;
    }

    this.modalCtrl.dismiss(this.toResult(this.singleValue));
  }

  private toInputValue(value: Date | string) {
    return format(this.toDate(value), 'yyyy-MM-dd');
  }

  private toResult(value: Date | string): CalendarResult {
    const date = this.toDate(value);

    return {
      string: format(date, 'yyyy-MM-dd'),
      unix: Math.floor(date.getTime() / 1000),
      date,
    };
  }

  private toDate(value: Date | string) {
    return value instanceof Date ? value : new Date(value);
  }
}

@NgModule({
  declarations: [CalendarModal],
  imports: [CommonModule, IonicModule],
  exports: [CalendarModal],
})
export class CalendarModule {}
