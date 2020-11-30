import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from "@ionic/angular";
import { ActivatedRoute } from '@angular/router';
//services
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { AwsService } from 'src/app/providers/aws.service';
//models
import { Fulltimer } from 'src/app/models/fulltimer';
//pages
import { FulltimerFormPage } from "../fulltimer-form/fulltimer-form.page";


@Component({
  selector: 'app-fulltimer-view',
  templateUrl: './fulltimer-view.page.html',
  styleUrls: ['./fulltimer-view.page.scss'],
})
export class FulltimerViewPage implements OnInit {

  public borderLimit = false;

  public fulltimerUUID: string;
  public fulltimer: Fulltimer;
  public loading = false;

  constructor(
    public aws: AwsService,
    private activatedRoute: ActivatedRoute,
    private fulltimerService: FulltimerService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.fulltimerUUID = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.fulltimerService.view(this.fulltimerUUID).subscribe(res => {
      this.loading = false;
      this.fulltimer = res;
    });
  }

  /**
   * get candidate resume url
   */
  getResumeUrl() {
    return this.aws.permanentBucketUrl + 'fulltimer-resume/' + encodeURIComponent(this.fulltimer.fulltimer_pdf_cv);
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        model: this.fulltimer,
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
   * On candidate selected from list
   */
  rowSelected(store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
