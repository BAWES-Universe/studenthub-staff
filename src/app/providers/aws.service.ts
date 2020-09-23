import {Injectable, OnInit} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import { File as NativeFile, Entry, FileEntry } from '@ionic-native/file/ngx';
import { Plugins, FilesystemDirectory, FilesystemEncoding, FileReadResult } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk';
import {AlertController} from '@ionic/angular';

const { Filesystem } = Plugins;
// declare var AWS;

// declare var AWS;
// export as namespace AWS;

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  public bucketUrl = 'https://studenthub-public-anyone-can-upload-24hr-expiry.s3.eu-west-2.amazonaws.com/';
  public permanentBucketUrl = environment.permanentBucketUrl;
  public cloudinaryUrl = environment.cloudinaryUrl;
  public cloudinaryVideoUrl = environment.cloudinaryVideoUrl;
  public urlResume = environment.permanentBucketUrl + 'candidate-resume/';

  private _region = 'eu-west-2'; // London
  private _access_key_id = 'AKIAJXOMRCDE65WKBPUA';
  private _secret_access_key = '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';
  private _bucket_name = 'studenthub-public-anyone-can-upload-24hr-expiry';

  public maxUploadSize = 18874368; // 18 MB

  public txtMaxUploadSize = '18MB';

  constructor(
    public alertController: AlertController,
    public file: NativeFile
  ){
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
  uploadNativePath(nativeFilePath): Promise<Observable<any>>{
    return new Promise((resolve, reject) => {

      // Resolve File Path on System

      this.file.resolveLocalFilesystemUrl(nativeFilePath).then((entry: Entry) => {

        // Convert entry into File Entry which can output a JS File object
        const fileEntry =  entry as FileEntry;

        // Return a File object that represents the current state of the file that this FileEntry represents
        fileEntry.file(async (file: any) => {

          // Store File Details for later use
          const fileName = file.name;
          const fileType = file.type;
          const fileLastModified = file.lastModifiedDate;

          let fileReadResult;

          try
          {
            fileReadResult = await Filesystem.readFile({
              path: nativeFilePath,
              // encoding: FilesystemEncoding.UTF8
            });
          }
          catch (err)
          {
            const message = err && err.message ? err.message : 'Error reading file';

            const alert = await this.alertController.create({
              header: 'Error',
              message,
              buttons: ['Okay']
            });

            await alert.present();

            return reject('Error reading file: ' + JSON.stringify(err));
          }

          // var blob = new Blob([fileReadResult.data], { type: fileType });
          const fileBlob: any = this.b64toBlob(fileReadResult.data, fileType); // blob;//, fileType);//blob;
          fileBlob.name = fileName;
          fileBlob.lastModifiedDate = fileLastModified;

          // Resolve an Observable for File Uploading

          resolve(this.uploadFile('_', fileBlob));

        }, (error) => {
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
  uploadFile(filePrefix: string, file: File = null): Observable<any> {
  // uploadFile(file_prefix: string): Observable<any> {
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    });

    const params = {
      Body: file, // the actual file file
      ACL: 'public-read', // to allow public access to the file
      Bucket: this._bucket_name, // bucket name
      Key: filePrefix + '-' + Date.now() + '.' + this._getFileExtension(file.name), // file name
      ContentType: file.type // (String) A standard MIME type describing the format of the object file
    };

    return Observable.create((observer: Observer<any>) => {

      const currUpload = s3.upload(params);

      observer.next(currUpload);

      currUpload.on('httpUploadProgress', (progress: ProgressEvent) => {
        observer.next(progress);
      });

      currUpload.send((err, data) => {
        if (err) {
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
    const basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
      // (supports `\\` and `/` separators)
      pos = basename.lastIndexOf('.');       // get last position of `.`

    if (basename === '' || pos < 1) {            // if file name is empty or ...
      return '';
    }                             //  `.` not found (-1) or comes first (0)

    return basename.slice(pos + 1);            // extract extension ignoring `.`
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

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  /**
   * Upload file to Amazon S3, return an observable to monitor progress
   * @param { File } file
   * @returns { Observable<any> }
   */
  // uploadFile(file: File = null): Observable<any> {
  //
  //   let s3 = new AWS.S3({
  //     apiVersion: '2006-03-01'
  //   });
  //
  //   let extension = this._getFileExtension(file.name);
  //
  //   let prefix = this._getFileNameWithoutExtension(file.name);
  //
  //   let key = prefix + "-" + Date.now() + "." + extension;
  //
  //   let params = {
  //     Body: file, // the actual file file
  //     ACL: "public-read", // to allow public access to the file
  //     Bucket: this._bucket_name, //bucket name
  //     Key: key, //file name
  //     ContentType: file.type, //(String) A standard MIME type describing the format of the object file
  //   }
  //
  //   return Observable.create((observer: Observer<any>) => {
  //
  //     if(file.size > this.maxUploadSize) {
  //       return observer.error('File size should not exceed ' + this.txtMaxUploadSize + '!');
  //     }
  //
  //     s3.upload(params).on('httpUploadProgress', (progress: ProgressEvent) => {
  //       observer.next(progress);
  //     }).send((err, data) => {
  //
  //       if(err) {
  //         observer.error(err);
  //       } else {
  //         observer.next(data);
  //       }
  //     });
  //   });
  // }
}
