import { Pipe, PipeTransform } from "@angular/core";
//services 
import { TranslateLabelService } from '../providers/translate-label.service';


@Pipe({
	name:'age',
	pure:false
})
export class AgePipe implements PipeTransform {

    public timer: number;
    
    constructor(
        public translate: TranslateLabelService
    ) {}
    
	transform(value: string) {
		
		let d = (value) ? new Date(value.replace(/-/g, '/') + ' UTC'):new Date();
		let now = new Date();
		let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));
		
		let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		//let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));
		
		if (Number.isNaN(seconds)){
			return '';
		} else if (days <= 545) {
			return this.translate.transform('a year old');
		} else { // (days > 545)
			return this.translate.transform('txt_years_old', { value: years });
		}
    }
}

