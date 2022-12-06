import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateAssignFormPageRoutingModule } from './candidate-assign-form-routing.module';

import { CandidateAssignFormPage } from './candidate-assign-form.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CandidateAssignFormPageRoutingModule
  ],
  declarations: [CandidateAssignFormPage]
})
export class CandidateAssignFormPageModule {}
