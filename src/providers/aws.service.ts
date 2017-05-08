import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs/rx';

import { File as NativeFile, Entry, FileEntry }  from '@ionic-native/file';

declare var AWS;

@Injectable()
export class AwsService {
    public bucketUrl = "https://bawes-public.s3.eu-west-2.amazonaws.com/";
    public permanentBucketUrl = "https://sh-payroll.s3.eu-west-2.amazonaws.com/";
    
    private _region = "eu-west-2"; //London
    private _access_key_id = "AKIAI5ZFAKH7R3WIHWXQ";
    private _secret_access_key = "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";
    private _bucket_name = "bawes-public";

    constructor(private _file: NativeFile){
        this.initAwsService();
    }

    /**
     * Initialize the AWS Service
     */
    initAwsService(){
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
    uploadNativePath(file_prefix: string, nativeFilePath): Promise<Observable<any>>{
        return new Promise((resolve, reject) => {
            // Resolve File Path on System 
            this._file.resolveLocalFilesystemUrl(nativeFilePath).then((entry: Entry) => {
                // Convert entry into File Entry which can output a JS File object
                let fileEntry =  entry as FileEntry;

                // Return a File object that represents the current state of the file that this FileEntry represents
                fileEntry.file((file: any) => {

                    // Store File Details for later use
                    let fileName = file.name;
                    let fileType = file.type;
                    let fileLastModified = file.lastModifiedDate;

                    // Read File as Array Buffer, Convert to Blob, then to JS File
                    var reader = new FileReader();
                    reader.onloadend = (event: any) => {
                        var blob = new Blob([new Uint8Array(event.target.result)], { type: fileType });
                        var file: any = blob;
                        file.name = fileName;
                        file.lastModifiedDate = fileLastModified;

                        // Resolve an Observable for File Uploading
                        resolve(this.uploadFile(file_prefix, file));
                    };
                    reader.readAsArrayBuffer(file);

                }, (error) => {
                    reject("Unable to retrieve file properties: " + JSON.stringify(error));
                });
            }).catch(err => { 
                reject("Error resolving file " + JSON.stringify(err));
            });

        });
    }

    /**
     * Upload file to Amazon S3, return an observable to monitor progress
     * @param {string} file_prefix
     * @param {File} file
     * @returns {Observable<any>}
     */
    uploadFile(file_prefix: string, file: File): Observable<any> {
        let s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        });

        let params = {
            Body: file, // the actual file file
            ACL: "public-read", // to allow public access to the file
            Bucket: this._bucket_name, //bucket name
            Key: file_prefix + "-" + Date.now() + "." + this._getFileExtension(file.name), //file name
            ContentType: file.type //(String) A standard MIME type describing the format of the object file
        }

        return Observable.create((observer: Observer<any>) => {
            s3.upload(params).on('httpUploadProgress', (progress: ProgressEvent) => {
                observer.next(progress);
            }).send((err, data) => {
                if(err) {
                    observer.error(err);
                }else {
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    }

    /**
     * Take file name / path and return the file extension.
     */
    private _getFileExtension(path) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                                                // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }

}