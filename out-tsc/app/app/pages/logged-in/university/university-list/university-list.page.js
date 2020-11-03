import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let UniversityListPage = class UniversityListPage {
    constructor(navCtrl, universityService) {
        this.navCtrl = navCtrl;
        this.universityService = universityService;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = false;
    }
    ngOnInit() {
        this.loadData(this.currentPage);
    }
    /**
     * load university data
     * @param page
     */
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load list of university
            this.loading = true;
            this.universityService.list(page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.universities = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * When its selected
     */
    rowSelected(model) {
        // Load Detail Page
        this.navCtrl.navigateForward('university-view/' + model.university_id, {
            state: {
                model: model
            }
        });
    }
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.universityService.list(this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.universities = this.universities.concat(response.body);
        }, error => { }, () => {
            this.loading = false;
            event.target.complete();
        });
    }
};
UniversityListPage = __decorate([
    Component({
        selector: 'app-university-list',
        templateUrl: './university-list.page.html',
        styleUrls: ['./university-list.page.scss'],
    })
], UniversityListPage);
export { UniversityListPage };
//# sourceMappingURL=university-list.page.js.map