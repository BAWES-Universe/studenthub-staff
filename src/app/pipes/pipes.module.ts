import { NgModule } from '@angular/core';
import { FileSizePipe } from './filesize.pipe';
import { TimeAgoPipe } from './timeago.pipe'; 

//import custom pipes here
@NgModule({
    declarations: [ 
        TimeAgoPipe,
        FileSizePipe
    ],
    imports: [],
    exports: [
        TimeAgoPipe,
        FileSizePipe
    ]
})
export class PipesModule {}