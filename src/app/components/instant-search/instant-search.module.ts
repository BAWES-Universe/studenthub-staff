import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { InstantSearchComponent } from './instant-search.component';
import { NgAisModule } from 'angular-instantsearch';
import { IsInfiniteHitsModule } from '../is-infinite-hits/is-infinite-hits.module';
import {NgAisConfigureModule} from '../configure/configure.module';

@NgModule({
  declarations: [InstantSearchComponent],
  imports: [
    NgAisModule,
    IonicModule,
    IsInfiniteHitsModule,
    NgAisConfigureModule
  ],
  exports: [InstantSearchComponent]
})
export class InstantSearchModule { }
