import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';


@Component({
  selector: 'app-candidate-assign-form',
  templateUrl: './candidate-assign-form.page.html',
  styleUrls: ['./candidate-assign-form.page.scss'],
})
export class CandidateAssignFormPage implements OnInit {
  
  public form: FormGroup;

  public todayDate;
  public maxDate;
  
  public borderLimit = false;

  constructor(
    private _fb: FormBuilder,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.setDates();
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      rate: ['', Validators.required],
      company_hourly_rate: [''],
      start_date: [this.todayDate, Validators.required],
    });
  }

  /**
   * Sets the default dates for min/max validation
   */
  setDates() {
    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.todayDate = new Date().toISOString();
    this.maxDate = new Date((yyyy + 1), mm).toISOString();
  }

  save() {
    let params = this.form.value;
    params.start_date = format(parseISO(this.form.controls['start_date'].value), 'yyyy-MM-dd HH:mm:ss');//, { timeZone: '+3:30' }
    this.modalCtrl.dismiss(params);
  }

  close() {
    this.modalCtrl.dismiss();
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
