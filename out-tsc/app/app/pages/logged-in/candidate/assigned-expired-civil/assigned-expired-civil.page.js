import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let AssignedExpiredCivilPage = class AssignedExpiredCivilPage {
    constructor(candidateIdCardService, _fb, _alertCtrl, _events, _nav) {
        this.candidateIdCardService = candidateIdCardService;
        this._fb = _fb;
        this._alertCtrl = _alertCtrl;
        this._events = _events;
        this._nav = _nav;
        this.pageCount = 0;
        this.currentPage = 1;
        this.searchBar = '';
        this.candidatelistData = [];
        this.candidates = [];
        this.loading = false;
        this.renewLoader = false;
        this.checkAll = null;
    }
    ngOnInit() {
        this.form = this._fb.group({
            candidates: [],
        });
        this.loadData(1);
        this._events.reloadCandidateHistory$.subscribe(e => {
            this.loadData(1);
        });
    }
    /**
     * Renew id cards
     */
    renew() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.candidates.length == 0) {
                const prompt = yield this._alertCtrl.create({
                    message: 'Please select candidate(s)',
                    buttons: ['Ok']
                });
                prompt.present();
                return false;
            }
            this.renewLoader = true;
            this.candidateIdCardService.renew(this.candidates).subscribe(jsonResponse => {
                this.candidates = [];
                // refresh list
                this.currentPage = 1;
                this.loadData(this.currentPage);
                this._events.expiredIdCard$.next();
            }, () => {
                this.renewLoader = false;
            });
        });
    }
    onCandidateToggle(event) {
        let candidate_id = event.target.value;
        if (event.detail.checked) {
            this.candidates.push(candidate_id);
        }
        else {
            this.candidates = this.candidates.filter(c => c != candidate_id);
        }
    }
    /**
     * Load expired ID cards
     * @param page
     */
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.renewLoader)
                this.loading = true;
            this.candidateIdCardService.listAssignedExpiredIds(this.searchBar, page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.candidatelistData = response.body;
            }, error => { }, () => {
                this.renewLoader = false;
                this.loading = false;
            });
        });
    }
    /**
     * load more data on scroll to bottom
     * @param event
     */
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.candidateIdCardService.listAssignedExpiredIds(this.searchBar, this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.candidatelistData = this.candidatelistData.concat(response.body);
        }, error => {
        }, () => {
            this.loading = false;
            event.target.complete();
        });
    }
    detail(obj) {
        this._nav.navigateForward('candidate-view/' + obj.candidate_id);
    }
    selectAll() {
        this.checkAll = !(this.checkAll);
    }
};
AssignedExpiredCivilPage = __decorate([
    Component({
        selector: 'app-assigned-expired-civil',
        templateUrl: './assigned-expired-civil.page.html',
        styleUrls: ['./assigned-expired-civil.page.scss'],
    })
], AssignedExpiredCivilPage);
export { AssignedExpiredCivilPage };
//# sourceMappingURL=assigned-expired-civil.page.js.map