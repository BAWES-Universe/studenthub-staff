import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RequestListingComponent} from './request-listing.component';
import {PipesModule} from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    RequestListingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
  ],
  exports: [
    RequestListingComponent
  ]
})
export class RequestListingModule {
}

