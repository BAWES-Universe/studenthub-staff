import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateUpdateEmailPageRoutingModule } from './candidate-update-email-routing.module';

import { CandidateUpdateEmailPage } from './candidate-update-email.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CandidateUpdateEmailPageRoutingModule
  ],
  declarations: [CandidateUpdateEmailPage]
})
export class CandidateUpdateEmailPageModule {}
