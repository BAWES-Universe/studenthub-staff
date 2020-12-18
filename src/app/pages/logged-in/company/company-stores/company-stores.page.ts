import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { StoreService } from 'src/app/providers/logged-in/store.service';
//pages
import { StoreFormPage } from '../../store/store-form/store-form.page';


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
    public platform: Platform,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public companyService: CompanyService,
    public storeService: StoreService
  ) { }

  ngOnInit() {

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    const state = window.history.state;

    // if(state.company) {
    //   this.company = state.company;
    //   console.log(this.company);
    // } else {
    //   this.loadData();
    // }
  }
  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.companyService.view(this.company_id).subscribe(data => {
      this.company = data;
      console.log(this.company);
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
        company_id: this.company_id,
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
      }
    });
    return await modal.present();
  }

  /**
   * push select company data to store view
   * @param model
   */
  storeSelected(model) {
    this.router.navigate(['store-view', model.store_id], {
      state: {
        model
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
