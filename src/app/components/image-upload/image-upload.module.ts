import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import {ImageUploadComponent} from './image-upload.component';


@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    ImageUploadComponent,
  ]
})
export class ImageUploadModule { }

