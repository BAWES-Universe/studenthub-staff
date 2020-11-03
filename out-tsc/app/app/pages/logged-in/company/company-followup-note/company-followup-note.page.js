import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let CompanyFollowupNotePage = class CompanyFollowupNotePage {
    constructor(modalCtrl, alertCtrl, companyService) {
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.companyService = companyService;
        this.saving = false;
        this.note = '';
    }
    ngOnInit() {
    }
    save() {
        this.saving = true;
        this.companyService.addFollowupNote(this.note, this.company_id).subscribe((jsonResponse) => __awaiter(this, void 0, void 0, function* () {
            this.saving = false;
            // On Success
            if (jsonResponse.operation == "success") {
                // Close the page
                let data = { 'company_last_followup_datetime': jsonResponse.company_last_followup_datetime };
                this.modalCtrl.dismiss(data);
            }
            // On Failure
            if (jsonResponse.operation == "error") {
                let prompt = yield this.alertCtrl.create({
                    message: JSON.stringify(jsonResponse.message),
                    buttons: ["Ok"]
                });
                prompt.present();
            }
        }), () => {
            this.saving = false;
        });
    }
    close() {
        this.modalCtrl.dismiss();
    }
};
CompanyFollowupNotePage = __decorate([
    Component({
        selector: 'app-company-followup-note',
        templateUrl: './company-followup-note.page.html',
        styleUrls: ['./company-followup-note.page.scss'],
    })
], CompanyFollowupNotePage);
export { CompanyFollowupNotePage };
//# sourceMappingURL=company-followup-note.page.js.map