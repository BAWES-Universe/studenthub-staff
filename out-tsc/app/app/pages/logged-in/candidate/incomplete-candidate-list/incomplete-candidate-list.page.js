import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let IncompleteCandidateListPage = class IncompleteCandidateListPage {
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
        this.SearchBar = '';
        this.loading = false;
        this.paginationLoading = false;
        this.downloading = false;
    }
    ngOnInit() {
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
        this.currentPage = 1;
        this.loadData(this.currentPage);
    }
    search() {
        this.currentPage = 1;
        this.loadData(this.currentPage);
    }
    loadData(page) {
        this.loadAssigned(page, this.SearchBar);
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
            this.candidateService.listAssigned(search, page, 1).subscribe(response => {
                this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.candidates = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * Loads the create page
     */
    create() {
        this.navCtrl.navigateForward('candidate-form');
    }
    doInfinite(event) {
        this.paginationLoading = true;
        this.currentPage++;
        this.candidateService.listAssigned(this.SearchBar, this.currentPage, 1).subscribe(response => {
            this.paginationLoading = false;
            this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.candidates = this.candidates.concat(response.body);
        }, error => { }, () => { event.target.complete(); });
    }
};
IncompleteCandidateListPage = __decorate([
    Component({
        selector: 'app-incomplete-candidate-list',
        templateUrl: './incomplete-candidate-list.page.html',
        styleUrls: ['./incomplete-candidate-list.page.scss'],
    })
], IncompleteCandidateListPage);
export { IncompleteCandidateListPage };
//# sourceMappingURL=incomplete-candidate-list.page.js.map