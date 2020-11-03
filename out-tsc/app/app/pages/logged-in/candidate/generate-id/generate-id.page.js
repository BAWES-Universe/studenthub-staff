import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let GenerateIdPage = class GenerateIdPage {
    constructor(candidateIdCardService, _fb, _alertCtrl) {
        this.candidateIdCardService = candidateIdCardService;
        this._fb = _fb;
        this._alertCtrl = _alertCtrl;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = false;
        this.downloading = false;
        this.searchBar = '';
        this.cndSegment = 'not-generated';
        this.candidates = [];
        this.form = this._fb.group({
            candidates: [],
        });
    }
    ngOnInit() {
        this.loadData(this.currentPage);
    }
    /**
     * Generate id cards
     */
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.candidates.length == 0) {
                const prompt = yield this._alertCtrl.create({
                    message: 'Please select candidate(s)',
                    buttons: ['Ok']
                });
                prompt.present();
                return false;
            }
            this.downloading = true;
            this.candidateIdCardService.generate(this.candidates).subscribe(response => {
            }, (err) => {
            }, () => {
                this.downloading = false;
            });
        });
    }
    /**
     * search method
     */
    search() {
        this.currentPage = 1;
        this.loadData(this.currentPage);
    }
    /**
     * load data
     * @param page
     */
    loadData(page) {
        if (this.cndSegment == 'not-generated') {
            this.loadNotGenerated(page);
        }
        else {
            this.loadGenerated(page);
        }
    }
    /**
     * Load candidates whose ID not generated
     */
    loadNotGenerated(page, event = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentPage = page;
            this.loading = true;
            this.candidateIdCardService.listCandidates(this.searchBar, page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                if (this.currentPage == 1) {
                    this.candidatelistData = response.body;
                }
                else {
                    this.candidatelistData = this.candidatelistData.concat(response.body);
                }
                this.candidates = [];
                this.candidatelistData.forEach((value, index) => {
                    this.candidates[index] = value.candidate_id;
                });
            }, error => { }, () => {
                if (event)
                    event.target.complete();
                this.loading = false;
            });
        });
    }
    /**
     * Load candidates whose ID generated
     */
    loadGenerated(page, event = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentPage = page;
            this.loading = true;
            this.candidateIdCardService.listCandidateIds(this.searchBar, page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                if (this.currentPage == 1) {
                    this.candidatelistData = response.body;
                }
                else {
                    this.candidatelistData = this.candidatelistData.concat(response.body);
                }
                this.candidates = [];
                this.candidatelistData.forEach((value, index) => {
                    this.candidates[index] = value.candidate_id;
                });
            }, error => { }, () => {
                if (event)
                    event.target.complete();
                this.loading = false;
            });
        });
    }
    segmentChanged($ev) {
        if ($ev.detail.value == 'not-generated') {
            this.loadNotGenerated(1);
        }
        else {
            this.loadGenerated(1);
        }
    }
    /**
     * load more data on scroll to bottom
     * @param event
     */
    doInfinite(event) {
        this.currentPage++;
        if (this.cndSegment == 'not-generated') {
            this.loadNotGenerated(this.currentPage, event);
        }
        else {
            this.loadGenerated(this.currentPage, event);
        }
    }
};
GenerateIdPage = __decorate([
    Component({
        selector: 'app-generate-id',
        templateUrl: './generate-id.page.html',
        styleUrls: ['./generate-id.page.scss'],
    })
], GenerateIdPage);
export { GenerateIdPage };
//# sourceMappingURL=generate-id.page.js.map