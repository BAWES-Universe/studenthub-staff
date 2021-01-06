import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { EventService } from 'src/app/providers/event.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
//pages
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
    public modalCtrl: ModalController,
    public eventService: EventService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.companyService.view(this.company.company_id,'subCompanies,subCompanies.stores').subscribe(data => {
      this.company = data;

      this.loading = false;
    });
  }

  /**
   * Load company detail page when its selected from the list
   * @param model
   */
  async rowSelected(model) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['company-view', model.company_id], {
          state: {
            model: model
          }
        });
      }, 100);
    });
    /*
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyViewPage,
      componentProps: {
        company_id: model.company_id,
        company: model
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();*/
  }

  /**
   * Create a new sub company
   */
  async create() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const company = new Company();
    company.parent_company_id = this.company.company_id;

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

        this.eventService.reloadStats$.next({
          company_id: this.company.company_id
        });

        this.loadData();
      }
    });
    modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
