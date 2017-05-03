import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

// Page Imports
import { DefaultPage } from '../default/default';
import { CandidateListPage } from '../candidate/candidate-list/candidate-list';
import { CompanyListPage } from '../company/company-list/company-list';
import { UniversityListPage } from '../university/university-list/university-list';
import { CountryListPage } from '../country/country-list/country-list'; 
import { GenerateIdPage } from '../candidate/generate-id/generate-id';

// Services
import { AuthService } from '../../../providers/auth.service';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})
export class NavigationPage {

  rootPage: any = DefaultPage;

  @ViewChild('loggedInContent') nav: NavController

  constructor(
    private _auth: AuthService,
    private _menuCtrl: MenuController
  ){}

  loadPage(pageName: string){
    switch(pageName){
      case "summary":
        this.rootPage = DefaultPage;
        break;
      case "candidates":
        this.rootPage = CandidateListPage;
        break;
      case "generateId":
        this.rootPage = GenerateIdPage
        break;
      case "companies":
        this.rootPage = CompanyListPage;
        break;
      case "university":
        this.rootPage = UniversityListPage;
        break;
      case "country":
        this.rootPage = CountryListPage;
        break;
    }

    this._menuCtrl.close();
  }

  /**
   * Log Agent out of the app
   */
  logout(){
    this._auth.logout();
  }

}
