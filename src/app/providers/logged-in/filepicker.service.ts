import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';



/**
 * Select plugins based on platform to select files to upload
 */
@Injectable({
    providedIn: 'root'
})
export class FilepickerService {

    constructor(
        private filePicker: IOSFilePicker,
        public fileChooser: FileChooser,
        private filePath: FilePath,
        public platform: Platform
    ) { }

    /**
     * Return file path to upload file
     */
    pick() {
        if (this.platform.is('ios')) {
            return this.pickForIos();
        } else {
            return this.pickForAndroid();
        }
    }

    /**
     * Open fileChooser for Android
     */
    pickForAndroid() {
        return Observable.create((observer: Observer<any>) => {
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
    pickForIos(){

        return Observable.create((observer: Observer<any>) => {

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
}

