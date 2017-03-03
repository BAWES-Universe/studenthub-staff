import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { DefaultPage } from '../pages/logged-in/default/default';
// Candidate CRUD
import { CandidateListPage } from '../pages/logged-in/candidate/candidate-list/candidate-list';
import { CandidateViewPage } from '../pages/logged-in/candidate/candidate-view/candidate-view';
import { CandidateFormPage } from '../pages/logged-in/candidate/candidate-form/candidate-form';
// Company CRUD 
import { CompanyListPage } from '../pages/logged-in/company/company-list/company-list';
// Generic Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
// Logged-in Services
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { CandidateService } from '../providers/logged-in/candidate.service';
import { CompanyService } from '../providers/logged-in/company.service';

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
    CompanyListPage
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
    CompanyListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      Storage, // Ionic Storage
      AuthService, // Handles all Authorization
      ConfigService, // Handles Environment-specific Variables
      AuthHttpService,
      CandidateService,
      CompanyService
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
