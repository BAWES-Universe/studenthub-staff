import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CandidateBankInfoListPage = class CandidateBankInfoListPage {
    constructor(navCtrl, activatedRoute, aws, candidateIdCardService, candidateService, toastCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.activatedRoute = activatedRoute;
        this.aws = aws;
        this.candidateIdCardService = candidateIdCardService;
        this.candidateService = candidateService;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.pageCount = 0;
        this.currentPage = 1;
        this.totalCount = 0;
        this.searchBar = '';
        this.loading = false;
        this.paginationLoading = false;
        this.downloading = false;
    }
    ngOnInit() {
    }
    ionViewWillEnter() {
        this.loadData(0);
    }
    search() {
        this.currentPage = 1;
        this.loadData(this.currentPage);
    }
    loadData(page) {
        this.loadAssigned(page, this.searchBar);
    }
    /**
     * load assigned user data
     * @param page
     * @param search
     */
    loadAssigned(page, search) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentPage = page;
            // Load list of candidates
            this.loading = true;
            this.candidateService.listWithoutBank(search, page).subscribe(response => {
                this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.candidates = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * get candidate detail from transfer candidate record
     * @param transferCandidate
     */
    // getCandidateDetail(transferCandidate) {
    //   return { store: transferCandidate.store, company: transferCandidate.company, ...transferCandidate.candidate };
    // }
    /**
     * Loads the create page
     */
    create() {
        this.navCtrl.navigateForward('candidate-form');
    }
    doInfinite(event) {
        this.paginationLoading = true;
        this.currentPage++;
        this.candidateService.listWithoutBank(this.searchBar, this.currentPage).subscribe(response => {
            this.paginationLoading = false;
            this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.candidates = this.candidates.concat(response.body);
        }, error => { }, () => { event.target.complete(); });
    }
};
CandidateBankInfoListPage = __decorate([
    Component({
        selector: 'app-candidate-bank-info-list',
        templateUrl: './candidate-bank-info-list.page.html',
        styleUrls: ['./candidate-bank-info-list.page.scss'],
    })
], CandidateBankInfoListPage);
export { CandidateBankInfoListPage };
//# sourceMappingURL=candidate-bank-info-list.page.js.map