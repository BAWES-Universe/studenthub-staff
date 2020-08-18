import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, ToastController, NavController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {

  @Input() candidate: Candidate;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  public deleting: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public candidateService: CandidateService,
    public candidateIdCardService: CandidateIdCardService,
    public aws: AwsService
  ) { }

  ngOnInit() {}

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
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
    return candidate.candidate_personal_photo = null;
  }

  /**
   * on candidate checkbox change
   * @param event
   */
  onCandidateSelected(event) {
    event.preventDefault();
    event.stopPropagation();

    const candidate_id = parseInt(event.target.value);

    if(event.detail.checked) {//on check
      this.candidateIdCardService.candidates.push(candidate_id);
    } else {//on uncheck
      this.candidateIdCardService.candidates = this.candidateIdCardService.candidates.filter((c) => c != candidate_id);
    }
  }
}
