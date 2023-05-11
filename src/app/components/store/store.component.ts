import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
//models
import { Store } from 'src/app/models/store';
//pages
import { StoreFormPage } from 'src/app/pages/logged-in/store/store-form/store-form.page';
import { StoreOptionPage } from 'src/app/pages/logged-in/store/store-option/store-option.page';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { StoreService } from 'src/app/providers/logged-in/store.service';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  @Input() store: Store;
  @Input() editIcon = true;
  @Input() locationLbl = true;

  public loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public storeService: StoreService,
    public authService: AuthService,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  /**
   * popover for store option
   * @param event
   */
   async options(event) {

    event.preventDefault();
    event.stopPropagation();

    const popover = await this.popoverCtrl.create({
      component: StoreOptionPage,
      cssClass: 'store-option',
      event: event,
      translucent: true,
      showBackdrop: false
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if(data && data.action == 'delete') {
      this.delete();
    }

    if(data && data.action == 'edit') {
      this.edit();
    }
  }

  /**
   * open store form
   */
    async edit() {
      window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

      const modal = await this.modalCtrl.create({
        component: StoreFormPage,
        componentProps: {
          company_id: this.store.company_id,
          company: this.store.company,
          model: this.store,
          brands: this.store.company?.brands,
         // malls: this.malls
        }
      });
      modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
          window['history-back-from'] = 'onDidDismiss';
          window.history.back();
        }

        if (e.data && e.data.refresh) {
          this.onUpdate.emit();
        }
      });
      return await modal.present();
  }

  /**
   * Delete the provided model
   */
  async delete() {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Store?',
      message: 'Are you sure you want to delete this Store?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.loading = true;

            this.storeService.delete(this.store).subscribe(async jsonResp => {

              this.loading = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: this.authService.errorMessage(jsonResp.message),
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: this.authService.errorMessage(jsonResp.message),
                  duration: 3000
                });
                toast.present();
              }

              this.navCtrl.back();

              this.onDelete.emit();
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

}
