import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AlertController, ToastController, NavController, Platform, IonCheckbox, ModalController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
import { RequestApplication } from 'src/app/models/request-application';
import { RequestInterview } from 'src/app/models/request-interview';
import { RequestInterviewFormPage } from 'src/app/pages/logged-in/company/request-interview-form/request-interview-form.page';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {

  @ViewChild('checkbox') checkbox: IonCheckbox;

  @Input() candidate: Candidate;
  @Input() application: RequestApplication;
  @Input() requestInterview: RequestInterview;

  @Input() type: any = null;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  public deleting: boolean = false;
  public latestWorkStartedOn = null;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public candidateService: CandidateService,
    public eventService: EventService,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public requestService: CompanyRequestService,
    public candidateIdCardService: CandidateIdCardService,
    public aws: AwsService
  ) {
    // this.candidate.candidate_personal_photo = null;
  }

  ngOnInit() {
    this.eventService.clearCandidateSelection$.subscribe(() => {
      if(this.checkbox) {
        this.checkbox.checked = false;
      }
    });

    this.getLatestWorkTime();

    if(this.requestInterview && !this.application) {
      this.application = new RequestApplication; 
      this.application.requestInterview = this.requestInterview;
    }
  }

  /**
   * @param candidate
   */
  loadLogo(candidate) {
    this.candidate.candidate_personal_photo = null;
  }

  /**
   * on candidate checkbox change
   * @param event
   */
  async onCandidateSelected(event) {

    event.preventDefault();
    event.stopPropagation();

    if(!this.candidateService.candidates) {
      this.candidateService.candidates = [];
    }

    if(!this.candidateIdCardService.candidates) {
      this.candidateIdCardService.candidates = [];
    }

    const candidate_id = parseInt(event.target.value);

    // for candidate operations

    if (event.detail.checked) { // on check
      this.candidateService.candidates.push(this.candidate);
    } else { // on uncheck
      this.candidateService.candidates = this.candidateService.candidates.filter((c) => c.candidate_id != candidate_id);
    }

    // for candidate id operations

    if (!this.candidate.store) {

      /*
      if(!event.detail.checked) {
        return false;
      }

      //in case no store assigned and checked

      const canndidate = this.candidate.candidate_name? this.candidate.candidate_name: this.candidate.candidate_name_ar;

      const prompt = await this.alertCtrl.create({
        message: canndidate + " not assigned to store, assign candidate to download ID",
        buttons: ['Okay']
      });
      prompt.present();*/

      return false;
    }

    if (event.detail.checked) { // on check
      this.candidateIdCardService.candidates.push(candidate_id);
    } else { // on uncheck
      this.candidateIdCardService.candidates = this.candidateIdCardService.candidates.filter((c) => c != candidate_id);
    }
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) 
      return null;
    
    return new Date(date.replace(/-/g, '/'));
  }

  getLatestWorkTime() {
    if (this.candidate.workHistory && this.candidate.workHistory.length > 0) {
      this.candidate.workHistory.map(history => {
          if (history.start_date && !history.end_date) {
            this.latestWorkStartedOn = history.start_date;
          }
      });
    }
  }

  async acceptInterview(event, interviewRequest) {
    event.preventDefault();
    event.stopPropagation(); 
    
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: RequestInterviewFormPage,
      componentProps: {
        interviewRequest: interviewRequest
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data) {
        interviewRequest = Object.assign(interviewRequest, e.data);
      }
    });
    modal.present();
  }

  rejectInterview(event, interviewRequest) {
    event.preventDefault();
    event.stopPropagation(); 

    this.requestService.rejectInterviewRequest(interviewRequest.request_interview_uuid).subscribe(async res => {

      if(res.operation == "success") {
        interviewRequest.status = 2;
      }

      const prompt = await this.alertCtrl.create({
        message: this.authService.errorMessage(res.message),
        buttons: ['Okay']
      });
      prompt.present();
    });
  }
}
