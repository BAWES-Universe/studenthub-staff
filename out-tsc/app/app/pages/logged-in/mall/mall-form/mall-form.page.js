import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
// model
import { Mall } from 'src/app/models/mall';
let MallFormPage = class MallFormPage {
    constructor(activatedRoute, mallService, fb, modelCtrl, alertCtrl, authService) {
        this.activatedRoute = activatedRoute;
        this.mallService = mallService;
        this.fb = fb;
        this.modelCtrl = modelCtrl;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.model = new Mall();
        this.brands = [];
        this.mallUUID = null;
        this.loading = false;
        this.mallUUID = this.activatedRoute.snapshot.paramMap.get('id');
    }
    ngOnInit() {
        // Load the passed model if available
        const state = window.history.state;
        if (state.model) {
            this.model = state.model;
        }
        this.formInit();
    }
    formInit() {
        // Init Form
        if (!this.model.mall_uuid) { // Show Create Form
            this.operation = 'Create';
            this.form = this.fb.group({
                name_en: ['', Validators.required],
                name_ar: ['', Validators.required]
            });
        }
        else { // Show Update Form
            this.operation = 'Update';
            this.form = this.fb.group({
                name_en: [this.model.mall_name_en, Validators.required],
                name_ar: [this.model.mall_name_ar, Validators.required],
            });
        }
    }
    /**
     * Update Model Data based on Form Input
     */
    updateModelDataFromForm() {
        this.model.mall_name_en = this.form.value.name_en;
        this.model.mall_name_ar = this.form.value.name_ar;
    }
    /**
     * Close the page
     */
    close(refresh = false) {
        const data = { refresh };
        this.modelCtrl.dismiss(data);
    }
    /**
     * Save the model
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.updateModelDataFromForm();
            let action;
            if (!this.model.mall_uuid) {
                // Create
                action = this.mallService.create(this.model);
            }
            else {
                // Update
                action = this.mallService.update(this.model);
            }
            action.subscribe((jsonResponse) => __awaiter(this, void 0, void 0, function* () {
                this.loading = false;
                // On Success
                if (jsonResponse.operation == 'success') {
                    // Close the page
                    this.close(true);
                }
                // On Failure
                if (jsonResponse.operation == 'error') {
                    const prompt = yield this.alertCtrl.create({
                        message: this.authService.errorMessage(jsonResponse.message),
                        buttons: ['Ok']
                    });
                    prompt.present();
                }
            }));
        });
    }
};
MallFormPage = __decorate([
    Component({
        selector: 'app-mall-form',
        templateUrl: './mall-form.page.html',
        styleUrls: ['./mall-form.page.scss'],
    })
], MallFormPage);
export { MallFormPage };
//# sourceMappingURL=mall-form.page.js.map