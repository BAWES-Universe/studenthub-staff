import { __awaiter, __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk';
const { Filesystem } = Plugins;
// declare var AWS;
// declare var AWS;
// export as namespace AWS;
let AwsService = class AwsService {
    constructor(alertController, file) {
        this.alertController = alertController;
        this.file = file;
        this.bucketUrl = 'https://studenthub-public-anyone-can-upload-24hr-expiry.s3.eu-west-2.amazonaws.com/';
        this.permanentBucketUrl = environment.permanentBucketUrl;
        this.cloudinaryUrl = environment.cloudinaryUrl;
        this.urlResume = environment.permanentBucketUrl + 'candidate-resume/';
        this._region = 'eu-west-2'; // London
        this._access_key_id = 'AKIAJXOMRCDE65WKBPUA';
        this._secret_access_key = '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';
        this._bucket_name = 'studenthub-public-anyone-can-upload-24hr-expiry';
        this.maxUploadSize = 18874368; // 18 MB
        this.txtMaxUploadSize = '18MB';
        this.initAwsService();
    }
    /**
     * Initialize the AWS Service
     */
    initAwsService() {
        AWS.config.region = this._region;
        AWS.config.accessKeyId = this._access_key_id;
        AWS.config.secretAccessKey = this._secret_access_key;
    }
    /**
     * Files available in native filesystem need additional processing
     * before they are ready to be uploaded to S3. This function will create
     * a JS File blob that is ready to be accepted via AWS S3 SDK.
     * @param  {string} file_prefix
     * @param  {any} nativeFilePath
     * @returns Promise
     */
    uploadNativePath(nativeFilePath) {
        return new Promise((resolve, reject) => {
            // Resolve File Path on System
            this.file.resolveLocalFilesystemUrl(nativeFilePath).then((entry) => {
                // Convert entry into File Entry which can output a JS File object
                const fileEntry = entry;
                // Return a File object that represents the current state of the file that this FileEntry represents
                fileEntry.file((file) => __awaiter(this, void 0, void 0, function* () {
                    // Store File Details for later use
                    const fileName = file.name;
                    const fileType = file.type;
                    const fileLastModified = file.lastModifiedDate;
                    let fileReadResult;
                    try {
                        fileReadResult = yield Filesystem.readFile({
                            path: nativeFilePath,
                        });
                    }
                    catch (err) {
                        const message = err && err.message ? err.message : 'Error reading file';
                        const alert = yield this.alertController.create({
                            header: 'Error',
                            message,
                            buttons: ['Okay']
                        });
                        yield alert.present();
                        return reject('Error reading file: ' + JSON.stringify(err));
                    }
                    // var blob = new Blob([fileReadResult.data], { type: fileType });
                    const fileBlob = this.b64toBlob(fileReadResult.data, fileType); // blob;//, fileType);//blob;
                    fileBlob.name = fileName;
                    fileBlob.lastModifiedDate = fileLastModified;
                    // Resolve an Observable for File Uploading
                    resolve(this.uploadFile('_', fileBlob));
                }), (error) => {
                    reject('Unable to retrieve file properties: ' + JSON.stringify(error));
                });
            }).catch(err => {
                reject('Error resolving file: ' + JSON.stringify(err));
            });
        });
    }
    /**
     * Upload file to Amazon S3, return an observable to monitor progress
     * @param {string} filePrefix
     * @param {File} file
     * @returns {Observable<any>}
     */
    uploadFile(filePrefix, file = null) {
        // uploadFile(file_prefix: string): Observable<any> {
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        });
        const params = {
            Body: file,
            ACL: 'public-read',
            Bucket: this._bucket_name,
            Key: filePrefix + '-' + Date.now() + '.' + this._getFileExtension(file.name),
            ContentType: file.type // (String) A standard MIME type describing the format of the object file
        };
        return Observable.create((observer) => {
            const currUpload = s3.upload(params);
            observer.next(currUpload);
            currUpload.on('httpUploadProgress', (progress) => {
                observer.next(progress);
            });
            currUpload.send((err, data) => {
                if (err) {
                    observer.error(err);
                }
                else {
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    }
    /**
     * Take file name / path and return the file extension.
     */
    _getFileExtension(path) {
        const basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
        // (supports `\\` and `/` separators)
        pos = basename.lastIndexOf('.'); // get last position of `.`
        if (basename === '' || pos < 1) { // if file name is empty or ...
            return '';
        } //  `.` not found (-1) or comes first (0)
        return basename.slice(pos + 1); // extract extension ignoring `.`
    }
    /**
     * convert base64 data to Blob object
     * @param b64Data
     * @param contentType
     * @param sliceSize
     */
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
};
AwsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AwsService);
export { AwsService };
//# sourceMappingURL=aws.service.js.map