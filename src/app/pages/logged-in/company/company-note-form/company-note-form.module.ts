import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyNoteFormPageRoutingModule } from './company-note-form-routing.module';

import { CompanyNoteFormPage } from './company-note-form.page';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CKEditorModule,
    CompanyNoteFormPageRoutingModule
  ],
  declarations: [CompanyNoteFormPage]
})
export class CompanyNoteFormPageModule {}
