import { Component, Input, forwardRef, Renderer, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Platform, AlertController, ActionSheetController } from 'ionic-angular';

import { AwsService } from '../../providers/aws.service';
import { CameraService } from '../../providers/camera.service';

/*
  AWS S3 Image Upload Component 
  Uploads file then emits event with its details
*/
@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.html',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor {
  // File input used for browser fallback when no cordova is available
  @ViewChild('fileInput') fileInput:ElementRef;

  // Default value the form element should have 
  // (In case an image has already been uploaded for it)
  _value: string;

  // Icon to use, by default its a regular image icon
  @Input() label: string = "Photo";
  // Icon to use, by default its a regular image icon
  @Input() icon: string = "image";
  // File prefix when uploading to S3
  @Input() prefix: string = "image";

  // Used for link generation after upload
  public bucketUrl: string;
  private _bucketUrlTemporary: string;
  private _bucketUrlPermanent: string;

  // Progress variables
  public isUploading = false;

  // the method set in registerOnChange, it is just 
  // a placeholder for a method that takes one parameter, 
  // we use it to emit changes back to the form
  private _propagateChange = (_: any) => {};

  constructor(
    private _platform: Platform,
    private _renderer:Renderer,
    private _awsService: AwsService,
    private _cameraService: CameraService,
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController
    ) {
      this._bucketUrlPermanent = this._awsService.permanentBucketUrl;
      this._bucketUrlTemporary = this._awsService.bucketUrl;

      // By Default, use the permanent bucket url
      this.bucketUrl = this._bucketUrlPermanent;
  }

  /**
   * Upload Photo button clicked
   * - On Native device, load native camera/gallery
   * - On Browser, trigger a click on the html file input
   */
  uploadBtnClicked(){
    // If already uploading, do nothing, just return
    if(this.isUploading) return;

    if(this._platform.is("cordova")){
      // Display action sheet giving user option of camera vs local filesystem.
      let actionSheet = this._actionSheetCtrl.create({
        title: "Select image source",
        buttons: [
          {
            text: 'Load from Library',
            handler: () => {
              this._cameraService.getImageFromLibrary().then((nativeImageFilePath) => {
                  // Upload and process for progress
                  this.uploadFileViaNativeFilePath(nativeImageFilePath);
              }, (err) => {
                  // Error getting picture
                  // alert("Error getting picture from Library: " + JSON.stringify(err));
                  console.log("Error getting picture from Library: " + JSON.stringify(err));
              });;
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this._cameraService.getImageFromCamera().then((nativeImageFilePath) => {
                  // Upload and process for progress
                  this.uploadFileViaNativeFilePath(nativeImageFilePath);
              }, (err) => {
                  // Error getting picture
                  // alert("Error getting picture from Camera: " + JSON.stringify(err));
                  console.log("Error getting picture from Camera: " + JSON.stringify(err));
              });;
            }
          }
        ]
      });
      actionSheet.present();

    }else{
      // Trigger click event on regular HTML file input
      let event = new MouseEvent('click', {bubbles: true});
      this._renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
    }
  }


  /**
   * Upload the selected file through regular HTML file input 
   * This method will only be called if the target is not a cordova app.
   * @param  {any} $event
   */
  uploadFileViaHtmlFileInput($event){
    let fileList: FileList = $event.target.files;

    // Check if files available
    if(fileList.length > 0){
      let file = fileList.item(0);

      // Upload The File
      let uploadObservable = this._awsService.uploadFile(this.prefix, file);
      this.processFileUpload(uploadObservable);
    }
  }

  /**
   * Upload the selected file through regular HTML file input 
   * This method will only be called if the target is not a cordova app.
   * @param  {any} path
   */
  uploadFileViaNativeFilePath(path){
    // Upload and process for progress
    this._awsService.uploadNativePath(this.prefix, path)
      .then((uploadObservable) => {
        this.processFileUpload(uploadObservable);
      })
      .catch((err) => {
        alert(err);
      });
  }

  /**
   * Process S3 upload by subscribing to progress observable
   * @param  {} uploadObservable
   */
  processFileUpload(uploadObservable){
    // Create Temporary Transfer Record
    let newUpload = {
      name: "Preparing file for upload",
      status: "uploading",
      loaded: 0,
      total: 100,
      link: ''
    };

    // Show File Upload Indicator based on which file is being uploaded
    this.isUploading = true;

    // Process Upload and Display Progress
    uploadObservable.subscribe((progress) => {
      // Update progress, possibly create emitter for this data if needed
      if(progress.loaded &&  progress.loaded != progress.total){
          newUpload.status = "uploading";
          newUpload.loaded = progress.loaded;
          newUpload.total = progress.total;
      }
      // If Multipart upload (big file), Key with capital "K"
      if(progress.key || progress.Key){
        newUpload.name = progress.key? progress.key : progress.Key; 
        newUpload.link = this._bucketUrlTemporary + newUpload.name;
      }
    }, (err) => {
      console.log("Error", err);
      newUpload.status = "error";
      // Hide File Upload Indicator based on which file is being uploaded
      this.isUploading = false;
    }, () => {
      newUpload.status = "complete";
      // Hide File Upload Indicator based on which file is being uploaded
      this.isUploading = false;
      // Switch to temporary bucket url
      this.bucketUrl = this._bucketUrlTemporary;
      // Set the new value of this file upload 
      this.value = newUpload.name;
    });
  }

  /**
   * Getter for Value
   */
  get value() {
    return this._value;
  }
  /**
   * Setter for Value
   */
  set value(val) {
    this._value = val;
    // Notify of changes
    this._propagateChange(this._value);
  }

  /**
   * ControlValueAccessor interface methods
   * - They allow this component to be used as a form element (with validation and ngModel)
   */

  /**
   * Called on form Init / Update
   * @param {*} obj
   */
  writeValue(obj: any) {
    if (obj) {
      this.value = obj;
    }
  }

  /**
   * Propogate change on change, notify outside world of changes
   * @param {any} fn
   */
  registerOnChange(fn) {
    this._propagateChange = fn;
  }

  /**
   * Called on touch/ element blur
   */
  registerOnTouched() {}

    
}
