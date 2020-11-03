import { __awaiter, __decorate } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Note } from 'src/app/models/note';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
let CompanyNoteFormPage = class CompanyNoteFormPage {
    constructor(noteService, fb, modalCtrl, alertCtrl, authService) {
        this.noteService = noteService;
        this.fb = fb;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.saving = false;
        this.model = new Note();
        this.Editor = ClassicEditor;
        this.editorConfig = {
            placeholder: 'Click here to take notes...',
            toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
        };
    }
    ngOnInit() {
        if (this.note) {
            this.model = this.note;
        }
        this.form = this.fb.group({
            note: [(this.model && this.model.note_uuid) ? this.model.note_text : '', Validators.required],
        });
        this.operation = (this.model && this.model.note_uuid) ? 'Update' : 'Create';
    }
    ionViewDidEnter() {
        console.log(this.model, this.ckeditor);
        if (this.model && this.ckeditor) {
            this.ckeditor.editorInstance.setData(this.model.note_text);
            setTimeout(() => this.ckeditor.editorInstance.editing.view.focus(), 1000);
        }
    }
    /**
     * Update Model Data based on Form Input
     */
    updateModelDataFromForm() {
        this.model.note_text = this.form.value.note;
        this.model.company_id = this.company.company_id;
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
            if (!this.model.note_uuid) {
                // Create
                action = this.noteService.create(this.model);
            }
            else {
                // Update
                action = this.noteService.update(this.model);
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
    /**
     * on note editor change
     * @param event
     */
    onChange(event) {
        if (!event.editor) {
            return event;
        }
        const data = event.editor.getData();
        this.form.controls.note.setValue(data);
        this.form.markAsDirty();
        this.form.updateValueAndValidity();
    }
};
__decorate([
    Input()
], CompanyNoteFormPage.prototype, "company", void 0);
__decorate([
    Input()
], CompanyNoteFormPage.prototype, "note", void 0);
__decorate([
    ViewChild('ckeditor', { static: false })
], CompanyNoteFormPage.prototype, "ckeditor", void 0);
CompanyNoteFormPage = __decorate([
    Component({
        selector: 'app-company-note-form',
        templateUrl: './company-note-form.page.html',
        styleUrls: ['./company-note-form.page.scss'],
    })
], CompanyNoteFormPage);
export { CompanyNoteFormPage };
//# sourceMappingURL=company-note-form.page.js.map