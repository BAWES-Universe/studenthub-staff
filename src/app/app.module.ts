import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {IonicStorageModule, Storage} from '@ionic/storage';
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

export function startupServiceFactory(authService, storage) {
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
        IonicStorageModule.forRoot({
            name: '__payroll_staff',
            version: 2
            // driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
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
    ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService, Storage],
      multi: true
    },
    File,
    FileChooser,
    FilePath,
    IOSFilePicker,
    SwUpdate,
    TranslateLabelService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: ErrorHandler, useClass: SentryErrorhandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
