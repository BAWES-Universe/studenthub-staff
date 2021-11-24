import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AlertController, ToastController, NavController, Platform, IonCheckbox } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {

  @ViewChild('checkbox') checkbox: IonCheckbox;

  @Input() candidate: Candidate;
  @Input() type: any = null;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  public deleting: boolean = false;
  public latestWorkStartedOn = null;

  constructor(
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public candidateService: CandidateService,
    public eventService: EventService,
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
}
