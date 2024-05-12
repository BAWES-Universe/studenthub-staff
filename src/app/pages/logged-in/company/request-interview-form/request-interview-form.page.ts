import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { RequestInterview } from 'src/app/models/request-interview';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { StaffService } from 'src/app/providers/logged-in/staff.service';


@Component({
  selector: 'app-request-interview-form',
  templateUrl: './request-interview-form.page.html',
  styleUrls: ['./request-interview-form.page.scss'],
})
export class RequestInterviewFormPage implements OnInit {

  public interviewRequest: RequestInterview;
  
  public form: FormGroup;

  public loading: boolean = false; 
  
  public borderLimit = false;

  stafflistData = [];

  constructor(
    private _fb: FormBuilder,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public staffService: StaffService,
    public requestService: CompanyRequestService) { }

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    const urlParams = '&role=6';
    this.staffService.list(-1, urlParams).subscribe(data => {
      this.stafflistData = data.body;
      this.initForm();
    });
  }

  initForm() {
    this.form = this._fb.group({
      internal_note: [this.interviewRequest.internal_note],
      staff_id: [this.interviewRequest.staff_id, Validators.required],
      interview_note: [this.interviewRequest.interview_note]
    });
  }

  submit() {
     
    this.requestService.acceptInterviewRequest(this.interviewRequest.request_interview_uuid, this.form.value).subscribe(async res => {

      if(res.operation == "success") {
        this.interviewRequest.status = 1;
        this.dismiss(this.interviewRequest);
      }
      
      const prompt = await this.alertCtrl.create({
        message: this.authService.errorMessage(res.message),
        buttons: ['Okay']
      });
      prompt.present();
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
