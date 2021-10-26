import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { IonicModule } from '@ionic/angular';

import { RequestFormPageRoutingModule } from './request-form-routing.module';

import { RequestFormPage } from './request-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CKEditorModule,
    ReactiveFormsModule,
    RequestFormPageRoutingModule
  ], 
  declarations: [RequestFormPage]
})
export class RequestFormPageModule {}
