import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSearchStatusComponent } from './job-search-status.component'; 
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    JobSearchStatusComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    JobSearchStatusComponent
  ]
})
export class JobSearchStatusModule { }
