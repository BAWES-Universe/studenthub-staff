import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CompanyFollowupListPage = class CompanyFollowupListPage {
    constructor(navCtrl, platform, companyService, aws) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.companyService = companyService;
        this.aws = aws;
        this.companies = [];
        this.loading = false;
        this.pageCount = 0;
        this.currentPage = 1;
        this.pages = [];
    }
    ngOnInit() {
        this.loadCompanyList(1);
    }
    loadCompanyList(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load list of companies
            this.loading = true;
            this.companyService.listFollowups(page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.companies = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.companyService.listFollowups(this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.companies = this.companies.concat(response.body);
        }, error => { }, () => {
            this.loading = false;
            event.target.complete();
        });
    }
    rowSelected(model) {
        this.navCtrl.navigateForward('company-view/' + model.company_id, {
            state: {
                model
            }
        });
    }
    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
        if (date)
            return new Date(date.replace(/-/g, '/'));
    }
    loadLogo(company) {
        company.company_logo = null;
    }
};
CompanyFollowupListPage = __decorate([
    Component({
        selector: 'app-company-followup-list',
        templateUrl: './company-followup-list.page.html',
        styleUrls: ['./company-followup-list.page.scss'],
    })
], CompanyFollowupListPage);
export { CompanyFollowupListPage };
//# sourceMappingURL=company-followup-list.page.js.map