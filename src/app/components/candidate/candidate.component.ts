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

  @Input() candidate: Candidate;
  @Input() type: any = null;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  public deleting: boolean = false;
  public latestWorkStartedOn = null;
  @ViewChild('checkbox') checkbox: IonCheckbox;

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
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }

  /**
   * Delete the provided model
   */
  async delete(candidate: Candidate) {

    const confirm = await this.alertCtrl.create({
      header: 'Delete Candidate?',
      message: 'Are you sure you want to delete this Candidate?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {

            this.deleting = true;

            this.candidateService.delete(candidate).subscribe(async jsonResp => {

              this.deleting = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: jsonResp.message,
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();

                this.refresh.emit();
              }
            },() => {
              this.deleting = false;
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
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
  onCandidateSelected(event) {

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
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
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
