import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CompanyNoteService = class CompanyNoteService {
    constructor(authhttp) {
        this.authhttp = authhttp;
        this.companyNoteEndpoint = '/notes';
    }
    /**
     * create note
     * @param model
     */
    create(model) {
        return this.authhttp.post(this.companyNoteEndpoint, {
            company_id: model.company_id,
            note: model.note_text,
        });
    }
    /**
     * update note
     * @param model
     */
    update(model) {
        return this.authhttp.patch(`${this.companyNoteEndpoint}/${model.note_uuid}`, {
            note: model.note_text,
        });
    }
    /**
     * delete note
     * @param model
     */
    delete(model) {
        return this.authhttp.delete(`${this.companyNoteEndpoint}/${model.note_uuid}`);
    }
};
CompanyNoteService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyNoteService);
export { CompanyNoteService };
//# sourceMappingURL=company-note.service.js.map