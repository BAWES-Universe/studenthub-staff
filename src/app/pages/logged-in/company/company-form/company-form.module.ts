import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyFormPageRoutingModule } from './company-form-routing.module';

import { CompanyFormPage } from './company-form.page';
import {ImageUploadModule} from '../../../../components/image-upload/image-upload.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CompanyFormPageRoutingModule,
    ImageUploadModule
  ],
  declarations: [CompanyFormPage]
})
export class CompanyFormPageModule {}
