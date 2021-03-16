import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';


@Pipe({
	name: 'timeAgo',
	pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {

    public timer: number;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public ngZone: NgZone
    ) {}

	transform(value: string) {
    this.removeTimer();
      const d = (value) ? new Date(value.replace(/ /g,'T')) : this.kuwaitCurrentTime(new Date());
      // console.log(value,  new Date(value.replace(/ /g,'T') ));
      // const d = (value) ? new Date(value) : this.kuwaitCurrentTime(new Date());
      const utcTimeNow = this.kuwaitCurrentTime(new Date());
      // console.log(d, utcTimeNow);
      // console.log(utcTimeNow.getTime(), d.getTime());
      // console.log(utcTimeNow.getTime() - d.getTime());
      const seconds = Math.round(Math.abs((utcTimeNow.getTime() - d.getTime()) / 1000));
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
        return 'a few seconds ago';
      } else if (seconds <= 90) {
        return 'a minute ago';
      } else if (minutes <= 45) {
        return minutes + ' minutes ago';
      } else if (minutes <= 90) {
        return 'an hour ago';
      } else if (hours <= 22) {
        // return `
        // ${value} ==== ${d}<br/>
        // ${utcTimeNow.getHours()} ${d.getHours()} ${hours} hours ago<br/>
        // ${utcTimeNow}
        // `;
        return `${hours} hours ago`;
      } else if (hours <= 36) {
        return 'a day ago';
      } else if (days <= 25) {
        return days + ' days ago';
      } else if (days <= 45) {
        return 'a month ago';
      } else if (days <= 345) {
        return months + ' months ago';
      } else if (days <= 545) {
        return 'a year ago';
      } else { // (days > 545)
        return years + ' years ago';
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

  /**
   * kuwait current time
   * @param date
   * @param tzString = 'Asia/Kuwait'
   */
	kuwaitCurrentTime(date, tzString = 'Asia/Kuwait') {
    
    const time = new Date((typeof date === "string" ? new Date(date) : date).toLocaleString('en-US', {timeZone: tzString}));
    // console.log(date, time);
    return time;
  }
}

