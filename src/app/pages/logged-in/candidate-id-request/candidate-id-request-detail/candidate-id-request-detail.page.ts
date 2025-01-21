import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdRequestService } from 'src/app/providers/logged-in/candidate-id-request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-candidate-id-request-detail',
  templateUrl: './candidate-id-request-detail.page.html',
  styleUrls: ['./candidate-id-request-detail.page.scss'],
})
export class CandidateIdRequestDetailPage implements OnInit {

  public id: string;

  public loading: boolean = false;
  public deleting: boolean = false;

  public model: any;
  public borderLimit: boolean = false;

  public interval;

  constructor(
    public router: Router,
    public awsService: AwsService,
    public authservice: AuthService,
    public activatedRoute: ActivatedRoute,
    public translateService: TranslateLabelService,
    public candidateIdRequestService: CandidateIdRequestService,
    public analyticService: AnalyticsService,
    public alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.analyticService.page('ID Request View Page');
 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadData();
  }
 
  /*ionViewWillEnter() {
    this.loadData();
  }*/

  ionViewWillLeave() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async loadData(loading = true) {
    
    this.loading = loading;
 
    this.candidateIdRequestService.view(this.id).subscribe(response => {

      this.model = response;

      this.loading = false;

      if (this.model.status != "completed" && !this.interval) {
        this.interval = setInterval(() => { 
          this.loadData(false);
        }, 1000);
      } else if (this.model.status == "completed" && this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    });
  }

  async delete() {
     
    this.deleting = true;
 
    this.candidateIdRequestService.delete(this.id).subscribe(response => {

       if (response.operation === 'success') {
        this.router.navigate(['/candidate-id-requests']);
       } else {
        this.alertCtrl.create({
          header: 'Error',
          message: this.authservice.errorMessage(response.message),
          buttons: ['OK']
        }).then(alert => alert.present);
       }

      this.deleting = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
