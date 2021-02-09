import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from "@angular/core";


@Pipe({
	name: 'age',
})
export class AgePipe implements PipeTransform {

    public timer: number;

    constructor(
    ) {}

	transform(value: number) {
	
        if(!value) {
        	return 0;
        }

        let now = new Date();
		
		let seconds = Math.round(Math.abs((now.getTime()/1000) - value));
		
        let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));

		if (Number.isNaN(seconds)){
			return '';
		} else if (seconds <= 45) {
			return 'a few seconds';
		} else if (seconds <= 90) {
			return 'a minute';
		} else if (minutes <= 45) {
			return minutes + ' minutes';
		} else if (minutes <= 90) {
			return 'an hour';
		} else if (hours <= 22) {
			return hours + ' hours';
		} else if (hours <= 36) {
			return 'a day';
		} else if (days <= 25) {
			return days + ' days';
		} else if (days <= 45) {
			return 'a month';
		} else if (days <= 345) {
			return months + ' months';
		} else if (days <= 545) {
			return 'a year';
		} else { // (days > 545)
			return years + ' years';
		}
    }
}

