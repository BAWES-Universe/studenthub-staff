import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

// Pages
import { StoreListPage } from '../../store/store-list/store-list';

// Providers
import { CompanyService } from '../../../../providers/logged-in/company.service';

// Models
import { Company } from '../../../../models/company';

@Component({
  selector: 'page-company-list',
  templateUrl: 'company-list.html'
})
export class CompanyListPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public companies: Company[];

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public companyService: CompanyService,
    private _loadingCtrl: LoadingController,
  ) {
    this.companies = params.get("companies");
        
    if(!this.companies)
    {
      this.loadCompanyList(this.currentPage);
    }
  }
  
  ionViewWillEnter() {}
  ionViewDidLoad() {}

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }

  loadCompanyList(page: number){
    // Load list of companies
    let loader = this._loadingCtrl.create();
    loader.present();
    this.companyService.list().subscribe(response => {
      
      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.companies = response.json();

    },
    error => {},
    () => {loader.dismiss();}
    );
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
    }else{
      // Load store list for this company 
      this.navCtrl.push(StoreListPage, {
        'companyId': model.company_id
      });
    }
    
  }

}
