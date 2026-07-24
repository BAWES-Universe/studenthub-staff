import { NgModule } from '@angular/core';
import { InstantSearchModule } from 'src/app/components/instantsearch/instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { IsSearchBoxComponent } from './is-search-box.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [       
        IsSearchBoxComponent
    ],
    imports: [
        IonicModule,
        InstantSearchModule,
        FormsModule,
        CommonModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsSearchBoxComponent
    ]
})
export class IsSearchBoxModule { }