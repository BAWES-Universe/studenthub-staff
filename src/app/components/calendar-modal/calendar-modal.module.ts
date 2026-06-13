import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CalendarModal } from './calendar-modal.component';

@NgModule({
  declarations: [CalendarModal],
  imports: [CommonModule, IonicModule],
  exports: [CalendarModal],
})
export class CalendarModalModule {}
