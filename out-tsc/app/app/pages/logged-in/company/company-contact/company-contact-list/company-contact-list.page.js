import { __decorate } from "tslib";
import { Component } from '@angular/core';
let CompanyContactListPage = class CompanyContactListPage {
    constructor(companyContactService, popupCtrl, modalCtrl) {
        this.companyContactService = companyContactService;
        this.popupCtrl = popupCtrl;
        this.modalCtrl = modalCtrl;
        this.contactList = [];
        this.loading = false;
        this.query = '';
    }
    ngOnInit() {
        if (this.company) {
            this.contactList = this.company.companyContacts;
        }
        else {
            this.loadData();
        }
    }
    /**
     * load all contacts
     */
    loadData() {
        this.loading = true;
        this.currentPage = 1;
        this.contactList = [];
        this.companyContactService.list(this.currentPage, this.query).subscribe(response => {
            this.loading = false;
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.contactList = response.body;
        }, () => {
            this.loading = false;
        });
    }
    /**
     * infinite loader on scroll
     * @param event
     */
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.companyContactService.list(this.currentPage, this.query).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.contactList = this.contactList.concat(response.body);
        }, error => { }, () => {
            this.loading = false;
            event.target.complete();
        });
    }
    doNothing(event) {
        event.stopPropagation();
    }
    /**
     * close popup on selection
     * @param companyContact
     */
    dismiss(companyContact = null) {
        this.popupCtrl.getTop().then(overlay => {
            if (overlay) {
                this.popupCtrl.dismiss({ companyContact });
            }
            else {
                this.modalCtrl.dismiss({ companyContact });
            }
        });
    }
    /**
     * filter contacts
     * @param ev
     */
    filter(ev) {
        //filter from all companies
        if (!this.company) {
            return this.loadData();
        }
        //filter from given company 
        this.loading = true;
        this.contactList = [];
        this.companyContactService.companyContacts(this.company.company_id, this.query).subscribe(response => {
            this.loading = false;
            this.contactList = response;
        }, () => {
            this.loading = false;
        });
    }
};
CompanyContactListPage = __decorate([
    Component({
        selector: 'app-company-contact-list',
        templateUrl: './company-contact-list.page.html',
        styleUrls: ['./company-contact-list.page.scss'],
    })
], CompanyContactListPage);
export { CompanyContactListPage };
//# sourceMappingURL=company-contact-list.page.js.map