import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
//services
import { TranslateService } from '@ngx-translate/core';
let TranslateLabelService = class TranslateLabelService extends TranslateService {
    /**
     * Get translation for given word
     * @param keyString
     */
    transform(keyString, params = null) {
        if (!keyString)
            return keyString;
        this.convertedValue = '';
        this.get(keyString, params).subscribe(value => {
            this.convertedValue = value;
        });
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
    /**
     * json to string error message
     * @param message
     */
    errorMessage(message) {
        if (message.length) {
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
};
TranslateLabelService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], TranslateLabelService);
export { TranslateLabelService };
//# sourceMappingURL=translate-label.service.js.map