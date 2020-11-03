import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CandidateReviewListPage = class CandidateReviewListPage {
    constructor(router, aws, candidateService) {
        this.router = router;
        this.aws = aws;
        this.candidateService = candidateService;
        this.loading = false;
        this.total = 0;
        this.pageCount = 0;
        this.currentPage = 1;
        this.candidates = [];
    }
    ngOnInit() {
        this.loadData(this.currentPage);
    }
    /**
     * Load Candidate List
     * @param page
     */
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.candidateService.listToReview(page).subscribe(response => {
                this.loading = false;
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
                this.candidates = response.body;
            }, () => {
                this.loading = false;
            });
        });
    }
    /**
     * load more on scroll to bottom
     * @param event
     */
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.candidateService.listToReview(this.currentPage).subscribe(response => {
            this.loading = false;
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.candidates = this.candidates.concat(response.body);
            event.target.complete();
        }, () => {
            this.loading = false;
        });
    }
    /**
     * When a candidate is selected
     * @param model
     */
    rowSelected(model) {
        this.router.navigate(['/candidate-view', model.candidate_id], {
            state: {
                model: model
            }
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
CandidateReviewListPage = __decorate([
    Component({
        selector: 'app-candidate-review-list',
        templateUrl: './candidate-review-list.page.html',
        styleUrls: ['./candidate-review-list.page.scss'],
    })
], CandidateReviewListPage);
export { CandidateReviewListPage };
//# sourceMappingURL=candidate-review-list.page.js.map