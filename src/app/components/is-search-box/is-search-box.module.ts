import { NgModule } from '@angular/core';
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
        FormsModule,
        CommonModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsSearchBoxComponent
    ]
})
export class IsSearchBoxModule { }