import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let AllCompanyListPage = class AllCompanyListPage {
    constructor(navCtrl, companyService, platform, aws, modalCtrl) {
        this.navCtrl = navCtrl;
        this.companyService = companyService;
        this.platform = platform;
        this.aws = aws;
        this.modalCtrl = modalCtrl;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = false;
        this.loadingMore = false;
        this.companies = [];
        this.selectedCompany = null;
        this.filters = {
            name: null,
            common_name_en: null,
            common_name_ar: null
        };
    }
    ngOnInit() {
        this.loadData(1);
    }
    /**
     * Return url string to filter list
     */
    urlParams() {
        let urlParams = '&status=1';
        if (this.filters.name) {
            urlParams += '&name=' + this.filters.name;
        }
        if (this.filters.common_name_en) {
            urlParams += '&common_name_en=' + this.filters.common_name_en;
        }
        if (this.filters.common_name_ar) {
            urlParams += '&common_name_ar=' + this.filters.common_name_ar;
        }
        return urlParams;
    }
    /**
     * Reset question filter
     */
    resetFilter() {
        this.filters = {
            name: null,
            common_name_en: null,
            common_name_ar: null
        };
        this.loadData(1); // reload all result
    }
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load list of companies
            this.loading = true;
            let searchParams = this.urlParams();
            this.companyService.listWithContact(page, searchParams).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.companies = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * When its selected
     */
    showSub(model) {
        if (model.company_id && this.selectedCompany == model.company_id) {
            this.selectedCompany = null;
        }
        else {
            this.selectedCompany = model.company_id;
        }
    }
    /**
     * When its selected
     */
    rowSelected(model) {
        this.dismiss(model);
    }
    loadLogo($event, company) {
        company.company_logo = null;
    }
    doInfinite(event) {
        this.loadingMore = true;
        this.currentPage++;
        const urlParams = this.urlParams();
        this.companyService.listWithContact(this.currentPage, urlParams).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.companies = this.companies.concat(response.body);
        }, error => { }, () => {
            this.loadingMore = false;
            event.target.complete();
        });
    }
    dismiss(data = null) {
        this.modalCtrl.dismiss(data);
    }
};
AllCompanyListPage = __decorate([
    Component({
        selector: 'app-all-company-list',
        templateUrl: './all-company-list.page.html',
        styleUrls: ['./all-company-list.page.scss'],
    })
], AllCompanyListPage);
export { AllCompanyListPage };
//# sourceMappingURL=all-company-list.page.js.map