import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CompanyRegistrationRequestService } from 'src/app/providers/logged-in/company-registration-request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AwsService } from 'src/app/providers/aws.service';
//models
import { ComapanyRequest } from 'src/app/models/company.request';
 

@Component({
  selector: 'app-company-registration-request-view',
  templateUrl: './company-registration-request-view.page.html',
  styleUrls: ['./company-registration-request-view.page.scss'],
})
export class CompanyRegistrationRequestViewPage implements OnInit {

  public loading = false;
  public borderLimit = false;

  public request: ComapanyRequest;

  public request_uuid; 

  public rejecting: boolean = false; 
  public approving: boolean = false; 

  constructor(
    public activeRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public aws: AwsService,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public registrationRequestService: CompanyRegistrationRequestService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {

    this.request_uuid = this.activeRoute.snapshot.paramMap.get("id");

    this.analyticService.page('Registration Request View Page');

    if(!this.request)
      this.loadData();
  }

  handleRefresh(event) {
    this.loadData(true, event);
  }

  /**
   * load request data
   * @param page
   */
  async loadData(silent = false, event = null) {

    if (!silent) {
      this.loading = true;
    }

    this.registrationRequestService.view(this.request_uuid).subscribe(response => {

      this.loading = false; 
 
      this.request = response;

      if(event) 
        event.target.complete();

    }, () => {
      this.loading = false; 
    });
  }

  /**
   * approve request
   */
  async approve() {

    this.approving = true;
 
    this.registrationRequestService.approve(this.request).subscribe(async jsonResponse => {

      this.approving = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        const prompt = await this.alertCtrl.create({
          header: "Success",
          message: jsonResponse.message,
          buttons: ['Okay']
        });
        prompt.present();

        // Close the page
        const data = { refresh: true };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService._processResponseMessage(jsonResponse),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {

      this.approving = false;

    });
  }

  /**
   * reject request
   */
  async reject() {

    this.rejecting = true;
 
    this.registrationRequestService.reject(this.request).subscribe(async jsonResponse => {

      this.rejecting = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        const prompt = await this.alertCtrl.create({
          header: "Success",
          message: jsonResponse.message,
          buttons: ['Okay']
        });
        prompt.present();

        // Close the page
        const data = { refresh: true };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService._processResponseMessage(jsonResponse),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {

      this.rejecting = false;

    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
