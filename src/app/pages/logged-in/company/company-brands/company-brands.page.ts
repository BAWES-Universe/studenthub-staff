import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// models
import { Brand } from 'src/app/models/brand';
import { Company } from "../../../../models/company";
// services
import { AwsService } from 'src/app/providers/aws.service';
import { BrandService } from 'src/app/providers/logged-in/brand.service';
import { CompanyService } from "../../../../providers/logged-in/company.service";
// pages
import { BrandFormPage } from '../brand-form/brand-form.page';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/providers/analytics.service';


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
    public modalCtrl: ModalController,
    public awsService: AwsService,
    public brandService: BrandService,
    public companyService: CompanyService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Company Brands Page');

    // if (this.company) {
    //   this.brands = this.company.brands;
    // } else {
      this.loadCompanyDetail();
      this.loadData();
    // }
  }

  async brandSelected(brand) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['brand-view', brand.brand_uuid], {
          state: {
            model: brand
          }
        });
      }, 100);
    });
    /*
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: BrandViewPage,
      componentProps: {
        brand_uuid: brand.brand_uuid,
        brand: brand
      },
      cssClass: "popup-modal"  
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();*/
  }

  loadData() {
    this.loading = true;
    this.brandService.listByCompany(this.company.company_id).subscribe(response => {
      this.brands = response;
      this.loading = false;
    });
  }

  /**
   * form to add new brand
   */
  async addBrand() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const brand = new Brand();
    brand.company_id = this.company.company_id;

    const modal = await this.modalCtrl.create({
      component: BrandFormPage,
      componentProps: {
        model: brand
      },
      cssClass: "popup-modal"
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
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss(data);
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * load company detail
   */
  loadCompanyDetail() {
    this.companyService.view(this.company.company_id, 'stats').subscribe(response => {
      this.company = response;
    }, () => {
    });
  }

  error(brand) {
    brand.brand_logo = null;
  }

  show($event, brand) {
    $event.preventDefault();
    $event.stopPropagation();
    brand.show = 1;
  }

  hide($event, brand) {
    $event.preventDefault();
    $event.stopPropagation();
    brand.show = 0;
  }
}
