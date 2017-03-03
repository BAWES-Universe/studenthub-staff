import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

// Pages
// import { CandidateViewPage } from '../candidate-view/candidate-view';
// import { CandidateFormPage } from '../candidate-form/candidate-form';
// Providers
import { CompanyService } from '../../../../providers/logged-in/company.service';
// Models
import { Company } from '../../../../models/company';

@Component({
  selector: 'page-company-list',
  templateUrl: 'company-list.html'
})
export class CompanyListPage {

  public companies: Company[];

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) {}

  ionViewDidLoad() {
    this.loadCompanyList();
  }

  loadCompanyList(){
    // Load list of companies
    let loader = this._loadingCtrl.create();
    loader.present();
    this.companyService.list().subscribe(response => {
      this.companies = response;
      loader.dismiss();
    });
  }

  /**
   * When its selected
   */
  rowSelected(model){
    // Load Detail Page
    // this.navCtrl.push(CandidateViewPage, {
    //   'model': model
    // });
  }

}
