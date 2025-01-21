import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactAttemptPageRoutingModule } from './contact-attempt-routing.module';

import { ContactAttemptPage } from './contact-attempt.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    IonicModule,
    ContactAttemptPageRoutingModule
  ],
  declarations: [ContactAttemptPage]
})
export class ContactAttemptPageModule {}
