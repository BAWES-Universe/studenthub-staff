import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateWorkingHour } from 'src/app/models/candidate';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
//compoenents
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component';
//validators
import { CustomValidator } from 'src/app/validators/custom.validator';
import { format, parseISO } from 'date-fns';


@Component({
  selector: 'app-log-time-manually',
  templateUrl: './log-time-manually.page.html',
  styleUrls: ['./log-time-manually.page.scss'],
})
export class LogTimeManuallyPage implements OnInit {

  public model: CandidateWorkingHour;

  public form: FormGroup;

  public saving: boolean = false; 

  public min= '1980-01-01'; //min date
  public max = (new Date()).toISOString();//max date 

  constructor(
    public popoverCtrl: PopoverController,
    private _alertCtrl: AlertController,
    private _fb: FormBuilder, 
    public cwhService: CandidateWorkingHourService,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.analyticsService.page('Log manually page');
 
    this.form = this._fb.group({
      start_time: [format(parseISO(this.model.start_time), 'hh:mm a'), Validators.required],
      end_time: [format(parseISO(this.model.end_time), 'hh:mm a'), Validators.required],
      note: ["", Validators.required],
     // reason:["", Validators.required],
      date: [this.model.date, Validators.required],
      dateFormatted: [
        format(parseISO(this.model.date), 'dd/MM/yyyy'), Validators.required],
    }, { validators: CustomValidator.timeComparisonValidator('start_time', 'end_time') });
  }

  async selectDate(event) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.form.value.dateFormatted,
        date: this.form.value.date,
        min: this.min,
        max: this.max
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.date) {
        this.form.controls.dateFormatted.setValue(e.data.dateFormatted);
        this.form.controls.dateFormatted.updateValueAndValidity();
        this.form.controls.date.setValue(e.data.date);
        this.form.controls.date.updateValueAndValidity();
        this.form.updateValueAndValidity();
      }
    });
    modal.present();
  }

  close(data = {}) {
    this.modalCtrl.dismiss(data);
  }

  async save() {
    this.saving = true; 

    this.updateModelFromForm();

    this.cwhService.add(this.model.appeal_uuid, this.model).subscribe(async res => {

      this.saving = false;
      
      if (res.operation == "success") {
        
        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

        this.form.reset();

        this.close({
          refresh: true
        })

      } else if (res.operation == "error") {

        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    });
  } 

  updateModelFromForm() {

    if(!this.model) 
      this.model = new CandidateWorkingHour;

    this.model.date = this.form.value.date;
    this.model.start_time = this.form.value.start_time;
    this.model.end_time = this.form.value.end_time;
    this.model.note = this.form.value.note;
  }

  async selectEndDate(event)  {
     
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: TimePickerComponent, 
      event: event,
      componentProps: { 
        time: this.form.value.end_time
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.time) {
        this.form.controls.end_time.setValue(e.data.time);
        this.form.controls.end_time.updateValueAndValidity();
        this.form.updateValueAndValidity();
      }
    });
    modal.present();
  }

  async selectStartDate(event) {
     
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: TimePickerComponent, 
      event: event,
      componentProps: { 
        time: this.form.value.start_time
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.time) {
        this.form.controls.start_time.setValue(e.data.time);
        this.form.controls.start_time.updateValueAndValidity();
        this.form.updateValueAndValidity();
      }
    });
    modal.present();
  }
}
