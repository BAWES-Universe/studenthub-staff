import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { MenuOptionPageRoutingModule } from './menu-option-routing.module';

import { MenuOptionPage } from './menu-option.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    MenuOptionPageRoutingModule
  ],
  declarations: [MenuOptionPage]
})
export class MenuOptionPageModule {}
