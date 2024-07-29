import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
// services
import { TranslateLabelService } from '../providers/translate-label.service';


@Pipe({
    name: 'durationBySecond',
    pure: false
})
export class DurationBySecondPipe implements PipeTransform {
     
    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public ngZone: NgZone,
        public translate: TranslateLabelService
    ) { }

    transform(seconds: number): string {
         
        const minutes = Math.round(Math.abs(seconds / 60));
        const hours = Math.round(Math.abs(minutes / 60));
        const days = Math.round(Math.abs(hours / 24));
        const months = Math.round(Math.abs(days / 30.416));
        const years = Math.round(Math.abs(days / 365));
    
        if (Number.isNaN(seconds)){
            return '';
        } else if (seconds <= 45) {
            return this.translate.transform('a few seconds');
        } else if (seconds <= 90) {
            return this.translate.transform('a minute');
        } else if (minutes <= 45) {
            return this.translate.transform('txt_minutes', { value: minutes });
        } else if (minutes <= 90) {
            return this.translate.transform('an hour');
        } else if (hours <= 22) {
            return this.translate.transform('txt_hours', { value: hours });
        } else if (hours <= 36) {
            return this.translate.transform('a day');
        } else if (days <= 25) {
            return this.translate.transform('txt_days', { value: days });
        } else if (days <= 45) {
            return this.translate.transform('a month');
        } else if (days <= 345) {
            return this.translate.transform('txt_months', { value: months });
        } else if (days <= 545) {
            return this.translate.transform('a year');
        } else { // (days > 545)
            return this.translate.transform('txt_years', { value: years });
        }
    }
}
