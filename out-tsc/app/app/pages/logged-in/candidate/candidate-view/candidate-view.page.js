import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
//pages
import { OptionPage } from "../option/option.page";
let CandidateViewPage = class CandidateViewPage {
    constructor(navCtrl, router, platform, activatedRoute, alertCtrl, storeService, candidateService, aws, toastCtrl, eventService, authService, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.router = router;
        this.platform = platform;
        this.activatedRoute = activatedRoute;
        this.alertCtrl = alertCtrl;
        this.storeService = storeService;
        this.candidateService = candidateService;
        this.aws = aws;
        this.toastCtrl = toastCtrl;
        this.eventService = eventService;
        this.authService = authService;
        this.popoverCtrl = popoverCtrl;
        this.salaryTransfers = [];
        this.workHistory = [];
        this.loadingSalaryTransfers = false;
        this.sendingPassword = false;
        this.assigning = false;
        this.unassinging = false;
        this.loading = false;
        this.approving = false;
        this.unapproving = false;
        this.sections = 'personal';
        this.processing = null;
        this.updatingJobSearchStatus = false;
        this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    ngOnInit() {
        this.eventService.reloadCandidateHistory$.subscribe((res) => {
            this.loadCandidateDetail();
            this.loadWorkHistoryData();
        });
        this.eventService.reloadCandiate$.subscribe((res) => {
            this.loadCandidateDetail();
        });
    }
    ionViewDidEnter() {
        // const state = window.history.state;
        // if (state.model) {
        //   this.candidate = state.model;
        // } else  {
        //   this.loadCandidateDetail();
        // }
        this.loadCandidateDetail();
        this.loadWorkHistoryData();
        this.loadStoreData();
        this.loadTransfersData();
    }
    /**
     * Load list of all salary transfers
     */
    loadTransfersData() {
        this.loadingSalaryTransfers = true;
        this.candidateService.transfers(this.candidate_id).subscribe(response => {
            this.loadingSalaryTransfers = false;
            this.salaryTransfers = response;
        }, () => {
            this.loadingSalaryTransfers = false;
        });
    }
    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
        if (date) {
            return new Date(date.replace(/-/g, '/'));
        }
    }
    /**
     * Load list of all stores then set store name and id as per candidate data
     */
    loadStoreData() {
        this.storeService.list('store_id', 'storeWithCompany').subscribe(response => {
            this.stores = response;
        });
    }
    /**
     * Loads Form in modal to update
     */
    update() {
        this.navCtrl.navigateForward('candidate-form/' + this.candidate.candidate_id, {
            state: {
                model: this.candidate
            }
        });
    }
    /**
     * Assign Candidate to Store
     * @param {number} store_id
     */
    assignCandidateToStore(store_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assigning = true;
            this.candidateService.assignCandidateToStore(this.candidate, store_id).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                this.assigning = false;
                if (response.operation == 'success') {
                    this.candidate.store_id = store_id;
                    this.loadCandidateDetail();
                    this.loadWorkHistoryData();
                }
                else {
                    this.candidate.store_id = null;
                    const alert = yield this.alertCtrl.create({
                        message: this._processResponseMessage(response),
                        buttons: ['Ok']
                    });
                    alert.present();
                }
            }));
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
    /**
     * Load candidate work history data
     */
    loadWorkHistoryData() {
        this.candidateService.workHistory(this.candidate_id).subscribe(response => {
            this.workHistory = response;
        });
    }
    loadCandidateDetail(loading = true) {
        this.loading = loading;
        this.candidateService.detail(this.candidate_id).subscribe(response => {
            this.loading = false;
            this.candidate = response;
        });
    }
    /**
     * @param $event
     * @param candidate
     */
    loadLogo($event, candidate) {
        candidate.candidate_personal_photo = null;
    }
    /**
     * Approve the provided model
     */
    approve(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            this.approving = true;
            this.candidateService.approve(candidate).subscribe(response => {
                this.approving = false;
                if (response.operation == 'error') {
                    this.toastCtrl.create({
                        message: this.authService.errorMessage(response.message),
                        duration: 3000
                    }).then(toast => {
                        toast.present();
                    });
                }
                else {
                    this.candidate.approved = 1;
                    // update review count
                    this.eventService.reviewRequired$.next();
                    // back to listing
                    // this.router.navigate(['/candidate-review-list']);
                }
            });
        });
    }
    /**
     * unapprove the provided model
     */
    unapprove(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unapproving = true;
            this.candidateService.unapprove(candidate).subscribe(response => {
                this.unapproving = false;
                if (response.operation == 'error') {
                    this.toastCtrl.create({
                        message: this.authService.errorMessage(response.message),
                        duration: 3000
                    }).then(toast => {
                        toast.present();
                    });
                }
                else {
                    this.candidate.approved = 0;
                    // update review count
                    this.eventService.reviewRequired$.next();
                    // back to listing
                    // this.router.navigate(['/candidate-review-list']);
                }
            }, () => {
                this.unapproving = false;
            });
        });
    }
    /**
     * Display Popover with Additional Actions (Change Password and Logout)
     * @param e
     */
    openPopover(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const popover = yield this.popoverCtrl.create({
                component: OptionPage,
                componentProps: {
                    candidate: this.candidate
                },
                event: e
            });
            popover.present();
        });
    }
    segmentChanged($e) {
        this.sections = $e.detail.value;
    }
    updateRate($e) {
        this.alertCtrl.create({
            header: 'Set hourly rate',
            inputs: [
                {
                    name: 'rate',
                    type: 'text',
                    placeholder: 'Hourly Rate'
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
                        this.processing = 'setting_hours';
                        if (data.rate) {
                            this.candidateService.updateHour(this.candidate, data.rate).subscribe(response => {
                                this.processing = false;
                                if (response.operation == 'error') {
                                    this.toastCtrl.create({
                                        message: this.authService.errorMessage(response.message),
                                        duration: 3000
                                    }).then(toast => {
                                        toast.present();
                                    });
                                }
                                else {
                                    this.loadCandidateDetail(false);
                                }
                            });
                        }
                    }
                }
            ]
        }).then(alert => { alert.present(); });
    }
    getResumeUrl(candidate) {
        return this.aws.permanentBucketUrl + 'candidate-resume/' + encodeURIComponent(candidate.candidate_resume);
    }
};
CandidateViewPage = __decorate([
    Component({
        selector: 'app-candidate-view',
        templateUrl: './candidate-view.page.html',
        styleUrls: ['./candidate-view.page.scss'],
    })
], CandidateViewPage);
export { CandidateViewPage };
//# sourceMappingURL=candidate-view.page.js.map