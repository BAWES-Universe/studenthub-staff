import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

// App Imports
import { MyApp } from './app.component';

/**
 * Pages
 */
// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { DefaultPage } from '../pages/logged-in/default/default';
//Country
import { CountryListPage } from '../pages/logged-in/country/country-list/country-list';
import { CountryViewPage } from '../pages/logged-in/country/country-view/country-view';
//University 
import { UniversityListPage } from '../pages/logged-in/university/university-list/university-list';
import { UniversityViewPage } from '../pages/logged-in/university/university-view/university-view';
// Candidate CRUD
import { CandidateListPage } from '../pages/logged-in/candidate/candidate-list/candidate-list';
import { CandidateViewPage } from '../pages/logged-in/candidate/candidate-view/candidate-view';
import { CandidateFormPage } from '../pages/logged-in/candidate/candidate-form/candidate-form';
// Generate ID
import { GenerateIdPage } from '../pages/logged-in/candidate/generate-id/generate-id';

import { ExpiredIdPage } from '../pages/logged-in/candidate/expired-id/expired-id';

// Company CRUD
import { CompanyListPage } from '../pages/logged-in/company/company-list/company-list';
// Store CRUD
import { StoreListPage } from '../pages/logged-in/store/store-list/store-list';
import { StoreViewPage } from '../pages/logged-in/store/store-view/store-view';
import { StoreFormPage } from '../pages/logged-in/store/store-form/store-form';

/**
 * Components
 */
import { ImageUploadComponent } from '../components/image-upload/image-upload';

/**
 * Modules
 */
import { EnvironmentsModule } from './environments/environments.module';
import { SelectSearchModule } from '../components/select-search/select-search.module';


/**
 * Services
 */
// Generic Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AwsService } from '../providers/aws.service';
import { CameraService } from '../providers/camera.service';
// Logged-in Services
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { CandidateService } from '../providers/logged-in/candidate.service';
import { CompanyService } from '../providers/logged-in/company.service';
import { StoreService } from '../providers/logged-in/store.service';
import { BankService } from '../providers/logged-in/bank.service';
import { UniversityService } from '../providers/logged-in/university.service'; 
import { CountryService } from '../providers/logged-in/country.service';  
import { CandidateIdCardService } from '../providers/logged-in/candidate-id-card.service';  
import { StatisticService } from '../providers/logged-in/statistic.service';

export const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '3b6fc136'
  }
};

@NgModule({
  declarations: [
    /**
     * Components
     */
    ImageUploadComponent,

    /**
     * Pages
     */
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
    UniversityViewPage,
    // Country
    CountryListPage,
    CountryViewPage,
    //ID 
    GenerateIdPage,
    ExpiredIdPage
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
    UniversityViewPage,
    // Country
    CountryListPage,
    CountryViewPage,
    //ID 
    GenerateIdPage,
    ExpiredIdPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    // Custom Modules
    EnvironmentsModule,
    SelectSearchModule
  ],
  providers: [
      // Ionic Native 
      StatusBar,
      SplashScreen,
      Camera,
      File,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      // Custom
      AwsService, // AWS S3 Upload Functionality
      CameraService, // Handles Native Camera/Gallery selection
      AuthService, // Handles all Authorization
      ConfigService, // Handles Environment-specific Variables
      AuthHttpService,
      CandidateService,
      CompanyService,
      StoreService,
      BankService,
      UniversityService,
      CountryService,
      CandidateIdCardService,
      StatisticService
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
