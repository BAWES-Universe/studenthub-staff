import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { presentDateRangeAlert } from 'src/app/util/date-alert';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { DailyStandupService } from 'src/app/providers/logged-in/daily-standup.service';


@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.page.html',
  styleUrls: ['./leave-request.page.scss'],
})
export class LeaveRequestPage implements OnInit {
  
  dateRange: { from: string; to: string; };
  
  public form: FormGroup;
  public loading = false;

  public borderLimit = false;

  public range; 
  
  constructor(
    public dailyStandupService: DailyStandupService,
    private fb: FormBuilder,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Leave Request Form Page');

    this.formInit();
  }

  formInit() {
    
      this.form = this.fb.group({
        from_date: [null, Validators.required],
        to_date: [null, Validators.required],
        note: [null, Validators.required],
      }); 
  }

  /**
   * Close the page
   */
  close(refresh = false){
    const data = { refresh };
    this.modalCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save(){
    this.loading = true;
 
    this.dailyStandupService.leaveRequest(this.form.value).subscribe(async jsonResponse => {

      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){

        const prompt = await this.alertCtrl.create({
          header: 'success',
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();

        // Close the page
        this.close(true);
      }

      // On Failure
      if (jsonResponse.operation == 'error'){
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }

  async openCalendarPopup(event) {

    let fromDate = new Date();

    // Set it to one month ago
    fromDate.setMonth(fromDate.getMonth() - 1);

    const date = await presentDateRangeAlert(this.alertCtrl, {
      from: fromDate,
      to: new Date()
    });

    if (date) {
      // this.form.value.from_date
      this.form.controls['from_date'].setValue(date.from);
      this.form.controls['to_date'].setValue(date.to);

      this.range = date.from + '-' + date.to;
    }
  }
  

}
