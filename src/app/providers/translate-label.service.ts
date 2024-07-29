import { Injectable } from '@angular/core';
//services
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TranslateLabelService extends TranslateService {

    convertedValue: string;

    toHour(seconds) {
        return Math.ceil(seconds / 3600);
    }

    /**
     * Get translation for given word 
     * @param keyString 
     */
    transform(keyString: string, params = null): string {

        if(!keyString) 
            return keyString; 

        this.convertedValue = '';

        this.get(keyString, params).subscribe(
            value => {
                this.convertedValue = value;
            }
        );
        
        return this.convertedValue;
    }

    /**
     * return app direction 
     */
    direction() {
        return this.currentLang == 'ar' ? 'rtl' : 'ltr';
    }

    /**
     * Return content based on language selected 
     * @param enContent 
     * @param arContent 
     */
    langContent(enContent, arContent) {

        if (this.currentLang == 'ar' && arContent)
            return arContent;

        return enContent;
    }

    /**
     * if content in english
     */
    isEnglish(s) {
        if (s && s[0]) {
            let english = /^[A-Za-z0-9_ ?<>~!@#$%^&*(){}/,.|-]*$/;
            return english.test(s[0]);
        }
        return false;
    }
    
    isString(x) {
        return Object.prototype.toString.call(x) === "[object String]"
    }

    /**
     * json to string error message 
     * @param message 
     */
    errorMessage(message): string {

        if (this.isString(message))
        {
            return message + '';
		}

        let a = [];

        for (let i in message) {

            if (!Array.isArray(message[i])) {
                a.push(message[i]);
                continue;
            }

            for (let j of message[i]) {
                a.push(j);
            }
        }

        return a.join('<br />');
    }

    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
        if (!date) 
            return null;
        
        if (date) {
            return new Date(date.replace(/-/g, '/'));
        }
    }
}
