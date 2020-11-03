import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { AppliedFiltersComponent } from './applied-filters.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
let AppliedFiltersModule = class AppliedFiltersModule {
};
AppliedFiltersModule = __decorate([
    NgModule({
        declarations: [
            AppliedFiltersComponent
        ],
        providers: [
            CurrencyPipe
        ],
        imports: [
            CommonModule,
            IonicModule,
            NgAisModule,
            TranslateModule.forChild(),
        ],
        exports: [
            AppliedFiltersComponent
        ]
    })
], AppliedFiltersModule);
export { AppliedFiltersModule };
//# sourceMappingURL=applied-filters.module.js.map