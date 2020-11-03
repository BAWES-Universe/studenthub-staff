import { __decorate } from "tslib";
import { Component } from '@angular/core';
let StoreManagerFormPage = class StoreManagerFormPage {
    constructor(modalCtrl, comapnyContactService) {
        this.modalCtrl = modalCtrl;
        this.comapnyContactService = comapnyContactService;
        this.companyContacts = [];
        this.parentCompanyContacts = [];
        this.loading = false;
    }
    ngOnInit() {
        console.log(this.company);
        this.loadData();
    }
    loadData() {
        this.loading = true;
        this.comapnyContactService.companyContacts(this.company.company_id).subscribe(data => {
            this.loading = false;
            this.companyContacts = data;
        });
        if (this.company.parent_company_id) {
            this.comapnyContactService.companyContacts(this.company.parent_company_id).subscribe(data => {
                this.parentCompanyContacts = data;
            });
        }
    }
    rowSelected(companyContact) {
        this.modalCtrl.dismiss({
            refresh: true,
            storeManager: companyContact
        });
    }
    dismiss() {
        this.modalCtrl.dismiss();
    }
};
StoreManagerFormPage = __decorate([
    Component({
        selector: 'app-store-manager-form',
        templateUrl: './store-manager-form.page.html',
        styleUrls: ['./store-manager-form.page.scss'],
    })
], StoreManagerFormPage);
export { StoreManagerFormPage };
//# sourceMappingURL=store-manager-form.page.js.map