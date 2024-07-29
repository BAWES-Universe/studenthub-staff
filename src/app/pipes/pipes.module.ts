import { NgModule } from '@angular/core';
import { AgePipe } from './age.pipe';
import { CandidateAgePipe } from './candidate.age.pipe';
import { FileSizePipe } from './filesize.pipe';
import { GroupByPipe } from './group-by.pipe';
import { StoreIdPipe } from './store-id.pipe';
import { TimeAgoPipe } from './timeago.pipe';
import { DurationPipe } from './duration.pipe';
import {TimeSpentPipe} from './timespent.pipe';
import { TimerPipe } from './timer.pipe';
import { DurationBySecondPipe } from './duration-by-second.pipe';


// import custom pipes here
@NgModule({
    declarations: [
        TimerPipe,
        TimeAgoPipe,
        FileSizePipe,
        GroupByPipe,
        StoreIdPipe,
        AgePipe,
        CandidateAgePipe,
        DurationPipe,
        TimeSpentPipe,
        DurationBySecondPipe
    ],
    imports: [],
    exports: [
        TimerPipe,
        TimeAgoPipe,
        FileSizePipe,
        GroupByPipe,
        StoreIdPipe,
        AgePipe,
        CandidateAgePipe,
        DurationPipe,
        TimeSpentPipe,
        DurationBySecondPipe
    ]
})
export class PipesModule {}
