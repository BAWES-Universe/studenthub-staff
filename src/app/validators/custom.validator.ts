import { AbstractControl, ValidatorFn } from '@angular/forms';


export class CustomValidator{

    /**
     * Validates Email Input
     * @param  {AbstractControl} control
     * @returns any
     */
    static emailValidator(control: AbstractControl): {[key: string]: any}
    {
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return !control.value || emailReg.test(control.value) ? null : {'emailValidation':'email is invalid.'};
    }

    /**
     * Validates negative number input
     * @param  {AbstractControl} control
     * @returns any
     */
    static negativeNumberValidator(control: AbstractControl): {[key: string]: any}
    {
        if(!control.value) return null;
        
        return Number(control.value) >= 0 ? null : {'negativeNumberValidation':'Negative number not allowed.'};
    }

    /**
     * Factory Method
     * Takes a forbidden name and returns a validator function to be used
     * @param  {string} nameRe
     * @returns ValidatorFn
     */
    static forbiddenNameValidator(nameRe: string): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
        const name = control.value;
        return name == nameRe ? {'forbiddenName': {name}} : null;
        };
    }

    /**
     * compare time in hh:mm AM/PM format
     * @param startTimeKey 
     * @param endTimeKey 
     * @returns 
     */
    static timeComparisonValidator(startTimeKey: string, endTimeKey: string): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const startTime = formGroup.get(startTimeKey)?.value;
            const endTime = formGroup.get(endTimeKey)?.value;
 
            if (!startTime || !endTime) {
                return null; // Don't validate if any time field is missing
            }

            const start = CustomValidator.convertTo24HourFormat(startTime);
            const end = CustomValidator.convertTo24HourFormat(endTime);

            //const end = new Date(format(parseISO(endTime), 'yyyy-MM-dd'));
            // `1970-01-01T${endTime}`);//
 
            if (!start || !end) {
                return { invalidTimeFormat: true }; // In case the time format is incorrect
            }

            // Check if times are the same or if endTime is not greater than startTime
            if (start >= end) {
                return { timeComparisonInvalid: true };
            }

            return null;
        };
    }

    // Helper function to convert "10:40 PM" format to a Date object
    static convertTo24HourFormat(time: string): Date | null {
        const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
        const match = time.match(timeRegex);
    
        if (!match) return null; // Invalid time format
    
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
    
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (period === 'AM' && hours === 12) {
            hours = 0;
        }
    
        // Use an arbitrary date, since we're only comparing time
        return new Date(`1970-01-01T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    }
    
}
