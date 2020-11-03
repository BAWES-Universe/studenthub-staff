import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { InstantSearchComponent } from './instant-search.component';
import { NgAisModule } from 'angular-instantsearch';
import { IsInfiniteHitsModule } from '../is-infinite-hits/is-infinite-hits.module';
import { NgAisConfigureModule } from '../configure/configure.module';
let InstantSearchModule = class InstantSearchModule {
};
InstantSearchModule = __decorate([
    NgModule({
        declarations: [InstantSearchComponent],
        imports: [
            NgAisModule,
            IonicModule,
            IsInfiniteHitsModule,
            NgAisConfigureModule
        ],
        exports: [InstantSearchComponent]
    })
], InstantSearchModule);
export { InstantSearchModule };
//# sourceMappingURL=instant-search.module.js.map