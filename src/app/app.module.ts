import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UpdateAlertModule } from './components/update-alert/update-alert.module';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { AuthService } from './providers/auth.service';
import { environment } from '../environments/environment';
import { SentryErrorhandlerService } from './providers/sentry.errorhandler.service';
import { TranslateLabelService } from './providers/translate-label.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthModule } from '@auth0/auth0-angular';


import { SkillFormPageModule } from './pages/logged-in/candidate/skill-form/skill-form.module';
import { ExperienceFormPageModule } from './pages/logged-in/candidate/experience-form/experience-form.module';
import { UploadCvPageModule } from './pages/logged-in/candidate/upload-cv/upload-cv.module';
import { UploadFilePageModule } from './pages/logged-in/company/upload-file/upload-file.module';
import { CompanyNoteFormPageModule } from './pages/logged-in/company/company-note-form/company-note-form.module';
import { CompanyContactFormPageModule } from './pages/logged-in/company/company-contact-form/company-contact-form.module';
import { OptionPageModule } from './pages/logged-in/candidate/option/option.module';
import { BrandFormPageModule } from './pages/logged-in/company/brand-form/brand-form.module';
import { MallFormPageModule } from './pages/logged-in/mall/mall-form/mall-form.module';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';
import { StoreManagerFormPageModule } from './pages/logged-in/store/store-manager-form/store-manager-form.module';
import { CompanyRequestFormPageModule } from './pages/logged-in/company/company-request-form/company-request-form.module';
import { CompanyContactListPageModule } from './pages/logged-in/company/company-contact/company-contact-list/company-contact-list.module';
import { AllCompanyListPageModule } from './pages/logged-in/company/company-request-list/all-company-list/all-company-list.module';
import { CompanyFormPageModule } from './pages/logged-in/company/company-form/company-form.module';
import { ImageUploadModule } from './components/image-upload/image-upload.module';
import { CandidateNoteFormPageModule } from './pages/logged-in/candidate/candidate-note-form/candidate-note-form.module';
import { FulltimerLocationPageModule } from './pages/logged-in/fulltimer/fulltimer-location/fulltimer-location.module';
import { NationalityPageModule } from './pages/logged-in/pickers/nationality/nationality.module';
import { CompanyRequestListPopupPageModule } from './pages/logged-in/company/company-request-list/company-request-list-popup/company-request-list-popup.module';
import { CandidateCommittedFormPageModule } from './pages/logged-in/candidate/candidate-committed-form/candidate-committed-form.module';
import { CandidateMergeSelectPageModule } from './pages/logged-in/candidate/candidate-merge-select/candidate-merge-select.module';
import { NoteModule } from './components/note/note.module';
import { SuggestPageModule } from './pages/logged-in/suggest/suggest.module';
import { FulltimerFormPageModule } from './pages/logged-in/fulltimer/fulltimer-form/fulltimer-form.module';
import { CompanyModule } from './components/company/company.module';
import { LocationPageModule } from './pages/logged-in/candidate/location/location.module';
import { TransferChartPageModule } from './pages/logged-in/transfer/transfer-chart/transfer-chart.module';

import { TransferFormPageModule } from './pages/logged-in/transfer/transfer-form/transfer-form.module';
import { ImportTransferFormPageModule } from './pages/logged-in/transfer/import-transfer-form/import-transfer-form.module';
import { TransferListPageModule } from './pages/logged-in/transfer/transfer-list/transfer-list.module';
import { CompanyDocumentsPageModule } from './pages/logged-in/company/company-documents/company-documents.module';
import { CompanyStoresPageModule } from './pages/logged-in/company/company-stores/company-stores.module';
import { CompanyContactsPageModule } from './pages/logged-in/company/company-contacts/company-contacts.module';
import { CompanyBrandsPageModule } from './pages/logged-in/company/company-brands/company-brands.module';
import { CompanyNotesPageModule } from './pages/logged-in/company/company-notes/company-notes.module';
import { CompanyRequestsPageModule } from './pages/logged-in/company/company-requests/company-requests.module';
import { CompanyMallsPageModule } from './pages/logged-in/company/company-malls/company-malls.module';
import { CompanySubcompaniesPageModule } from './pages/logged-in/company/company-subcompanies/company-subcompanies.module';
import {ModalPopPageModule} from './pages/logged-in/modal-pop/modal-pop.module';
import {StoreViewPageModule} from './pages/logged-in/store/store-view/store-view.module';
import { InvitePageModule } from './pages/logged-in/invite/invite.module';
import {FulltimeLocationPageModule} from './pages/logged-in/fulltimer/fulltime-location/fulltime-location.module';
import { FulltimerSearchPageModule } from './pages/logged-in/fulltimer/fulltimer-search/fulltimer-search.module';
import { StaffPageModule } from './pages/logged-in/pickers/staff/staff.module';
import { DateDropdownModule } from './components/date-dropdown/date-dropdown.module';
import { CalendarModule } from 'ion2-calendar';
import {CompanyFilterPageModule} from './pages/logged-in/company/company-list/company-filter/company-filter.module';
import { StoreOptionPageModule } from './pages/logged-in/store/store-option/store-option.module';
import { StoreModule } from './components/store/store.module';
import { ActionComponent } from './components/action/action.component';
import { ActionComponentModule } from './components/action/action.module';
import {UniversityPageModule} from './pages/logged-in/pickers/university/university.module';
import { CandidateAssignFormPageModule } from './pages/logged-in/candidate-assign-form/candidate-assign-form.module';
import { LeaveRequestPageModule } from './pages/logged-in/leave-request/leave-request.module';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageService } from './providers/storage.service';
import {DatePopupModule} from "./components/date-popup/date-popup.module";
import {EvaluationReportViewPageModule} from "./pages/logged-in/candidate/evaluation/evaluation-report-view/evaluation-report-view.module";
import {MenuOptionPageModule} from "src/app/pages/logged-in/default/menu-option/menu-option.module";
import { TagFormPageModule } from './pages/logged-in/candidate/tag-form/tag-form.module';
import { CandidateWarningFormPageModule } from './pages/logged-in/candidate/candidate-warning-form/candidate-warning-form.module';

export function startupServiceFactory(authService) {
  return () => authService.load();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

declare global {
  interface Window { analytics: any; }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [
    ActionComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CalendarModule,
    BrowserTransferStateModule,
    IonicStorageModule.forRoot({
      name: '__payroll_staff',
    //     version: 3
    //     // driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    }),
    AuthModule.forRoot({
      domain: 'bawes.us.auth0.com',
      clientId: 'sDIOpy1be7Y59ocKoXxHVL5euFNdJN3e'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    UpdateAlertModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    CKEditorModule,
    DateDropdownModule,
    SkillFormPageModule,
    TagFormPageModule,
    ExperienceFormPageModule,
    UploadCvPageModule,
    UploadFilePageModule,
    CompanyNoteFormPageModule,
    CompanyContactFormPageModule,
    CompanyRequestFormPageModule,
    StoreManagerFormPageModule,
    OptionPageModule,
    BrandFormPageModule,
    MallFormPageModule,
    CompanyContactListPageModule,
    AllCompanyListPageModule,
    CompanyFormPageModule,
    ImageUploadModule,
    CandidateNoteFormPageModule,
    FulltimerLocationPageModule,
    FulltimerFormPageModule,
    NationalityPageModule,
    CompanyRequestListPopupPageModule,
    CandidateCommittedFormPageModule,
    CandidateMergeSelectPageModule,
    NoteModule,
    SuggestPageModule,
    CompanyModule,
    LocationPageModule,
    TransferFormPageModule,
    ImportTransferFormPageModule,
    TransferListPageModule,
    CompanyDocumentsPageModule,
    CompanyContactsPageModule,
    CompanyBrandsPageModule,
    CompanyNotesPageModule,
    CompanyRequestsPageModule,
    CompanyMallsPageModule,
    CompanySubcompaniesPageModule,
    CompanyStoresPageModule,
    TransferChartPageModule,
    ModalPopPageModule,
    StoreViewPageModule,
    InvitePageModule,
    FulltimerSearchPageModule,
    FulltimeLocationPageModule,
    StaffPageModule,
    StoreOptionPageModule,
    StoreModule,
    UniversityPageModule,
    CompanyFilterPageModule,
    ActionComponentModule,
    CandidateAssignFormPageModule,
    CandidateWarningFormPageModule,
    LeaveRequestPageModule,
    DatePopupModule,
    EvaluationReportViewPageModule,
    MenuOptionPageModule
  ],
  exports: [
    ActionComponentModule
  ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService, StorageService],
      multi: true
    },
    File,
    SwUpdate,
    TranslateLabelService,
    SelectiveLoadingStrategy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorhandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  static injector: Injector;

  constructor(public injector: Injector) {
    AppModule.injector = injector;
  }
}
