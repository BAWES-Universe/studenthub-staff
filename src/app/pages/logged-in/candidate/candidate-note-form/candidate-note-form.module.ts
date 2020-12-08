import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateNoteFormPageRoutingModule } from './candidate-note-form-routing.module';

import { CandidateNoteFormPage } from './candidate-note-form.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CKEditorModule,
    CandidateNoteFormPageRoutingModule
  ],
  declarations: [CandidateNoteFormPage]
})
export class CandidateNoteFormPageModule { }
