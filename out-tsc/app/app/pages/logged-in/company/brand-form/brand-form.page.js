import { __awaiter, __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
let BrandFormPage = class BrandFormPage {
    constructor(platform, brandService, authService, _cameraService, sentryService, awsService, _fb, actionSheetCtrl, alertCtrl, modalCtrl, _toastCtrl) {
        this.platform = platform;
        this.brandService = brandService;
        this.authService = authService;
        this._cameraService = _cameraService;
        this.sentryService = sentryService;
        this.awsService = awsService;
        this._fb = _fb;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this._toastCtrl = _toastCtrl;
        this.saving = false;
    }
    ngOnInit() {
        this._initForm();
    }
    /**
     * init form
     */
    _initForm() {
        // Init Form
        if (!this.model) { // Show Create Form
            this.operation = 'Add Brand';
            this.form = this._fb.group({
                name_en: ['', Validators.required],
                name_ar: ['', Validators.required],
                logo_path: [''],
                logo: [''],
            });
        }
        else { // Show Update Form
            this.operation = 'Update Brand';
            this.form = this._fb.group({
                name_en: [this.model.brand_name_en, Validators.required],
                name_ar: [this.model.brand_name_en, Validators.required],
                logo_path: [this.awsService.cloudinaryUrl + 'company-brand/' + this.model.brand_logo],
                logo: [this.model.brand_logo],
            });
        }
    }
    /**
     * Update Model Data based on Form Input
     */
    updateModelDataFromForm() {
        this.model.brand_name_en = this.form.value.name_en;
        this.model.brand_name_ar = this.form.value.name_ar;
        this.model.brand_logo = this.form.value.logo;
    }
    /**
     * Close the page
     */
    close() {
        this.modalCtrl.dismiss({ refresh: false });
    }
    /**
     * Save the model
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.saving = true;
            this.updateModelDataFromForm();
            let action;
            if (!this.model.brand_uuid) {
                // Create
                action = this.brandService.create(this.model);
            }
            else {
                // Update
                action = this.brandService.update(this.model);
            }
            action.subscribe((jsonResponse) => __awaiter(this, void 0, void 0, function* () {
                this.saving = false;
                // On Success
                if (jsonResponse.operation == 'success') {
                    // Close the page
                    const data = { refresh: true };
                    this.modalCtrl.dismiss(data);
                    const toast = yield this._toastCtrl.create({
                        message: this.model.brand_name_en + ' saved successfully',
                        duration: 3000
                    });
                    toast.present();
                }
                // On Failure
                if (jsonResponse.operation == 'error') {
                    const prompt = yield this.alertCtrl.create({
                        message: this.authService.errorMessage(jsonResponse.message),
                        buttons: ['Ok']
                    });
                    prompt.present();
                }
            }), () => {
                this.saving = false;
            });
        });
    }
    /**
     * Upload logo from mobile
     */
    mobileUpload() {
        const SelectSourceLbl = 'Select image source';
        const LoadLibLbl = 'Load from Library';
        const ErrorLibLbl = 'Error getting picture from Library: ';
        const UseCamLbl = 'Use Camera';
        const ErrorCamLbl = 'Error getting picture from Camera: ';
        const arrButtons = [
            {
                text: LoadLibLbl,
                handler: () => {
                    this._cameraService.getImageFromLibrary().then((nativeImageFilePath) => {
                        // Upload and process for progress
                        this.uploadFileViaNativeFilePath(nativeImageFilePath);
                    }, (err) => __awaiter(this, void 0, void 0, function* () {
                        const ignoreErrors = [
                            'No image picked',
                            'User cancelled photos app'
                        ];
                        if (err && ignoreErrors.indexOf(err.message) > -1) {
                            return null;
                        }
                        const alert = yield this.alertCtrl.create({
                            header: 'Error getting picture from Library',
                            message: err.message,
                            buttons: ['Okay']
                        });
                        yield alert.present();
                        this.progress = null;
                    }));
                }
            },
            {
                text: UseCamLbl,
                handler: () => {
                    this._cameraService.getImageFromCamera().then((nativeImageFilePath) => {
                        // Upload and process for progress
                        this.uploadFileViaNativeFilePath(nativeImageFilePath);
                    }, (err) => __awaiter(this, void 0, void 0, function* () {
                        const ignoreErrors = [
                            'No image picked',
                            'User cancelled photos app'
                        ];
                        if (err && ignoreErrors.indexOf(err.message) > -1) {
                            return null;
                        }
                        const alert = yield this.alertCtrl.create({
                            header: 'Error getting picture from Library',
                            message: err.message,
                            buttons: ['Okay']
                        });
                        yield alert.present();
                        this.progress = null;
                    }));
                }
            }
        ];
        // Display action sheet giving user option of camera vs local filesystem.
        this.actionSheetCtrl.create({
            header: SelectSourceLbl,
            buttons: arrButtons
        }).then(actionSheet => actionSheet.present());
    }
    /**
     * Upload logo by native path
     */
    uploadFileViaNativeFilePath(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            this.progress = 1; // show loader
            this.awsService.uploadNativePath(uri).then(o => {
                o.subscribe(event => {
                    this._handleFileSuccess(event);
                }, (err) => __awaiter(this, void 0, void 0, function* () {
                    this.progress = false;
                    const ignoreErrors = [
                        'No image picked',
                        'User cancelled photos app',
                    ];
                    if (err && ignoreErrors.indexOf(err.message) > -1) {
                        return null;
                    }
                    // log to slack/sentry to know how many user getting file upload error
                    this.sentryService.handleError(err);
                    // always show abstract error message
                    let message;
                    const networkErrors = [
                        '504:null',
                        'NetworkingError: Network Failure'
                    ];
                    // networking errors
                    if (err && networkErrors.indexOf(err.message) > -1) {
                        message = 'Error uploading file';
                        // system errors
                    }
                    else if (err.message && err.message.indexOf(':') > -1) {
                        message = 'Error getting file from Library';
                        // plugin errors
                    }
                    else if (err.message) {
                        message = err.message;
                        // custom file validation errors
                    }
                    else {
                        message = err;
                    }
                    const alert = yield this.alertCtrl.create({
                        header: 'Error',
                        message,
                        buttons: ['Okay']
                    });
                    yield alert.present();
                }));
            });
        });
    }
    /**
     * Upload logo from browser
     * @param event
     */
    browserUpload(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileList = event.target.files;
            if (fileList.length == 0) {
                return false;
            }
            const prefix = fileList[0].name.split('.')[0];
            const type = fileList[0].type.split('/')[0];
            if (type != 'image') {
                this.alertCtrl.create({
                    message: 'Invalid File format',
                    buttons: ['Ok']
                }).then(alert => { alert.present(); });
            }
            else {
                this.progress = 1;
                this.uploadFileSubscription = this.awsService.uploadFile('_', fileList[0]).subscribe(event => {
                    this._handleFileSuccess(event);
                }, (err) => __awaiter(this, void 0, void 0, function* () {
                    // log to sentry
                    this.sentryService.handleError(err);
                    if (this.fileInput && this.fileInput.nativeElement) {
                        this.fileInput.nativeElement.value = null;
                    }
                    const alert = yield this.alertCtrl.create({
                        header: 'Error',
                        message: 'Error while uploading file!',
                        buttons: ['Okay']
                    });
                    yield alert.present();
                    this.progress = false;
                }), () => {
                    this.uploadFileSubscription.unsubscribe();
                });
            }
        });
    }
    /**
     * Handle logo upload api response
     * @param event
     */
    _handleFileSuccess(event) {
        // Via this API, you get access to the raw event stream.
        // Look for upload progress events.
        if (event.type === 'progress') {
            // This is an upload progress event. Compute and show the % done:
            this.progress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.Key && event.Key.length > 0) {
            if (this.fileInput && this.fileInput.nativeElement) {
                this.fileInput.nativeElement.value = null;
            }
            const imgLarge = new Image();
            imgLarge.src = event.Location;
            imgLarge.onload = () => {
                this.form.controls.logo_path.setValue(event.Location);
                this.form.controls.logo.setValue(event.Key);
                this.form.controls.logo.markAsDirty();
                this.form.updateValueAndValidity();
                this.model.brand_logo = event.Key;
                this.progress = null;
            };
        }
        else {
            this.currentTarget = event;
        }
    }
    /**
     * Display options to update logo
     */
    updatePhoto(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.platform.is('capacitor')) {
                this.mobileUpload();
            }
            else {
                this.fileInput.nativeElement.click();
            }
        });
    }
    /**
     * trigger click event on change logo button
     */
    triggerUpdatePhoto($event) {
        $event.stopPropagation();
        document.getElementById('upload-pic').click();
        // this.fileInput.nativeElement.click();
    }
    /**
     * cancel file upload
     */
    cancelUpload() {
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = null;
        }
        this.progress = null;
        this.currentTarget.abort();
    }
};
__decorate([
    ViewChild('fileInput', { static: false })
], BrandFormPage.prototype, "fileInput", void 0);
__decorate([
    ViewChild('btnChangePhoto', { static: false })
], BrandFormPage.prototype, "btnChangePhoto", void 0);
BrandFormPage = __decorate([
    Component({
        selector: 'app-brand-form',
        templateUrl: './brand-form.page.html',
        styleUrls: ['./brand-form.page.scss'],
    })
], BrandFormPage);
export { BrandFormPage };
//# sourceMappingURL=brand-form.page.js.map