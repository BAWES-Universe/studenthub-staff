import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CountryViewPage = class CountryViewPage {
    constructor(navCtrl, candidateService, countryService, activatedRoute, aws, toastCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.candidateService = candidateService;
        this.countryService = countryService;
        this.activatedRoute = activatedRoute;
        this.aws = aws;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = true;
        this.loadingDetail = false;
        this.deletingCandidate = false;
    }
    ngOnInit() {
        this.country_id = this.activatedRoute.snapshot.paramMap.get('id');
        const state = window.history.state;
        if (state.model) {
            this.country = state.model;
        }
        if (this.country) {
            this.loadData(this.currentPage);
        }
        else {
            this.countryView(this.country_id);
        }
    }
    refresh() {
        this.currentPage = 1;
        this.loadData(1);
    }
    /**
     * load country detail
     * @param page
     */
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load list of candidates
            this.loading = true;
            this.candidateService.listByCountry(this.country, page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.candidates = response.body;
                this.loading = false;
            });
        });
    }
    candidateSelected(candidate) {
        // Load Detail Page
        this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
            state: {
                model: candidate
            }
        });
    }
    // deleteCandidates(candidate) {
    //   let loader = this._loadingCtrl.create();
    //   loader.present();
    //   this.candidateService.delete(candidate).subscribe(jsonResp => {
    //     loader.dismiss();
    //     this.loadData(this.currentPage);
    //   });
    // }
    /**
     * Delete the provided model
     */
    deleteCandidates(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield this.alertCtrl.create({
                header: 'Delete Candidate?',
                message: 'Are you sure you want to delete this Candidate?',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => __awaiter(this, void 0, void 0, function* () {
                            this.deletingCandidate = true;
                            this.candidateService.delete(candidate).subscribe((jsonResp) => __awaiter(this, void 0, void 0, function* () {
                                this.deletingCandidate = false;
                                if (jsonResp.operation == 'error') {
                                    const alert = yield this.alertCtrl.create({
                                        header: 'Deletion Error!',
                                        subHeader: jsonResp.message,
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                if (jsonResp.operation == 'success') {
                                    const toast = yield this.toastCtrl.create({
                                        message: jsonResp.message,
                                        duration: 3000
                                    });
                                    toast.present();
                                }
                                this.loadData(this.currentPage);
                            }));
                        })
                    },
                    {
                        text: 'No',
                        handler: () => {
                        }
                    }
                ]
            });
            confirm.present();
        });
    }
    /**
     * country view
     * @param country_id
     */
    countryView(country_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadingDetail = true;
            this.countryService.view(country_id).subscribe(response => {
                this.loadingDetail = false;
                this.country = response;
                this.loadData(this.currentPage);
            });
        });
    }
    /**
     * @param $event
     * @param candidate
     */
    loadLogo($event, candidate) {
        candidate.candidate_personal_photo = null;
    }
};
CountryViewPage = __decorate([
    Component({
        selector: 'app-country-view',
        templateUrl: './country-view.page.html',
        styleUrls: ['./country-view.page.scss'],
    })
], CountryViewPage);
export { CountryViewPage };
//# sourceMappingURL=country-view.page.js.map