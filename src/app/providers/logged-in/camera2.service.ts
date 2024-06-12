import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class Camera2Service {

  constructor(
    public _platform: Platform
  ) { }

  /**
   * Opens Camera and returns native file path on selection
   * @returns {Promise<string>} native file path
   */
   getImageFromCamera() {
    return this.getFileFromSource(CameraSource.Camera);
  }

  /**
   * Opens Library and returns native file path on selection
   * @returns {Promise<string>} native file path
   */
  getImageFromLibrary() {
    return this.getFileFromSource(CameraSource.Photos);
  }

  /**
   * Loads specified source (Camera/Photo Library) to get file 
   * which returns a promise of string with native file path
   * @returns native file path
   */
  async getFileFromSource(sourceType) {
    // Get picture from selected source
    let cameraOptions = this._getCameraOptions(sourceType);
    
    const image = await Camera.getPhoto(cameraOptions);
  
    console.log('image', image);

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;

    return image;
  }

  /**
   * Gets camera options based on the device plugin support
   * https://github.com/apache/cordova-plugin-camera
   * @param  {} sourceType
   * @returns CameraOptions
   */
  private _getCameraOptions(sourceType): ImageOptions {

    if (this._platform.is("android")) {
      return {
        quality: 100,
        source: sourceType,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        correctOrientation: true
      };
    }

    return {
      quality: 100,
      source: sourceType,
      allowEditing: true,
      resultType: CameraResultType.Base64 ,
    };
  }
}
