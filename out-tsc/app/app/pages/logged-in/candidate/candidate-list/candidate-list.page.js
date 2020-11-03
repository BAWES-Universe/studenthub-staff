import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CandidateListPage = class CandidateListPage {
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
        this.pages = [];
        this.filters = {
            name: null,
            email: null,
            phone: null,
            type: null
        };
        this.searchName = null;
        this.searchEmail = null;
        this.searchPhone = null;
        this.searchType = null;
        this.assignedSearchBar = '';
        this.unassignedSearchBar = '';
        this.cndSegment = 'assigned';
        this.loading = false;
        this.paginationLoading = false;
        this.downloading = false;
    }
    ngOnInit() {
    }
    /**
     * Return url string to filter list
     */
    urlParams() {
        let urlParams = '';
        if (this.filters.name) {
            urlParams += '&name=' + this.filters.name;
        }
        if (this.filters.email) {
            urlParams += '&email=' + this.filters.email;
        }
        if (this.filters.phone) {
            urlParams += '&phone=' + this.filters.phone;
        }
        if (this.filters.type) {
            urlParams += '&type=' + this.filters.type;
        }
        return urlParams;
    }
    /**
     * Reset question filter
     */
    resetFilter() {
        this.filters = {
            name: null,
            email: null,
            phone: null,
            type: null
        };
        this.loadData(1); // reload all result
    }
    /**
     * Generate id cards
     */
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.candidateIdCardService.candidates.length == 0) {
                const prompt = yield this.alertCtrl.create({
                    message: 'Please select candidate(s)',
                    buttons: ['Ok']
                });
                prompt.present();
                return false;
            }
            this.downloading = true;
            this.candidateIdCardService.generate(this.candidateIdCardService.candidates).subscribe(response => {
            }, (err) => {
            }, () => {
                this.downloading = false;
                this.candidateIdCardService.candidates = [];
            });
        });
    }
    ionViewWillEnter() {
        this.loadData(1);
    }
    search() {
        this.currentPage = 1;
        this.loadData(this.currentPage);
    }
    loadData(page) {
        const search = this.urlParams();
        this.currentPage = page;
        // Load list of candidates
        this.loading = true;
        this.candidateService.listFilter(search, page).subscribe(response => {
            this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.candidates = response.body;
        }, error => { }, () => { this.loading = false; });
    }
    /**
     * Loads the create page
     */
    create() {
        this.navCtrl.navigateForward('candidate-form');
    }
    doInfinite(event) {
        const search = this.urlParams();
        this.paginationLoading = true;
        this.currentPage++;
        this.candidateService.listFilter(search, this.currentPage).subscribe(response => {
            this.paginationLoading = false;
            this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.candidates = this.candidates.concat(response.body);
        }, error => { }, () => { event.target.complete(); });
    }
};
CandidateListPage = __decorate([
    Component({
        selector: 'app-candidate-list',
        templateUrl: './candidate-list.page.html',
        styleUrls: ['./candidate-list.page.scss'],
    })
], CandidateListPage);
export { CandidateListPage };
//# sourceMappingURL=candidate-list.page.js.map