import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { IsInfiniteHitsComponent } from './is-infinite-hits.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
let IsInfiniteHitsModule = class IsInfiniteHitsModule {
};
IsInfiniteHitsModule = __decorate([
    NgModule({
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
], IsInfiniteHitsModule);
export { IsInfiniteHitsModule };
//# sourceMappingURL=is-infinite-hits.module.js.map