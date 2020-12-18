import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// models
import { Brand } from 'src/app/models/brand';
// services
import { AwsService } from 'src/app/providers/aws.service';
import { BrandService } from 'src/app/providers/logged-in/brand.service';
// pages
import { BrandFormPage } from '../brand-form/brand-form.page';
import {CompanyService} from "../../../../providers/logged-in/company.service";
import {Company} from "../../../../models/company";


@Component({
  selector: 'app-company-brands',
  templateUrl: './company-brands.page.html',
  styleUrls: ['./company-brands.page.scss'],
})
export class CompanyBrandsPage implements OnInit {

  public company_id;

  public brands: Brand[] = [];
  public company: Company;

  public borderLimit = false;
  public loading = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public awsService: AwsService,
    public brandService: BrandService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    const state = window.history.state;

    if (state.company) {
      this.brands = state.company.brands;
      this.company = state.company;
    } else {
      this.loadCompanyDetail();
      this.loadData();
    }
  }

  brandSelected(brand) {
    this.router.navigate(['brand-view', brand.brand_uuid], {
      state: {
        model: brand
      }
    });
  }

  loadData() {
    this.loading = true;
    this.brandService.listByCompany(this.company_id).subscribe(response => {
      this.brands = response;
      this.loading = false;
    });
  }

  /**
   * form to add new brand
   */
  async addBrand() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const brand = new Brand();
    brand.company_id = this.company_id;

    const modal = await this.modalCtrl.create({
      component: BrandFormPage,
      componentProps: {
        model: brand
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

  dismiss(data = null) {
    this.modalCtrl.dismiss(data);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * load company detail
   */
  loadCompanyDetail() {
    this.companyService.view(this.company_id).subscribe(response => {
      this.company = response;
    }, () => {
    });
  }
}
