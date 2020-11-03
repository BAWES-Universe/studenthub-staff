import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
// model
import { Store } from 'src/app/models/store';
let StoreFormPage = class StoreFormPage {
    constructor(activatedRoute, storeService, _fb, _modelCtrl, _alertCtrl, mallService, authService) {
        this.activatedRoute = activatedRoute;
        this.storeService = storeService;
        this._fb = _fb;
        this._modelCtrl = _modelCtrl;
        this._alertCtrl = _alertCtrl;
        this.mallService = mallService;
        this.authService = authService;
        this.model = new Store();
        this.store_id = null;
        this.loading = false;
        this.store_id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    ngOnInit() {
        // Load the passed model if available
        const state = window.history.state;
        if (state.model) {
            this.model = state.model;
        }
        else {
            this.model.company_id = this.company_id;
        }
        if (state.brands) {
            this.brands = state.brands;
        }
        if (state.malls) {
            this.malls = state.malls;
        }
        if (!this.malls || this.malls.length == 0) {
            this.loadMall();
        }
        this.formInit();
    }
    /**
     * load all mails
     */
    loadMall() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mallService.fullList().subscribe(response => {
                this.malls = response;
            });
        });
    }
    formInit() {
        // Init Form
        console.log(this.model);
        if (!this.model.store_id) { // Show Create Form
            this.operation = 'Create';
            this.form = this._fb.group({
                name: ['', Validators.required],
                location: ['', Validators.required],
                brand: [''],
                mall: ['']
            });
        }
        else { // Show Update Form
            this.operation = 'Update';
            this.form = this._fb.group({
                name: [this.model.store_name, Validators.required],
                location: [this.model.store_location, Validators.required],
                brand: [this.model.brand_uuid],
                mall: [this.model.mall_uuid]
            });
        }
    }
    /**
     * Update Model Data based on Form Input
     */
    updateModelDataFromForm() {
        this.model.store_name = this.form.value.name;
        this.model.store_location = this.form.value.location;
        this.model.brand_uuid = this.form.value.brand || null;
        this.model.mall_uuid = this.form.value.mall || null;
    }
    /**
     * Close the page
     */
    close() {
        const data = { refresh: false };
        this._modelCtrl.dismiss(data);
    }
    /**
     * Save the model
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.updateModelDataFromForm();
            let action;
            if (!this.model.store_id) {
                // Create
                action = this.storeService.create(this.model);
            }
            else {
                // Update
                action = this.storeService.update(this.model);
            }
            action.subscribe((jsonResponse) => __awaiter(this, void 0, void 0, function* () {
                this.loading = false;
                // On Success
                if (jsonResponse.operation == 'success') {
                    // Close the page
                    const data = { refresh: true };
                    this._modelCtrl.dismiss(data);
                }
                // On Failure
                if (jsonResponse.operation == 'error') {
                    const prompt = yield this._alertCtrl.create({
                        message: this.authService.errorMessage(jsonResponse.message),
                        buttons: ['Ok']
                    });
                    prompt.present();
                }
            }));
        });
    }
};
StoreFormPage = __decorate([
    Component({
        selector: 'app-store-form',
        templateUrl: './store-form.page.html',
        styleUrls: ['./store-form.page.scss'],
    })
], StoreFormPage);
export { StoreFormPage };
//# sourceMappingURL=store-form.page.js.map