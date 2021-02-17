import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppErrorPageRoutingModule } from './app-error-routing.module';

import { AppErrorPage } from './app-error.page';

@NgModule({
  imports: [
    CommonModule, 
    IonicModule,
    AppErrorPageRoutingModule
  ],
  declarations: [AppErrorPage]
})
export class AppErrorPageModule {}
