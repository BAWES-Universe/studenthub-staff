import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CompanyRequestListPage = class CompanyRequestListPage {
    constructor(navCtrl, platform, companyService, requestService, aws, alertCtrl, toastCtrl, modalCtrl, router) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.companyService = companyService;
        this.requestService = requestService;
        this.aws = aws;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.router = router;
        this.companies = [];
        this.loading = false;
        this.pageCount = 0;
        this.currentPage = 1;
        this.pages = [];
        this.requests = [];
    }
    ngOnInit() { }
    ionViewWillEnter() {
        this.list(this.currentPage);
    }
    list(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load list of companies
            this.loading = true;
            this.requestService.listWithPagination(page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.requests = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.requestService.listWithPagination(this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.requests = this.requests.concat(response.body);
        }, error => { }, () => {
            this.loading = false;
            event.target.complete();
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
    viewRequest($event, request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.navigate(['request-view', request.request_uuid], {
                state: {
                    model: request,
                    from: 'company-request-list'
                }
            });
        });
    }
    editRequest($event, request) {
        return __awaiter(this, void 0, void 0, function* () {
            $event.preventDefault();
            $event.stopPropagation();
            this.router.navigate(['request-form', request.request_uuid], {
                state: {
                    model: request
                }
            });
        });
    }
    addRequest($event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.navigate(['request-form']);
        });
    }
    startRequest(event, request) {
        event.preventDefault();
        event.stopPropagation();
        this.requestService.start(request).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
            if (response.operation == 'success') {
                request.request_status = 'started';
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
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Save',
                    handler: (data) => {
                        if (data.feedback) {
                            request.request_feedback = data.feedback;
                            this.requestService.cancel(request).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                                if (response.operation == 'success') {
                                    request.request_status = 'cancelled';
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
                        else {
                            this.alertCtrl.create({
                                message: 'Please provide feedback',
                                buttons: ['ok']
                            }).then(alert => {
                                alert.present();
                            });
                        }
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
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Save',
                    handler: (data) => {
                        if (data.feedback) {
                            request.request_feedback = data.feedback;
                            this.requestService.deliver(request).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
                                if (response.operation == 'success') {
                                    request.request_status = 'delivered';
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
                        else {
                            this.alertCtrl.create({
                                message: 'Please provide feedback',
                                buttons: ['ok']
                            }).then(alert => {
                                alert.present();
                            });
                        }
                    }
                }
            ]
        }).then(alert => { alert.present(); });
    }
    loadLogo($event, company) {
        company.company_logo = null;
    }
};
CompanyRequestListPage = __decorate([
    Component({
        selector: 'app-company-request-list',
        templateUrl: './company-request-list.page.html',
        styleUrls: ['./company-request-list.page.scss'],
    })
], CompanyRequestListPage);
export { CompanyRequestListPage };
//# sourceMappingURL=company-request-list.page.js.map