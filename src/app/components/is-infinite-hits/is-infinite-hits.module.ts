import { NgModule } from '@angular/core';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { IsInfiniteHitsComponent } from './is-infinite-hits.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [       
        IsInfiniteHitsComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        NgAisModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsInfiniteHitsComponent
    ]
})
export class IsInfiniteHitsModule { }