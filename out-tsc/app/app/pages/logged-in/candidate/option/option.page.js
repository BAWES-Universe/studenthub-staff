import { __awaiter, __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let OptionPage = class OptionPage {
    constructor(translateService, authService, candidateService, candidateIdCardService, popoverCtrl, alertCtrl, toastCtrl, eventService) {
        this.translateService = translateService;
        this.authService = authService;
        this.candidateService = candidateService;
        this.candidateIdCardService = candidateIdCardService;
        this.popoverCtrl = popoverCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.eventService = eventService;
        this.updatingJobSearchStatus = false;
        this.sendingPassword = false;
        this.unassinging = false;
        this.assigning = false;
        this.expiring = false;
        this.exportingCV = false;
        this.generating = false;
    }
    ngOnInit() {
    }
    /**
     * close popup
     */
    dismiss() {
        this.popoverCtrl.dismiss();
    }
    /**
     * Show confirm alert to reset password
     */
    resetPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const alert = yield this.alertCtrl.create({
                header: 'Confirm password reset',
                message: 'Do you want to send new password to candidate?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            this.dismiss();
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            this.sendNewPassword();
                        }
                    }
                ]
            });
            alert.present();
        });
    }
    /**
     * Reset and email the candidate a new password
     */
    sendNewPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendingPassword = true;
            this.candidateService.resetPassword(this.candidate).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                this.sendingPassword = false;
                if (response.operation == 'error') {
                    const toast = yield this.toastCtrl.create({
                        message: response.message,
                        duration: 3000
                    });
                    toast.present();
                }
                else {
                    const alert = yield this.alertCtrl.create({
                        header: 'Reset Password',
                        subHeader: 'New password sent to candidate',
                        buttons: ['Okay']
                    });
                    alert.present();
                    this.dismiss();
                }
            }));
        });
    }
    /**
     * Unassign Candidate from store
     */
    unassignCandidateFromStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield this.alertCtrl.create({
                header: 'Are you sure?',
                message: 'Remove candidate from store',
                buttons: [
                    {
                        text: 'Cancel',
                        handler: () => {
                            // Handle the functionality when user click on 'cancel' button
                        }
                    },
                    {
                        text: 'Ok',
                        handler: () => __awaiter(this, void 0, void 0, function* () {
                            // Handle the functionality when user click on 'ok' button
                            this.unassinging = true;
                            // Unassign Candidate from store
                            this.candidateService.removeFromAssignedStore(this.candidate).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                                this.dismiss();
                                // Dismiss the loader
                                this.unassinging = false;
                                if (response.operation == 'success') {
                                    this.candidate.store_id = null;
                                    this.eventService.reloadCandidateHistory$.next();
                                }
                                else {
                                    const prompt = yield this.alertCtrl.create({
                                        message: this._processResponseMessage(response),
                                        buttons: ['Ok']
                                    });
                                    prompt.present();
                                }
                            }));
                        })
                    }
                ]
            });
            confirm.present();
        });
    }
    /**
     * Generate id cards
     */
    generateId() {
        return __awaiter(this, void 0, void 0, function* () {
            this.generating = true;
            const idList = [this.candidate.candidate_id];
            this.candidateIdCardService.generate(idList).subscribe(response => {
            }, err => {
            }, () => {
                this.generating = false;
            });
        });
    }
    renewCard() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield this.alertCtrl.create({
                header: 'Are you sure?',
                message: 'Renew candidate card',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: 'Yes',
                        handler: () => __awaiter(this, void 0, void 0, function* () {
                            // Handle the functionality when user click on 'ok' button
                            this.expiring = true;
                            // Unassign Candidate from store
                            const idList = [this.candidate.candidate_id];
                            this.candidateIdCardService.renew(idList).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                                this.dismiss();
                                // Dismiss the loader
                                this.expiring = false;
                                if (response.operation == 'success') {
                                    this.eventService.reloadCandidateHistory$.next();
                                }
                                const prompt = yield this.alertCtrl.create({
                                    message: this._processResponseMessage(response),
                                    buttons: ['Ok']
                                });
                                prompt.present();
                            }));
                        })
                    }
                ]
            });
            confirm.present();
        });
    }
    /**
     * set candidate card expire
     */
    setExpire() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield this.alertCtrl.create({
                header: 'Are you sure?',
                message: 'Mark candidate card as expired',
                buttons: [
                    {
                        text: 'Cancel',
                        handler: () => {
                            // Handle the functionality when user click on 'cancel' button
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => __awaiter(this, void 0, void 0, function* () {
                            // Handle the functionality when user click on 'ok' button
                            this.expiring = true;
                            // Unassign Candidate from store
                            this.candidateService.expired(this.candidate).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                                this.dismiss();
                                // Dismiss the loader
                                this.expiring = false;
                                if (response.operation == 'success') {
                                    this.eventService.reloadCandidateHistory$.next();
                                }
                                const prompt = yield this.alertCtrl.create({
                                    message: this._processResponseMessage(response),
                                    buttons: ['Ok']
                                });
                                prompt.present();
                            }));
                        })
                    }
                ]
            });
            confirm.present();
        });
    }
    /**
     * set candidate card expire
     */
    exportCV() {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle the functionality when user click on 'ok' button
            this.exportingCV = true;
            // Unassign Candidate from store
            this.candidateService.exportCV(this.candidate).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                this.dismiss();
                // Dismiss the loader
                this.exportingCV = false;
            }));
        });
    }
    toggleJobSearchStatus(status = 'mark_as_looking') {
        this.alertCtrl.create({
            header: 'Are you sure?',
            message: (status == 'mark_as_looking') ? 'Mark as looking for job?' : 'Mark as not looking for job?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        // Handle the functionality when user click on 'cancel' button
                    }
                },
                {
                    text: 'Yes',
                    handler: () => __awaiter(this, void 0, void 0, function* () {
                        this.updatingJobSearchStatus = true;
                        const params = {
                            candidate_id: this.candidate.candidate_id,
                            job_search_status: this.candidate.candidate_job_search_status == 1 ? 0 : 1
                        };
                        this.candidateService.updateJobSearchStatus(params).subscribe((data) => __awaiter(this, void 0, void 0, function* () {
                            this.updatingJobSearchStatus = false;
                            this.dismiss();
                            if (data.operation == 'success') {
                                this.candidate.candidate_job_search_status = this.candidate.candidate_job_search_status == 1 ? 0 : 1;
                                this.eventService.reloadCandiate$.next();
                            }
                            else {
                                this.toastCtrl.create({
                                    message: data.message,
                                    duration: 3000
                                }).then(toast => {
                                    toast.present();
                                });
                            }
                        }));
                    })
                }
            ]
        }).then(confirm => {
            confirm.present();
        });
    }
    /**
     * Process the response coming from the server
     * @private
     * @param {any} response
     * @returns message to display in error message
     */
    _processResponseMessage(response) {
        let html = '';
        if (response.code == 2) {
            for (const i in response.message) {
                for (const j of response.message[i]) {
                    html += j + '<br />';
                }
            }
        }
        else {
            html = response.message;
        }
        return html;
    }
};
__decorate([
    Input()
], OptionPage.prototype, "candidate", void 0);
OptionPage = __decorate([
    Component({
        selector: 'app-option',
        templateUrl: './option.page.html',
        styleUrls: ['./option.page.scss'],
    })
], OptionPage);
export { OptionPage };
//# sourceMappingURL=option.page.js.map