import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
//models
import { Invitation } from 'src/app/models/invitation';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  @Input() model: Invitation;

  public loading: boolean = false;

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    public aws: AwsService,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public suggestionService: SuggestionService,
    public invitationService: InvitationService
  ) { }

  ngOnInit() {
  }

  doNothing(event) {
    //event.preventDefault();
    event.stopPropagation();
  }

  openCandidatePage(event) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/candidate-view', this.model.candidate_id]);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) 
      return null;
      
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * move to suggestion
   */
  async suggest(ev) {

    if (this.model.is_suggested) {
      return false;
    }
    const confirm = await this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {
            this.loading = true;

            const param = {
              suggestion: data.feedback,
              request_uuid: this.model.request_uuid,
              fulltimer_uuid: null,
              candidate_id: this.model.candidate_id
            };

            this.suggestionService.create(param).subscribe(async response => {

              this.loading = false;

              // On Success
              if (response.operation == 'success') {

                this.model.is_suggested = true;

                this.onUpdate.emit();

                const prompt = await this.alertCtrl.create({
                  message: 'Suggested successfully',
                  buttons: ['Okay']
                });
                prompt.present();
              }

              // On Failure
              if (response.operation == 'error') {
                const prompt = await this.alertCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Okay']
                });
                prompt.present();
              }
            }, () => {
              this.loading = false;
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
