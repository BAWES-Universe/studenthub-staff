import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
 
import { UpdateAlertComponent } from './update-alert.component';


@NgModule({
    declarations: [UpdateAlertComponent],
    imports: [ 
        IonicModule
    ],
    exports: [UpdateAlertComponent]
})
export class UpdateAlertModule { }