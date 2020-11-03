import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CompanyRequestViewPage = class CompanyRequestViewPage {
    constructor(modalCtrl, alertCtrl, toastCtrl, loadingCtrl, route, authService, requestService, requestActivityService, menuCtrl, navCtrl, translateLabelService, platform) {
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.route = route;
        this.authService = authService;
        this.requestService = requestService;
        this.requestActivityService = requestActivityService;
        this.menuCtrl = menuCtrl;
        this.navCtrl = navCtrl;
        this.translateLabelService = translateLabelService;
        this.platform = platform;
        this.requestActivities = [];
        this.loading = false;
        this.loadingInvoice = false;
        this.loadingActivities = false;
        this.pickingUp = false;
        this.txtActivity = '';
        this.addingActivity = false;
        this.borderLimit = false;
    }
    ngOnInit() {
        this.request_uuid = this.route.snapshot.params.request_uuid;
        const model = window.history.state.model;
        this.loadDetail();
        // this.loadInvoice();
    }
    /**
     * list invoices
     */
    listInvoice() {
        this.loadRequestActivities();
        // this.loadInvoice();
    }
    showMarkCompleteAlert() {
        return __awaiter(this, void 0, void 0, function* () {
            // if (this.checkUserPhoneVerified()) {
            //   const alert = await this.alertCtrl.create({
            //     header: 'Mark Complete',
            //     message: 'How satisfied is the customer?',
            //     inputs: [
            //       {
            //         name: 'reason',
            //         type: 'text',
            //       },
            //     ],
            //     buttons: [
            //       {
            //         text: 'Cancel',
            //         role: 'cancel',
            //         cssClass: 'secondary'
            //       }, {
            //         text: 'Okay',
            //         handler: (data) => {
            //           if (data.reason && data.reason.length > 0) {
            //             this.markComplete(data.reason);
            //           } else {
            //             return false;
            //           }
            //         }
            //       }
            //     ]
            //   });
            //   await alert.present();
            // }
        });
    }
    /**
     * mark request as complete
     * @param reason
     */
    // async markComplete(reason) {
    //
    //   const loader = await this.loadingCtrl.create();
    //   loader.present();
    //
    //   const params = {
    //     request_uuid: this.request.request_uuid,
    //     reason
    //   };
    //
    //   this.requestService.markComplete(params).subscribe(jsonResponse => {
    //
    //     // On Success
    //
    //     if (jsonResponse.operation == 'success') {
    //
    //       this.loadRequestActivities();
    //
    //       this.request.request_status = 40;
    //       this.request.request_updated_datetime = jsonResponse.request_updated_datetime;
    //
    //       this.toastCtrl.create({
    //         message: jsonResponse.message,
    //         duration: 3000,
    //         position: 'top'
    //       }).then(toast => toast.present());
    //     }
    //
    //     // On Failure
    //     if (jsonResponse.operation == 'error') {
    //
    //       this.alertCtrl.create({
    //         message: this.translateLabelService.errorMessage(jsonResponse.message),
    //         buttons: ['Ok']
    //       }).then(prompt => prompt.present());
    //     }
    //   }, () => {
    //   }, () => {
    //     loader.dismiss();
    //   });
    // }
    //
    // /**
    //  * mark request as cancel
    //  * @param reason
    //  */
    // async markCancel(reason) {
    //
    //   const loader = await this.loadingCtrl.create();
    //   loader.present();
    //
    //   const params = {
    //     request_uuid: this.request.request_uuid,
    //     reason
    //   };
    //
    //   this.requestService.markCancel(params).subscribe(jsonResponse => {
    //
    //     // On Success
    //
    //     if (jsonResponse.operation == 'success') {
    //
    //       this.loadRequestActivities();
    //
    //       this.request.request_status = 30;
    //       this.request.request_updated_datetime = jsonResponse.request_updated_datetime;
    //
    //       this.toastCtrl.create({
    //         message: jsonResponse.message,
    //         duration: 3000,
    //         position: 'top'
    //       }).then(toast => toast.present());
    //     }
    //
    //     // On Failure
    //     if (jsonResponse.operation == 'error') {
    //
    //       this.alertCtrl.create({
    //         message: this.translateLabelService.errorMessage(jsonResponse.message),
    //         buttons: ['Ok']
    //       }).then(prompt => prompt.present());
    //     }
    //   }, () => {
    //   }, () => {
    //     loader.dismiss();
    //   });
    // }
    //
    /**
     * close this modal
     */
    dismiss() {
        const state = window.history.state;
        console.log(state);
        this.modalCtrl.getTop().then(overlay => {
            if (overlay) {
                overlay.dismiss();
            }
            else if (state && state.from == 'company-request-list') {
                this.navCtrl.navigateBack('/company-request-list');
            }
            else if (state && state.from == 'client') {
                this.navCtrl.navigateBack('/client');
            }
            else {
                this.navCtrl.navigateBack('/default');
            }
        });
    }
    /**
     * add new activity to request
     */
    addActivity() {
        if (this.txtActivity.length == 0) {
            return null;
        }
        this.addingActivity = true;
        const params = {
            detail: this.txtActivity,
            request_uuid: this.request_uuid
        };
        this.requestService.addActivity(params).subscribe(data => {
            if (data.operation == 'success') {
                this.loadRequestActivities();
                this.txtActivity = '';
                this.request.request_updated_datetime = data.request_updated_datetime;
            }
            else {
                this.alertCtrl.create({
                    message: this.translateLabelService.errorMessage(data.message),
                    buttons: ['Ok']
                }).then(prompt => prompt.present());
            }
        }, () => {
        }, () => {
            this.addingActivity = false;
        });
    }
    /**
     * load request detail
     */
    loadDetail() {
        this.loading = true;
        this.requestService.view(this.request_uuid).subscribe(data => {
            this.request = data;
            this.loadRequestActivities();
        }, () => {
        }, () => {
            this.loading = false;
        });
    }
    /**
     * load request detail
     */
    loadRequestActivities() {
        this.loadingActivities = true;
        this.requestActivityService.list(1, this.request_uuid).subscribe(data => {
            this.requestActivities = data.body;
        }, () => {
        }, () => {
            this.loadingActivities = false;
        });
    }
    /**
     * show alert to post update on request
     */
    showUpdateAlert() {
        this.alertCtrl.create({
            message: 'Post update',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        if (!data.activity)
                            return null;
                        this.txtActivity = data.activity;
                        this.addActivity();
                    }
                }],
            inputs: [
                {
                    name: 'activity',
                    type: 'text',
                    placeholder: 'Enter update detail'
                }
            ]
        }).then(prompt => prompt.present());
    }
    logScrolling(e) {
        //   this.borderLimit = (e.detail.scrollTop > 0) ?  true : false;
    }
    startRequest(event, request) {
        event.preventDefault();
        event.stopPropagation();
        this.requestService.start(request).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
            if (response.operation == 'success') {
                request.request_status = 'started';
                this.loadRequestActivities();
            }
            else {
                this.toastCtrl.create({
                    message: response.message,
                    buttons: ['Ok']
                }).then(prompt => {
                    prompt.present();
                });
            }
        }));
    }
    cancelledRequest(event, request) {
        this.alertCtrl.create({
            header: 'Please provide feedback',
            inputs: [
                {
                    name: 'feedback',
                    type: 'textarea',
                    placeholder: 'Feedback'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Save',
                    handler: (data) => {
                        if (!data.feedback) {
                            this.alertCtrl.create({
                                message: 'Please provide feedback',
                                buttons: ['Okay']
                            }).then(alert => {
                                alert.present();
                            });
                        }
                        request.request_feedback = data.feedback;
                        this.requestService.cancel(request).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                            if (response.operation == 'success') {
                                request.request_status = 'cancelled';
                                this.loadRequestActivities();
                            }
                            else {
                                this.toastCtrl.create({
                                    message: response.message,
                                    buttons: ['Okay']
                                }).then(prompt => {
                                    prompt.present();
                                });
                            }
                        }));
                    }
                }
            ]
        }).then(alert => { alert.present(); });
    }
    deliveredRequest(event, request) {
        event.preventDefault();
        event.stopPropagation();
        this.alertCtrl.create({
            header: 'Please provide feedback',
            inputs: [
                {
                    name: 'feedback',
                    type: 'textarea',
                    placeholder: 'Feedback'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Save',
                    handler: (data) => {
                        if (!data.feedback) {
                            this.alertCtrl.create({
                                message: 'Please provide feedback',
                                buttons: ['Okay']
                            }).then(alert => {
                                alert.present();
                            });
                        }
                        request.request_feedback = data.feedback;
                        this.requestService.deliver(request).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                            if (response.operation == 'success') {
                                request.request_status = 'delivered';
                                this.loadRequestActivities();
                            }
                            else {
                                this.toastCtrl.create({
                                    message: response.message,
                                    buttons: ['Ok']
                                }).then(prompt => {
                                    prompt.present();
                                });
                            }
                        }));
                    }
                }
            ]
        }).then(alert => { alert.present(); });
    }
};
CompanyRequestViewPage = __decorate([
    Component({
        selector: 'app-company-request-view',
        templateUrl: './company-request-view.page.html',
        styleUrls: ['./company-request-view.page.scss'],
    })
], CompanyRequestViewPage);
export { CompanyRequestViewPage };
//# sourceMappingURL=company-request-view.page.js.map