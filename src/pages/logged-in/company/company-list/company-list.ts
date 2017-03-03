import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

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
    params: NavParams,
    public navCtrl: NavController,
    public companyService: CompanyService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) {
    this.companies = params.get("companies");
    if(!this.companies){
      this.loadCompanyList();
    }
  }

  ionViewDidLoad() {
    
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
  rowSelected(model: Company){
    // Check if has subcompanies
    if(model.subcompanies.length > 0){
      // Load Subcompany List
      this.navCtrl.push(CompanyListPage, {
        'companies': model.subcompanies
      });
    }
    
  }

}
