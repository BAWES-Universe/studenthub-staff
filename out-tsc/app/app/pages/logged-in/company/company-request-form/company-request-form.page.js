import { __awaiter, __decorate } from "tslib";
import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
// models
import { Request } from 'src/app/models/request';
//pages
import { CompanyContactListPage } from "../company-contact/company-contact-list/company-contact-list.page";
let CompanyRequestFormPage = class CompanyRequestFormPage {
    constructor(requestService, fb, modalCtrl, alertCtrl, authService, popoverCtrl) {
        this.requestService = requestService;
        this.fb = fb;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.popoverCtrl = popoverCtrl;
        this.saving = false;
        this.model = new Request();
    }
    ngOnInit() {
        if (this.request) {
            this.model = this.request;
        }
        this.form = this.fb.group({
            company_id: [this.company ? this.company.company_id : null, Validators.required],
            contact_name: [(this.model.contact) ? this.model.contact.contact_name : '', Validators.required],
            contact_uuid: [this.model.contact_uuid, Validators.required],
            position_type: [this.model.request_position_type + '', Validators.required],
            position_title: [this.model.request_position_title, Validators.required],
            number_of_employees: [this.model.request_number_of_employees, Validators.required],
            additional_info: [this.model.request_additional_info]
        });
        this.operation = (this.model && this.model.request_uuid) ? 'Update' : 'Create';
    }
    /**
     * Update Model Data based on Form Input
     */
    updateModelDataFromForm() {
        this.model.company_id = this.form.value.company_id;
        this.model.contact_uuid = this.form.value.contact_uuid;
        this.model.request_position_type = this.form.value.position_type;
        this.model.request_position_title = this.form.value.position_title;
        this.model.request_number_of_employees = this.form.value.number_of_employees;
        this.model.request_additional_info = this.form.value.additional_info;
    }
    /**
     * Close the page
     */
    close() {
        const data = { refresh: false };
        this.modalCtrl.dismiss(data);
    }
    /**
     * Save the model
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.saving = true;
            this.updateModelDataFromForm();
            let action;
            if (!this.model.request_uuid) {
                // Create
                action = this.requestService.create(this.model);
            }
            else {
                // Update
                action = this.requestService.update(this.model);
            }
            action.subscribe((jsonResponse) => __awaiter(this, void 0, void 0, function* () {
                this.saving = false;
                // On Success
                if (jsonResponse.operation == 'success') {
                    // Close the page
                    const data = { refresh: true };
                    this.modalCtrl.dismiss(data);
                }
                // On Failure
                if (jsonResponse.operation == 'error') {
                    const prompt = yield this.alertCtrl.create({
                        message: this.authService._processResponseMessage(jsonResponse),
                        buttons: ['Ok']
                    });
                    prompt.present();
                }
            }), () => {
                this.saving = false;
            });
        });
    }
    openClient(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let popover;
            if (this.company) {
                popover = yield this.popoverCtrl.create({
                    component: CompanyContactListPage,
                    event: e,
                    componentProps: {
                        company: this.company
                    }
                });
            }
            else {
                popover = yield this.modalCtrl.create({
                    component: CompanyContactListPage
                });
            }
            popover.onDidDismiss().then((_) => {
                if (_ && _.data) {
                    this.form.controls.contact_name.setValue(_.data.companyContact.contact_name);
                    this.form.controls.contact_uuid.setValue(_.data.companyContact.contact_uuid);
                    if (!this.company || !this.company.company_id) {
                        this.form.controls.company_id.setValue(_.data.companyContact.company.company_id);
                    }
                }
            });
            popover.present();
        });
    }
};
__decorate([
    Input()
], CompanyRequestFormPage.prototype, "company", void 0);
__decorate([
    Input()
], CompanyRequestFormPage.prototype, "request", void 0);
CompanyRequestFormPage = __decorate([
    Component({
        selector: 'app-company-request-form',
        templateUrl: './company-request-form.page.html',
        styleUrls: ['./company-request-form.page.scss'],
    })
], CompanyRequestFormPage);
export { CompanyRequestFormPage };
//# sourceMappingURL=company-request-form.page.js.map