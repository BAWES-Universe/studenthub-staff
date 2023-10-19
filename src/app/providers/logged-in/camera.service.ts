import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private _platform: Platform
  ) {
    // Cleanup Temporary Camera Files on iOS on app load
    /*if(this._platform.is('ios')){
      Camera.cleanup();
    }*/
  }

  /**
   * Opens Camera and returns native file path on selection
   * @returns {Promise<string>} native file path
   */
  getImageFromCamera() {
    return this.getPic('cam');
  }

  /**
   * Opens Library and returns native file path on selection
   * @returns {Promise<string>} native file path
   */
  getImageFromLibrary() {
    return this.getPic('photo');
  }

  /**
   * Loads specified source (Camera/Photo Library) to get file
   * which returns a promise of string with native file path
   * @returns {Promise<string>} native file path
   */
  // getFileFromSource(sourceType): Promise<string>{
  //   // Get picture from selected source
  //   let cameraOptions = this._getCameraOptions(sourceType);
  //   return this._camera.getPicture(cameraOptions);
  // }


  /**
   * Gets camera options based on the device plugin support
   * @param  {} sourceType
   * @returns CameraOptions
   */
  // private _getCameraOptions(sourceType): CameraOptions{
  //   if(this._platform.is("android")){
  //     return {
  //       quality: 100,
  //       sourceType: sourceType,
  //       allowEdit: false,
  //       destinationType: this._camera.DestinationType.FILE_URI,
  //       encodingType: this._camera.EncodingType.JPEG,
  //       mediaType: this._camera.MediaType.PICTURE,
  //       correctOrientation: true
  //     };
  //   }
  //
  //   return {
  //     quality: 100,
  //     sourceType: sourceType,
  //     allowEdit: true,
  //     destinationType: this._camera.DestinationType.FILE_URI,
  //     encodingType: this._camera.EncodingType.JPEG,
  //     mediaType: this._camera.MediaType.PICTURE
  //   };
  // }

  /**
   * get picture
   * @param type
   */
  async getPic(type = 'cam') {

    let image;
    
    if(this._platform.is('android')) {
      image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: (type == 'cam') ? CameraSource.Camera : CameraSource.Photos
      });
    }
    else 
    {
      image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: (type == 'cam') ? CameraSource.Camera : CameraSource.Photos
      });
    }

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    
    return image.path;//webPath
  }
}
