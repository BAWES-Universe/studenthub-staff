import {APP_INITIALIZER, ErrorHandler, Injector, NgModule} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import {IonicStorageModule, Storage} from '@ionic/storage';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {UpdateAlertModule} from './components/update-alert/update-alert.module';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import {AuthService} from './providers/auth.service';
import {environment} from '../environments/environment';
import {SentryErrorhandlerService} from './providers/sentry.errorhandler.service';
import { TranslateLabelService } from './providers/translate-label.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { SkillFormPageModule } from './pages/logged-in/candidate/skill-form/skill-form.module';
import { ExperienceFormPageModule } from './pages/logged-in/candidate/experience-form/experience-form.module';
import { UploadCvPageModule } from './pages/logged-in/candidate/upload-cv/upload-cv.module';
import { UploadFilePageModule } from './pages/logged-in/company/upload-file/upload-file.module';
import { CompanyNoteFormPageModule } from './pages/logged-in/company/company-note-form/company-note-form.module';
import { CompanyContactFormPageModule } from './pages/logged-in/company/company-contact-form/company-contact-form.module';
import { OptionPageModule } from './pages/logged-in/candidate/option/option.module';
import {BrandFormPageModule} from './pages/logged-in/company/brand-form/brand-form.module';
import {MallFormPageModule} from './pages/logged-in/mall/mall-form/mall-form.module';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';

export function startupServiceFactory(authService) {
  return () => authService.load();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        BrowserTransferStateModule,
        // IonicStorageModule.forRoot({
        //     name: '__payroll_staff',
        //     version: 3
        //     // driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
        // }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        }),
        UpdateAlertModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
        SkillFormPageModule,
        ExperienceFormPageModule,
        UploadCvPageModule,
        UploadFilePageModule,
        CompanyNoteFormPageModule,
        CompanyContactFormPageModule,
        OptionPageModule,
        BrandFormPageModule,
        MallFormPageModule
    ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService],
      multi: true
    },
    File,
    FileChooser,
    FilePath,
    IOSFilePicker,
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
