import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketFormPageRoutingModule } from './ticket-form-routing.module';

import { TicketFormPage } from './ticket-form.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CKEditorModule,
    TranslateModule,
   TicketFormPageRoutingModule
  ],
  declarations: [TicketFormPage]
})
export class TicketFormPageModule {}
