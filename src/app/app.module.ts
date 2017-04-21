import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// App Imports
import { MyApp } from './app.component';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { DefaultPage } from '../pages/logged-in/default/default';
//University 
import { UniversityListPage } from '../pages/logged-in/university/university-list/university-list';
import { UniversityViewPage } from '../pages/logged-in/university/university-view/university-view';
// Candidate CRUD
import { CandidateListPage } from '../pages/logged-in/candidate/candidate-list/candidate-list';
import { CandidateViewPage } from '../pages/logged-in/candidate/candidate-view/candidate-view';
import { CandidateFormPage } from '../pages/logged-in/candidate/candidate-form/candidate-form';
// Company CRUD
import { CompanyListPage } from '../pages/logged-in/company/company-list/company-list';
// Store CRUD
import { StoreListPage } from '../pages/logged-in/store/store-list/store-list';
import { StoreViewPage } from '../pages/logged-in/store/store-view/store-view';
import { StoreFormPage } from '../pages/logged-in/store/store-form/store-form';
// Generic Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
// Logged-in Services
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { CandidateService } from '../providers/logged-in/candidate.service';
import { CompanyService } from '../providers/logged-in/company.service';
import { StoreService } from '../providers/logged-in/store.service';
import { BankService } from '../providers/logged-in/bank.service';
import { UniversityService } from '../providers/logged-in/university.service'; 

export const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '3b6fc136'
  }
};

@NgModule({
  declarations: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    DefaultPage,
    // Candidate Crud
    CandidateListPage,
    CandidateViewPage,
    CandidateFormPage,
    // Company Crud
    CompanyListPage,
    // Store Crud
    StoreListPage,
    StoreViewPage,
    StoreFormPage,
    //university 
    UniversityListPage,
    UniversityViewPage
  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    DefaultPage,
    // Candidate Crud
    CandidateListPage,
    CandidateViewPage,
    CandidateFormPage,
    // Company Crud
    CompanyListPage,
    // Store Crud
    StoreListPage,
    StoreViewPage,
    StoreFormPage,
    //university 
    UniversityListPage,
    UniversityViewPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot()
  ],
  providers: [
      // Ionic Native 
      StatusBar,
      SplashScreen,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      // Custom
      AuthService, // Handles all Authorization
      ConfigService, // Handles Environment-specific Variables
      AuthHttpService,
      CandidateService,
      CompanyService,
      StoreService,
      BankService,
      UniversityService
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
