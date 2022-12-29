import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, IonNav, ModalController, Platform, ToastController} from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
//services
import { EventService } from 'src/app/providers/event.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { StoreService } from 'src/app/providers/logged-in/store.service';
//pages
import { StoreFormPage } from '../../store/store-form/store-form.page';
import {StoreViewPage} from "../../store/store-view/store-view.page";


@Component({
  selector: 'app-company-stores',
  templateUrl: './company-stores.page.html',
  styleUrls: ['./company-stores.page.scss'],
})
export class CompanyStoresPage implements OnInit {

  public company_id;

  public company: Company;

  public updating: boolean = false;

  public loading: boolean = false;

  public borderLimit: boolean = false;

  constructor(
    public router: Router,
    public platform: Platform,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public eventService: EventService,
    public companyService: CompanyService,
    public storeService: StoreService,
    @Optional() public nav: IonNav
  ) { }

  ngOnInit() {
    window.analytics.page('Company Stores Page');

    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.companyService.view(this.company.company_id, 'stores,stores.brand,brands,stores.mall').subscribe(data => {
      this.company = data;
      this.loading = false;
    });
  }

  /**
   * Delete the provided model
   */
  async deleteStore(event, store: Store) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Store',
      message: 'Are you sure you want to delete this Store?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.updating = true;

            this.storeService.delete(store).subscribe(async jsonResp => {

              this.updating = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: jsonResp.message,
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();

                this.company.stores = this.company.stores.filter(e => {
                  return e.store_id != store.store_id;
                });

                this.eventService.reloadStats$.next({
                  company_id: this.company.company_id
                });
              }
            }, () => {
              this.updating = false;
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  /**
   * Loads the create page
   */
  async addStore() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        company_id: this.company.company_id,
        company: this.company,
        brands: this.company.brands
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();

        this.eventService.reloadStats$.next({
          company_id: this.company.company_id
        });
      }
    });
    return await modal.present();
  }

  /**
   * push select company data to store view
   * @param model
   */
  async storeSelected(model) {
    this.nav.push(StoreViewPage,{
      store_id: model.store_id
    });
    // this.modalCtrl.dismiss().then(() => {
    //   setTimeout(() => {
    //     this.router.navigate(['store-view', model.store_id], {
    //       state: {
    //         model: model
    //       }
    //     });
    //   }, 100);
    // });
    /*
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreViewPage,
      componentProps: {
        store_id: model.store_id,
        store: model
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

  dismiss() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss();
      }
    })
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
