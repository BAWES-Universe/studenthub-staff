import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Company } from 'src/app/models/company';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { CompanyFormPage } from '../company-form/company-form.page';

@Component({
  selector: 'app-company-subcompanies',
  templateUrl: './company-subcompanies.page.html',
  styleUrls: ['./company-subcompanies.page.scss'],
})
export class CompanySubcompaniesPage implements OnInit {

  public company_id;

  public company: Company;
  
  public borderLimit: boolean = false;

  public loading: boolean = false; 

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    
    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');
    
    const state = window.history.state;

    if(state.company) {
      this.company = state.company;
    } else {
      this.loadData();
    }
  }
  
  loadData() {
    this.loading = true;

    this.companyService.view(this.company_id).subscribe(data => {
      this.company = data;

      this.loading = false;
    });
  }
  
  /**
   * Load company detail page when its selected from the list
   * @param model
   */
  rowSelected(model) {
    this.router.navigate(['company-view', model.company_id], {
      state: {
        model
      }
    });
  }
  
  /**
   * Create a new sub company
   */
  async create() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const company = new Company();
    company.parent_company_id = this.company_id;

    const modal = await this.modalCtrl.create({
      component: CompanyFormPage,
      componentProps: {
        model: company,
        company_id: company.company_id,
        subcompany: true
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
