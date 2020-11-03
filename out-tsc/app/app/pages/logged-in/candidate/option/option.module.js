import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { OptionPageRoutingModule } from './option-routing.module';
import { OptionPage } from './option.page';
let OptionPageModule = class OptionPageModule {
};
OptionPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            TranslateModule.forChild(),
            OptionPageRoutingModule
        ],
        declarations: [OptionPage]
    })
], OptionPageModule);
export { OptionPageModule };
//# sourceMappingURL=option.module.js.map