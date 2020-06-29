import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateFormPageRoutingModule } from './candidate-form-routing.module';

import { CandidateFormPage } from './candidate-form.page';
import {ImageUploadComponent} from "src/app/components/image-upload/image-upload.component";
import {SelectSearchModule} from "src/app/components/select-search/select-search.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CandidateFormPageRoutingModule,
    SelectSearchModule
  ],
  declarations: [CandidateFormPage, ImageUploadComponent]
})
export class CandidateFormPageModule {}
