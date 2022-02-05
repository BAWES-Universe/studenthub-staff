import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
// services
import { TranslateLabelService } from '../providers/translate-label.service';


@Pipe({
    name: 'duration',
    pure: false
})
export class DurationPipe implements PipeTransform {
    
    public timer: number;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public ngZone: NgZone,
        public translate: TranslateLabelService
    ) { }

    transform(start: any, currentLang: any, end: any): string {
        this.removeTimer();

        const date1 = new Date(start.replace(/-/g, '/') + ' GMT+03:00')

        const date2 = (end) ? new Date(end.replace(/-/g, '/') + ' GMT+03:00') : new Date();

        const diff = new Date(date2.getTime() - date1.getTime());

        const seconds = Math.round(Math.abs((date2.getTime() - date1.getTime()) / 1000));

        // console.log( value);
        // console.log( utcTimeNow.getDate() , d.getDate());
        // console.log( ">>>" + (utcTimeNow.getTime() - d.getTime()));
        const timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;

        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, timeToUpdate);
            }
            return null;
        });

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

    ngOnDestroy(): void {
        this.removeTimer();
    }

    public removeTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }

    public getSecondsUntilUpdate(seconds: number) {
        const min = 60;
        const hr = min * 60;
        const day = hr * 24;
        if (seconds < min) { // less than 1 min, update every 2 secs
            return 2;
        } else if (seconds < hr) { // less than an hour, update every 30 secs
            return 30;
        } else if (seconds < day) { // less then a day, update every 5 mins
            return 300;
        } else { // update every hour
            return 3600;
        }
    }
}
