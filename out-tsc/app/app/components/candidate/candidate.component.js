import { __awaiter, __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
let CandidateComponent = class CandidateComponent {
    constructor(platform, alertCtrl, toastCtrl, navCtrl, candidateService, candidateIdCardService, aws) {
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.candidateService = candidateService;
        this.candidateIdCardService = candidateIdCardService;
        this.aws = aws;
        this.type = null;
        this.refresh = new EventEmitter();
        this.deleting = false;
        // this.candidate.candidate_personal_photo = null;
    }
    ngOnInit() {
    }
    /**
     * When its selected
     */
    rowSelected(model) {
        // Load Detail Page
        this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
            state: {
                model
            }
        });
    }
    /**
     * Delete the provided model
     */
    delete(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield this.alertCtrl.create({
                header: 'Delete Candidate?',
                message: 'Are you sure you want to delete this Candidate?',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => __awaiter(this, void 0, void 0, function* () {
                            this.deleting = true;
                            this.candidateService.delete(candidate).subscribe((jsonResp) => __awaiter(this, void 0, void 0, function* () {
                                this.deleting = false;
                                if (jsonResp.operation == 'error') {
                                    const alert = yield this.alertCtrl.create({
                                        header: 'Deletion Error!',
                                        subHeader: jsonResp.message,
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                if (jsonResp.operation == 'success') {
                                    const toast = yield this.toastCtrl.create({
                                        message: jsonResp.message,
                                        duration: 3000
                                    });
                                    toast.present();
                                    this.refresh.emit();
                                }
                            }), () => {
                                this.deleting = false;
                            });
                        })
                    },
                    {
                        text: 'No'
                    }
                ]
            });
            confirm.present();
        });
    }
    /**
     * @param candidate
     */
    loadLogo(candidate) {
        this.candidate.candidate_personal_photo = null;
    }
    /**
     * on candidate checkbox change
     * @param event
     */
    onCandidateSelected(event) {
        event.preventDefault();
        event.stopPropagation();
        const candidate_id = parseInt(event.target.value);
        if (event.detail.checked) { //on check
            this.candidateIdCardService.candidates.push(candidate_id);
        }
        else { //on uncheck
            this.candidateIdCardService.candidates = this.candidateIdCardService.candidates.filter((c) => c != candidate_id);
        }
    }
};
__decorate([
    Input()
], CandidateComponent.prototype, "candidate", void 0);
__decorate([
    Input()
], CandidateComponent.prototype, "type", void 0);
__decorate([
    Output()
], CandidateComponent.prototype, "refresh", void 0);
CandidateComponent = __decorate([
    Component({
        selector: 'candidate',
        templateUrl: './candidate.component.html',
        styleUrls: ['./candidate.component.scss'],
    })
], CandidateComponent);
export { CandidateComponent };
//# sourceMappingURL=candidate.component.js.map