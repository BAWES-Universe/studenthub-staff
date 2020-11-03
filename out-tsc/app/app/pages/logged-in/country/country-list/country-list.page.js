import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CountryListPage = class CountryListPage {
    constructor(navCtrl, countryService, activatedRoute) {
        this.navCtrl = navCtrl;
        this.countryService = countryService;
        this.activatedRoute = activatedRoute;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = false;
        this.country_id = null;
    }
    ngOnInit() {
        this.country_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.loadData(this.currentPage);
    }
    /**
     *  Load list of country
     * @param page
     */
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.countryService.list(page).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.countries = response.body;
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * When its selected
     */
    rowSelected(model) {
        // Load Detail Page
        this.navCtrl.navigateForward('country-view/' + model.country_id, {
            state: {
                model
            }
        });
    }
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.countryService.list(this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            // this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.countries = this.countries.concat(response.body);
        }, error => { }, () => {
            this.loading = false;
            event.target.complete();
        });
    }
};
CountryListPage = __decorate([
    Component({
        selector: 'app-country-list',
        templateUrl: './country-list.page.html',
        styleUrls: ['./country-list.page.scss'],
    })
], CountryListPage);
export { CountryListPage };
//# sourceMappingURL=country-list.page.js.map