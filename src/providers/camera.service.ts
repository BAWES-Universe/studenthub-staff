import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraService {

    constructor(
        private _platform: Platform,
        private _camera: Camera,
    ){
        // Cleanup Temporary Camera Files on iOS on app load
        if(this._platform.is('ios')){
            this._camera.cleanup();
        }
    }

    /**
     * Opens Camera and returns native file path on selection
     * @returns {Promise<string>} native file path
     */
    getImageFromCamera(){
        return this.getFileFromSource(this._camera.PictureSourceType.CAMERA);
    }

    /**
     * Opens Library and returns native file path on selection
     * @returns {Promise<string>} native file path
     */
    getImageFromLibrary(){
        return this.getFileFromSource(this._camera.PictureSourceType.PHOTOLIBRARY);
    }

    /**
     * Loads specified source (Camera/Photo Library) to get file 
     * which returns a promise of string with native file path
     * @returns {Promise<string>} native file path
     */
    getFileFromSource(sourceType): Promise<string>{
        // Get picture from selected source
        let cameraOptions = this._getCameraOptions(sourceType);
        return this._camera.getPicture(cameraOptions);
    }


    /**
     * Gets camera options based on the device plugin support
     * @param  {} sourceType
     * @returns CameraOptions
     */
    private _getCameraOptions(sourceType): CameraOptions{
        if(this._platform.is("android")){
            return {
                quality: 100,
                sourceType: sourceType,
                allowEdit: false,
                destinationType: this._camera.DestinationType.FILE_URI,
                encodingType: this._camera.EncodingType.JPEG,
                mediaType: this._camera.MediaType.PICTURE,
                correctOrientation: true
            };
        }

        return {
            quality: 100,
            sourceType: sourceType,
            allowEdit: true,
            destinationType: this._camera.DestinationType.FILE_URI,
            encodingType: this._camera.EncodingType.JPEG,
            mediaType: this._camera.MediaType.PICTURE
        };
    }
    

}