import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateCommittedFormPageRoutingModule } from './candidate-committed-form-routing.module';

import { CandidateCommittedFormPage } from './candidate-committed-form.page';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CKEditorModule,
  ],
  declarations: [CandidateCommittedFormPage]
})
export class CandidateCommittedFormPageModule {}
