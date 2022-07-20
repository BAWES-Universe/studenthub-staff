import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
//services
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
//models
import { Fulltimer } from 'src/app/models/fulltimer';
import { Story } from 'src/app/models/request';
//pages
import { FulltimerFormPage } from '../fulltimer-form/fulltimer-form.page';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-fulltimer-list',
  templateUrl: './fulltimer-list.page.html',
  styleUrls: ['./fulltimer-list.page.scss'],
})
export class FulltimerListPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public fulltimers: Fulltimer[] = [];

  public story: Story;

  constructor(
    private fulltimerService: FulltimerService,
    public authService: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

    const state = window.history.state;

    if (state.story) {
      this.story = state.story;
    } else if (this.authService.story) {
      this.story = this.authService.story;
    }

    window.analytics.page('Fulltimer List Page');

    this.loadData(this.currentPage);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;

    this.fulltimerService.list(this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.fulltimers = response.body;
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('fulltimer-view/' + model.fulltimer_uuid, {
      state: {
        model: model,
        story: this.story
      }
    });
  }

  /**
   * Loads the create page
   */
  async create($event, fulltimer: Fulltimer = new Fulltimer()) {
    $event.preventDefault();
    $event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        model: fulltimer
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData(this.currentPage);
      }
    });
    return await modal.present();
  }

  async delete(event, fulltimer: Fulltimer) {
    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Fulltimer?',
      message: 'Are you sure you want to delete this Fulltimer?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.loading = true;
            this.fulltimerService.delete(fulltimer).subscribe(async jsonResp => {
              this.loading = false;

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
              }
              this.loadData(this.currentPage);
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
   * load more
   * @param event
   */
  doInfinite(event) {
    this.loadMore = true;

    this.currentPage++;
    this.fulltimerService.list(this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.fulltimers = this.fulltimers.concat(response.body);
    },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
