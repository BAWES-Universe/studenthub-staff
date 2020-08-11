import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
import { ToastController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  public company_id;

  public company: Company;
  public subCompanies: Company[] = [];
  public stores: Store[] = [];

  public deleting = false;
  public loading = false;
  public sendingNewPassword = false;

  constructor(
    public platform: Platform,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    public companyService: CompanyService,
    public storeService: StoreService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {

    // Load the passed model if available
    if (window && window.history.state) {
      this.company = window.history.state.model;
    }

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');


    this.loadData();
  }

  /**
   * load compay data
   */
  async loadData(silent = false) {

    if (!silent) {
      this.loading = true;
    }

    if (!this.company) {
      this.company = new Company;
      this.company.company_id = this.company_id;
    }

    this.companyService.view(this.company_id).subscribe(response => {

      this.loading = false;
      this.deleting = false;

      this.company = response;

      this.subCompanies = response.subCompanies;
      this.stores = response.stores;
    }, () => {
      this.loading = false;
      this.deleting = false;
    });
  }

   /**
   * Load company detail page when its selected from the list
   * @param model
   */
  rowSelected(model) {
    this.router.navigate(['company-view', model.company_id], {
      state: {
        model: model
      }
    });
  }

  /**
   * push select company data to store view
   * @param model
   */
  storeSelected(model) {
    this.router.navigate(['store-view', model.store_id], {
      state: {
        model: model
      }
    });
  }

  /**
   * view detail
   */
  viewDetail() {
    this.loading = true;
    this.companyService.view(this.company_id).subscribe( response => {
      this.loading = false;
      this.company = response;
    });
  }
}
