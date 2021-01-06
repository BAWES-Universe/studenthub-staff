import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ModalPopPage } from './modal-pop.page';
import { ModalPopRoutingModule } from './modal-pop.router.module';


@NgModule({
  imports: [
    IonicModule,
    ModalPopRoutingModule
  ],
  declarations: [
    ModalPopPage,
  ]
})
export class ModalPopPageModule {}
