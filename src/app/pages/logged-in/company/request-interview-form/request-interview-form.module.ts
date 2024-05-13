import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestInterviewFormPage } from './request-interview-form.page';
import { SelectSearchModule } from 'src/app/components/select-search/select-search.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    SelectSearchModule,
    IonicModule,
  ],
  declarations: [RequestInterviewFormPage]
})
export class RequestInterviewFormPageModule {}
