import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, NavController } from 'ionic-angular';

// Page Imports
import { DefaultPage } from '../default/default';
import { CandidateListPage } from '../candidate/candidate-list/candidate-list';
import { CompanyListPage } from '../company/company-list/company-list';
import { UniversityListPage } from '../university/university-list/university-list';
import { CountryListPage } from '../country/country-list/country-list'; 
import { GenerateIdPage } from '../candidate/generate-id/generate-id';
import { ExpiredIdPage } from '../candidate/expired-id/expired-id';

// Services
import { AuthService } from '../../../providers/auth.service';
import { CandidateIdCardService } from '../../../providers/logged-in/candidate-id-card.service';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})
export class NavigationPage {

  rootPage: any = DefaultPage;

  public expiredIdCount: number = 5;

  @ViewChild('loggedInContent') nav: NavController

  constructor(
    private _auth: AuthService,
    private _menuCtrl: MenuController,
    private _events: Events,
    private candidateIdCardService: CandidateIdCardService
  ){
    this.updateExpiredIdCount();
  }
  
  /**
   * Using Ng2 Lifecycle hooks because view lifecycle events don't trigger for Bootstrapped MyApp Component
   */
  ngOnInit(){
      // Check for network connection
      this._events.subscribe('navigation:expiredIdCard', (userEventData) => {
        this.updateExpiredIdCount();
      });
  }

  updateExpiredIdCount() {
    this.candidateIdCardService.totalExpiredIds().subscribe(result => {
      this.expiredIdCount = result.total;
    });
  }

  loadPage(pageName: string){
    switch(pageName){
      case "summary":
        this.rootPage = DefaultPage;
        break;
      case "candidates":
        this.rootPage = CandidateListPage;
        break;
      case "expiredId":
        this.rootPage = ExpiredIdPage;
        break;
      case "generateId":
        this.rootPage = GenerateIdPage;
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
