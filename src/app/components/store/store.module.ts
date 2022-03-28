import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    StoreComponent
  ]
})
export class StoreModule { }
