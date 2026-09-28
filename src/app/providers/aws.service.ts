import { Injectable } from '@angular/core';
import { File as NativeFile, Entry, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { Observable } from 'rxjs';
import { Filesystem } from '@capacitor/filesystem';
import { Platform, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { TEMP_UPLOAD_HOST, uploadTemporaryFile } from './temp-upload-session';


@Injectable({
    providedIn: 'root'
})
export class AwsService {
    // https://studenthub-public-anyone-can-upload-24hr-expiry.s3.amazonaws.com/

    // https://studenthub-uploads-dev-server.s3.amazonaws.com/

    // https://studenthub-uploads.s3.amazonaws.com/

    public bucketUrl = 'https://studenthub-public-anyone-can-upload-24hr-expiry.s3.amazonaws.com/';
    public permanentBucketUrl = environment.permanentBucketUrl;
    public cloudinaryUrl = environment.cloudinaryUrl;

    public urlResume = environment.permanentBucketUrl + 'candidate-resume/';

    /**
     * Resolved profile photo URL from backend, with legacy Cloudinary fallback.
     */
    getCandidatePersonalPhotoUrl(candidate: {
        candidate_personal_photo?: string | null;
        candidate_personal_photo_url?: string | null;
    } | null | undefined): string | null {
        if (!candidate) {
            return null;
        }

        if (candidate.candidate_personal_photo_url) {
            return candidate.candidate_personal_photo_url;
        }

        if (candidate.candidate_personal_photo) {
            return this.cloudinaryUrl + 'candidate-photo/' + candidate.candidate_personal_photo;
        }

        return null;
    }

    hasCandidatePersonalPhoto(candidate: {
        candidate_personal_photo?: string | null;
        candidate_personal_photo_url?: string | null;
    } | null | undefined): boolean {
        return !!this.getCandidatePersonalPhotoUrl(candidate);
    }

    public maxUploadSize = 5242880; // 5 MB

    public txtMaxUploadSize = '5MB';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        public platform: Platform,
        public alertController: AlertController,
        public file: NativeFile
    ) {
    }

    /**
     * Files available in native filesystem need additional processing
     * before they are ready to be uploaded to S3. This function will create
     * a JS File blob that is ready to be accepted via AWS S3 SDK.
     * @param  { any } nativeFilePath
     * @returns Promise
     */
    uploadNativePath(nativeFilePath, allowedExtensions: string[] = null): Promise<Observable<any>>{
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
                    const blobFile: any = this.b64toBlob(fileReadResult.data, fileType); // blob;//, fileType);//blob;
                    blobFile.name = fileName;
                    blobFile.lastModifiedDate = fileLastModified;

                    // Resolve an Observable for File Uploading

                    resolve(this.uploadFile(blobFile, allowedExtensions));

                }, (error) => {
                    reject('Unable to retrieve file properties: ' + JSON.stringify(error));
                });
            }).catch(err => {
                reject('Error resolving file: ' + JSON.stringify(err));
            });
        });
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
    uploadFile(file: File = null, allowedExtensions: string[] = null): Observable<any> {
        const token = this.authService.getAccessToken();

        return uploadTemporaryFile({
            file,
            maxBytes: this.maxUploadSize,
            oversizedMessage: 'File size should not exceed ' + this.txtMaxUploadSize + '!',
            presignUrl: environment.apiEndpoint + '/temp-upload/url',
            token: token || '',
            uploadHost: TEMP_UPLOAD_HOST,
            allowedExtensions,
            post: (url, body, headers) => this.http.post(url, body, {
                headers: new HttpHeaders(headers)
            })
        });
    }

    /**
     * Take file name / path and return the file name without extension.
     */
    private _getFileNameWithoutExtension(path) {
        const basename = path.split(/[\\/]/).pop(),  // extract file name from full path ... (supports `\\` and `/` separators)

        pos = basename.lastIndexOf('.');       // get last position of `.`

        if (basename === '' || pos < 1) {            // if file name is empty or ...
            return '';
        }                             //  `.` not found (-1) or comes first (0)

        return this.normalizeFileName(basename.slice(0, pos));            // extract file name ignoring `.` without extension
    }

    /**
     * replace space in name with `-`
     * @param fileName
     */
    normalizeFileName(fileName) {
        return fileName.replace(/ /g, '-').replace(/%20/g, '-').replace(/([^a-z0-9 ]+)/gi, '-');
    }

    /**
     * Take file name / path and return the file extension.
     */
    getFileExtension(path) {
        const basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                                                // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf('.');       // get last position of `.`

        if (basename === '' || pos < 1) {            // if file name is empty or ...
            return '';
        }                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }
}

