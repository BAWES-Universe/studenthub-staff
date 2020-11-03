import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyContactListPageRoutingModule } from './company-contact-list-routing.module';
import { CompanyContactListPage } from './company-contact-list.page';
let CompanyContactListPageModule = class CompanyContactListPageModule {
};
CompanyContactListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            CompanyContactListPageRoutingModule
        ],
        declarations: [CompanyContactListPage]
    })
], CompanyContactListPageModule);
export { CompanyContactListPageModule };
//# sourceMappingURL=company-contact-list.module.js.map