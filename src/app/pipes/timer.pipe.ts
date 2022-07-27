import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
// services
import { TranslateLabelService } from '../providers/translate-label.service';


@Pipe({
    name: 'timer',
    pure: false
})
export class TimerPipe implements PipeTransform {
    
    public timer: number;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public ngZone: NgZone,
        public translate: TranslateLabelService
    ) { }

    transform(start: any, end: any = null): string| number {
        this.removeTimer();

        const date1 = new Date(start.replace(/-/g, '/') + ' GMT+03:00');

        const date2 = (end) ? new Date(end.replace(/-/g, '/') + ' GMT+03:00') : new Date();

        const diff = new Date(date2.getTime() - date1.getTime());

        const seconds = Math.round(Math.abs((date2.getTime() - date1.getTime())/ 1000));

        const timeToUpdate = 1000;

        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, timeToUpdate);
            }
            return null;
        });

        const hours = Math.floor(seconds/3600); 
        const minutes = Math.floor((seconds - (hours * 3600))/ 60);
        const rSeconds = seconds - (hours * 3600) - (minutes * 60);

        let time = hours < 10? '0' + hours : hours;

        time += minutes < 10? ':0' + minutes : ':'+minutes;

        time += rSeconds < 10? ':0' + rSeconds : ':'+rSeconds;

        return time;
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
