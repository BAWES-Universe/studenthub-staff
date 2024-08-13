import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
//models
import { Candidate } from 'src/app/models/candidate';
import { CandidateWorkHistory } from 'src/app/models/candidate-work-history';
import { CandidateCertificate } from 'src/app/models/certificate';
import { Exam } from 'src/app/models/exam';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { CertificateService } from 'src/app/providers/logged-in/certificate.service';


@Component({
  selector: 'app-candidate-certificate-form',
  templateUrl: './candidate-certificate-form.page.html',
  styleUrls: ['./candidate-certificate-form.page.scss'],
})
export class CandidateCertificateFormPage implements OnInit {

  public certificate: CandidateCertificate = new CandidateCertificate;
  public candidate: Candidate;
  public workHistory: CandidateWorkHistory[];
  public exams: Exam[];

  public form: FormGroup;

  public todayDate;
  public maxDate;
  
  public borderLimit = false;
  public saving: boolean = false; 

  constructor(
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public certificateService: CertificateService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.setDates();
    this.loadExams();
    this.initForm();
  }

  loadExams() {
    //todo: load exams 
  }

  initForm() {
     
    this.form = this._fb.group({
      certificate_type: [this.certificate.certificate_type || "0", Validators.required],
      candidate_id: [this.candidate.candidate_id, Validators.required],
      start_date: [this.certificate?.start_date],
      end_date: [this.certificate?.end_date],
      candidate_work_history_id: [this.certificate?.candidate_work_history_id],
      exam_uuid: [this.certificate?.exam_uuid],
    });

    this.form.get('certificate_type').valueChanges.subscribe(val => {
      console.log("certificate_type", val)
      if (val == "0") {
        this.form.get('candidate_work_history_id').setValidators([Validators.required]);
        this.form.get('exam_uuid').setValue(null);
        this.form.get('exam_uuid').clearValidators();
        this.form.get('exam_uuid').updateValueAndValidity();
      } else {
        this.form.get('exam_uuid').setValidators([Validators.required]);
        this.form.get('candidate_work_history_id').setValue(null);
        this.form.get('candidate_work_history_id').clearValidators();
        this.form.get('candidate_work_history_id').updateValueAndValidity();
      }
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

  updateModelFromFormValues() {
    this.certificate.certificate_type = this.form.value.certificate_type;
    this.certificate.candidate_id = this.form.value.candidate_id;
    this.certificate.start_date = this.form.controls['start_date'].value? format(parseISO(this.form.controls['start_date'].value), 'yyyy-MM-dd HH:mm:ss'): null;//, { timeZone: '+3:30' }
    this.certificate.end_date = this.form.controls['end_date'].value? format(parseISO(this.form.controls['end_date'].value), 'yyyy-MM-dd HH:mm:ss'): null;//, { timeZone: '+3:30' } 
    this.certificate.candidate_work_history_id = this.form.value.candidate_work_history_id;
    this.certificate.exam_uuid = this.form.value.exam_uuid;
  }

  save() {
     
    this.updateModelFromFormValues();
      
    let action; 

    if (this.form.value.certificate_type == "0") {
      action = this.certificateService.fromWorkHistory(
        this.certificate.candidate_work_history_id, 
        this.certificate.start_date, 
        this.certificate.end_date
      )
    } else {
      action = this.certificateService.create(this.certificate);
    }

    this.saving = true;

    action.subscribe(async res => {

      this.saving = false;

      // On Success
      if (res.operation == 'success') {
        this.dismiss({ refresh: true })
      }

      // On Failure
      if (res.operation == 'error') {
        
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(res.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    });
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
