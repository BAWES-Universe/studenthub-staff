import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {IonicStorageModule, Storage} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {UpdateAlertModule} from "./components/update-alert/update-alert.module";
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import {AuthService} from "./providers/auth.service";
import {environment} from "../environments/environment";
import {SentryErrorhandlerService} from "./providers/sentry.errorhandler.service";

export function startupServiceFactory(authService, storage) {
  return () => authService.load();
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot({
            name: '__payroll_staff',
            version: 2
            //driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
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
    SwUpdate,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorhandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
