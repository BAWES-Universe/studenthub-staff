import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateFormPageRoutingModule } from './candidate-form-routing.module';

import { CandidateFormPage } from './candidate-form.page';
import {SelectSearchModule} from 'src/app/components/select-search/select-search.module';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import {ImageUploadModule} from 'src/app/components/image-upload/image-upload.module';
@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        CandidateFormPageRoutingModule,
        ReactiveFormsModule,
        SelectSearchModule,
        LoadingModalModule,
        ImageUploadModule
    ],
  declarations: [CandidateFormPage]
})
export class CandidateFormPageModule {}
