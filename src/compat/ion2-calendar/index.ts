import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

export interface CalendarResult {
  string?: string;
  unix?: number;
  dateObj?: Date;
  from?: CalendarResult;
  to?: CalendarResult;
}

export interface CalendarModalOptions {
  title?: string;
  pickMode?: 'single' | 'range';
  canBackwardsSelected?: boolean;
  defaultScrollTo?: Date;
  defaultDateRange?: {
    from?: Date;
    to?: Date;
  };
}

export type CalendarComponentOptions = CalendarModalOptions;

@Component({
  selector: 'compat-calendar-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ options?.title || 'Select Date' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="dismiss()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ng-container *ngIf="isRangeMode; else singleMode">
        <ion-item>
          <ion-label position="stacked">From</ion-label>
          <input class="native-date-input" type="date" [(ngModel)]="fromValue" />
        </ion-item>
        <ion-item>
          <ion-label position="stacked">To</ion-label>
          <input class="native-date-input" type="date" [(ngModel)]="toValue" />
        </ion-item>
      </ng-container>

      <ng-template #singleMode>
        <ion-item>
          <ion-label position="stacked">Date</ion-label>
          <input class="native-date-input" type="date" [(ngModel)]="singleValue" />
        </ion-item>
      </ng-template>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button expand="block" (click)="confirm()">Done</ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      .native-date-input {
        width: 100%;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        padding: 12px 0;
      }
    `,
  ],
})
export class CalendarModal implements OnInit {
  @Input() options: CalendarModalOptions = {};

  singleValue = '';
  fromValue = '';
  toValue = '';

  constructor(private readonly modalCtrl: ModalController) {}

  get isRangeMode(): boolean {
    return this.options?.pickMode === 'range';
  }

  ngOnInit(): void {
    if (this.isRangeMode) {
      this.fromValue = this.formatDate(
        this.options?.defaultDateRange?.from || this.options?.defaultScrollTo || new Date()
      );
      this.toValue = this.formatDate(
        this.options?.defaultDateRange?.to || this.options?.defaultScrollTo || new Date()
      );
      return;
    }

    this.singleValue = this.formatDate(
      this.options?.defaultDateRange?.from || this.options?.defaultScrollTo || new Date()
    );
  }

  dismiss(): Promise<boolean> {
    return this.modalCtrl.dismiss(undefined, 'cancel');
  }

  confirm(): Promise<boolean> {
    if (this.isRangeMode) {
      let from = this.toResult(this.fromValue);
      let to = this.toResult(this.toValue);

      if (!from || !to) {
        return this.dismiss();
      }

      if (this.options?.canBackwardsSelected === false && (from.unix || 0) > (to.unix || 0)) {
        [from, to] = [to, from];
      }

      return this.modalCtrl.dismiss({ from, to }, 'confirm');
    }

    const single = this.toResult(this.singleValue);
    return this.modalCtrl.dismiss(single, 'confirm');
  }

  private toResult(value: string): CalendarResult | undefined {
    if (!value) {
      return undefined;
    }

    const dateObj = new Date(`${value}T00:00:00`);
    return {
      string: value,
      unix: Math.floor(dateObj.getTime() / 1000),
      dateObj,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

@NgModule({
  declarations: [CalendarModal],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [CalendarModal],
})
export class CalendarModule {}
