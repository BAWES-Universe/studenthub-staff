import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CompanyListPage = class CompanyListPage {
    constructor(navCtrl, companyService, platform, aws, eventService) {
        this.navCtrl = navCtrl;
        this.companyService = companyService;
        this.platform = platform;
        this.aws = aws;
        this.eventService = eventService;
        this.activePageCount = 0;
        this.activeCurrentPage = 1;
        this.inActivePageCount = 0;
        this.inActiveCurrentPage = 1;
        this.loading = false;
        this.loadingMore = false;
        this.active = 1;
        this.inActive = 2;
        this.segment = 1;
        this.activeCompanies = [];
        this.inActiveCompanies = [];
        this.filters = {
            name: null,
            common_name_en: null,
            common_name_ar: null
        };
    }
    ngOnInit() {
        this.eventService.reloadCandidateHistory$.subscribe(response => {
            this.loadData(1);
        });
    }
    ionViewWillEnter() {
        // const state = window.history.state;
        // if (state.companies) {
        //   this.companies = state.companies;
        //   this.loadCompaniesSegmentData();
        // }
        if (!this.companies) {
            this.loadData(1);
        }
    }
    /**
     * Return url string to filter list
     */
    urlParams() {
        let urlParams = '&status=' + this.segment;
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
            this.companyService.list(page, searchParams).subscribe(response => {
                if (this.segment == this.active) {
                    this.activePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                    this.activeCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                    this.activeCompanies = response.body;
                }
                else {
                    this.inActivePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                    this.inActiveCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                    this.inActiveCompanies = response.body;
                }
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * When its selected
     */
    rowSelected(model) {
        this.navCtrl.navigateForward('company-view/' + model.company_id, {
            state: {
                model
            }
        });
    }
    segmentChanged($event) {
        this.segment = $event.detail.value;
    }
    loadLogo($event, company) {
        company.company_logo = null;
    }
    doInfinite(event, status) {
        this.loadingMore = true;
        if (status == this.active) {
            this.activeCurrentPage++;
        }
        else {
            this.inActiveCurrentPage++;
        }
        const urlParams = this.urlParams();
        this.companyService.list((status == this.active) ? this.activeCurrentPage : this.inActiveCurrentPage, urlParams).subscribe(response => {
            if (status == this.active) {
                this.activePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.activeCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.activeCompanies = this.activeCompanies.concat(response.body);
            }
            else if (status == this.inActive) {
                this.inActiveCompanies = this.inActiveCompanies.concat(response.body);
                this.inActivePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.inActiveCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            }
        }, error => { }, () => {
            this.loadingMore = false;
            event.target.complete();
        });
    }
};
CompanyListPage = __decorate([
    Component({
        selector: 'app-company-list',
        templateUrl: './company-list.page.html',
        styleUrls: ['./company-list.page.scss'],
    })
], CompanyListPage);
export { CompanyListPage };
//# sourceMappingURL=company-list.page.js.map