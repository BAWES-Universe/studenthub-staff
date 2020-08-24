import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './timeago.pipe'; 

//import custom pipes here
@NgModule({
    declarations: [ 
        TimeAgoPipe
    ],
    imports: [],
    exports: [
        TimeAgoPipe
    ]
})
export class PipesModule {}