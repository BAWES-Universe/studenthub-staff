import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
// models
import { Request } from 'src/app/models/request';
import { CompanyContactListPage } from '../../company-contact/company-contact-list/company-contact-list.page';
import { AllCompanyListPage } from '../all-company-list/all-company-list.page';
let RequestFormPage = class RequestFormPage {
    constructor(requestService, fb, modalCtrl, alertCtrl, authService, popoverCtrl, location, eventService, route) {
        this.requestService = requestService;
        this.fb = fb;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.popoverCtrl = popoverCtrl;
        this.location = location;
        this.eventService = eventService;
        this.route = route;
        this.saving = false;
        this.model = new Request();
        this.requestID = null;
    }
    ngOnInit() { }
    ionViewWillEnter() {
        this.requestID = this.route.snapshot.paramMap.get('id');
        if (window.history.state.model) {
            this.model = window.history.state.model;
            this.loadForm();
        }
        else if (this.requestID) {
            this.detail(this.requestID);
        }
        else {
            this.loadForm();
        }
    }
    loadForm() {
        this.company = this.model.company;
        this.form = this.fb.group({
            company_name: [(this.model.company) ? this.model.company.company_name : '', Validators.required],
            company_id: [this.model.company_id, Validators.required],
            contact_name: [(this.model.contact) ? this.model.contact.contact_name : '', Validators.required],
            contact_uuid: [this.model.contact_uuid, Validators.required],
            position_type: [this.model.request_position_type + '', Validators.required],
            position_title: [this.model.request_position_title, Validators.required],
            number_of_employees: [this.model.request_number_of_employees, Validators.required],
            additional_info: [this.model.request_additional_info]
        });
        this.operation = (this.requestID) ? 'Update' : 'Create';
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
                    this.eventService.companyRequestUpdate$.next();
                    this.location.back();
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
    /**
     * open popup to select contact
     * @param e
     */
    openContact(e) {
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
                    let contact = _.data.companyContact.contact_name;
                    if (!this.company || !this.company.company_id) {
                        this.form.controls.company_name.setValue(_.data.companyContact.company.company_name);
                        this.form.controls.company_id.setValue(_.data.companyContact.company.company_id);
                        contact += ' @ ' + _.data.companyContact.company.company_name;
                    }
                    this.form.controls.contact_name.setValue(contact);
                    this.form.controls.contact_uuid.setValue(_.data.companyContact.contact_uuid);
                }
            });
            popover.present();
        });
    }
    openClient(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const popover = yield this.modalCtrl.create({
                component: AllCompanyListPage,
            });
            popover.onDidDismiss().then((_) => {
                if (_ && _.data) {
                    this.company = _.data;
                    this.form.controls.company_name.setValue(_.data.company_name);
                    this.form.controls.company_id.setValue(_.data.company_id);
                    this.form.controls.contact_name.setValue(null);
                    this.form.controls.contact_uuid.setValue(null);
                }
            });
            popover.present();
        });
    }
    /**
     * request detail
     * @param id
     */
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestService.view(id).subscribe(data => {
                this.model = data;
                this.loadForm();
            });
        });
    }
};
RequestFormPage = __decorate([
    Component({
        selector: 'app-request-form',
        templateUrl: './request-form.page.html',
        styleUrls: ['./request-form.page.scss'],
    })
], RequestFormPage);
export { RequestFormPage };
//# sourceMappingURL=request-form.page.js.map