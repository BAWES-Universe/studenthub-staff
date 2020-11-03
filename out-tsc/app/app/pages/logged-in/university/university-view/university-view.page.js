import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let UniversityViewPage = class UniversityViewPage {
    constructor(activatedRoute, universityService) {
        this.activatedRoute = activatedRoute;
        this.universityService = universityService;
        this.loading = false;
        this.university_id = this.activatedRoute.snapshot.paramMap.get('id');
        const state = window.history.state;
        if (state.model) {
            this.university = state.model;
        }
    }
    ngOnInit() {
        if (!this.university) {
            this.loadData();
        }
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.universityService.view(this.university_id).subscribe(response => {
                this.loading = false;
                this.university = response;
            });
        });
    }
};
UniversityViewPage = __decorate([
    Component({
        selector: 'app-university-view',
        templateUrl: './university-view.page.html',
        styleUrls: ['./university-view.page.scss'],
    })
], UniversityViewPage);
export { UniversityViewPage };
//# sourceMappingURL=university-view.page.js.map