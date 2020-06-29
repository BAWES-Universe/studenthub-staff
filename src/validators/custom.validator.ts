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
        
        return emailReg.test(control.value) ? null : {'emailValidation':'email is invalid.'};
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
}
