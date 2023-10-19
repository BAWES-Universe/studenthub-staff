import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// services
import { EmailCampaignService } from 'src/app/providers/logged-in/email-campaign.service';
import { AuthService } from 'src/app/providers/auth.service';
// pages
import { EmailCampaignFormPage } from '../email-campaign-form/email-campaign-form.page';
// models
import { EmailCampaign } from 'src/app/models/email-campaign';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-email-campaign-view',
  templateUrl: './email-campaign-view.page.html',
  styleUrls: ['./email-campaign-view.page.scss'],
})
export class EmailCampaignViewPage implements OnInit {

  public campaign_uuid: string;

  public emailCampaign: EmailCampaign;

  public loading = false;

  private interval; 

  constructor(
    private emailCampaignService: EmailCampaignService,
    private activateRoute: ActivatedRoute,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    public authService: AuthService,
    public analyticService: AnalyticsService,
    public eventService: EventService

  ) {
    // this.emailCampaign = params.get('model');
  }

  ngOnInit() {
    this.analyticService.page('Email Campaign View Page');

    // Load the passed model if available
    if (window.history.state) {
      this.emailCampaign = window.history.state.model;
    }

    this.campaign_uuid = this.activateRoute.snapshot.paramMap.get('campaign_uuid');

    this.loadData();
  }


  ngOnDestroy() {
    if(this.interval)
      this.stopWatching();
  }

  ionViewWillLeave() {
    if(this.interval)
      this.stopWatching();
  }

  loadData() {
    this.loading = true;

    this.emailCampaignService.view(this.campaign_uuid).subscribe(emailCampaign => {

      this.emailCampaign = emailCampaign;

      this.loading = false;

      if([1, 3].indexOf(this.emailCampaign.status) > -1) {
        this.startWatching();
      }

    }, () => {

      this.loading = false;
    });
  }

  start() {
    this.emailCampaignService.start(this.emailCampaign).subscribe(async res => {

      if(res.operation == "success") 
      {
        this.emailCampaign.status = 3;

        this.startWatching();
      } 
      else 
      {
        let prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(res.message),
          buttons: ["Okay"]
        });
        prompt.present();  
      }
    });
  }

  stopWatching() {
    clearInterval(this.interval);
    this.interval = null; 

    this.eventService.campaignStopped$.next({
      campaign_uuid: this.campaign_uuid
    });
  }

  startWatching() {
    this.interval = setInterval(() => {
      this.checkStatus();
    }, 5000);

    this.eventService.campaignStarted$.next({
      campaign_uuid: this.campaign_uuid
    });
  }

  checkStatus() {
    this.emailCampaignService.view(this.campaign_uuid).subscribe(res => {
      this.emailCampaign = res; 

      if(this.emailCampaign.status == 2) {
        this.stopWatching();
      }

      this.eventService.campaignStatus$.next(this.emailCampaign);
    });
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this._modalCtrl.create({
      component: EmailCampaignFormPage,
      componentProps: {
       model: this.emailCampaign,
       campaign_uuid: this.emailCampaign.campaign_uuid
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadData();
        //this.emailCampaign = e.data.model;  
      }

      
    });
    modal.present();
  }
}

