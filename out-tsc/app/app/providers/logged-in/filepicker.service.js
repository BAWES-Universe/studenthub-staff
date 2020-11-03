import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Select plugins based on platform to select files to upload
 */
let FilepickerService = class FilepickerService {
    constructor(filePicker, fileChooser, filePath, platform) {
        this.filePicker = filePicker;
        this.fileChooser = fileChooser;
        this.filePath = filePath;
        this.platform = platform;
    }
    /**
     * Return file path to upload file
     */
    pick() {
        if (this.platform.is('ios')) {
            return this.pickForIos();
        }
        else {
            return this.pickForAndroid();
        }
    }
    /**
     * Open fileChooser for Android
     */
    pickForAndroid() {
        return Observable.create((observer) => {
            this.fileChooser.open().then(uri => {
                this.filePath.resolveNativePath(uri)
                    .then(filePath => {
                    observer.next(filePath);
                    observer.complete();
                })
                    .catch(err => observer.error(err));
            });
        });
    }
    /**
     * Open FilePicker for iOS
     */
    pickForIos() {
        return Observable.create((observer) => {
            this.filePicker.pickFile()
                .then(uri => {
                observer.next(encodeURI('file://' + uri));
                observer.complete();
            })
                .catch(err => {
                console.error('Error', err);
            });
        });
    }
};
FilepickerService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FilepickerService);
export { FilepickerService };
//# sourceMappingURL=filepicker.service.js.map