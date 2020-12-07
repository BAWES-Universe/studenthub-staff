import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
//models
import { Suggestion } from 'src/app/models/suggestion';
//services
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';


@Component({
  selector: 'suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit {

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  @Input() model: Suggestion;

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    public suggestionService: SuggestionService
  ) { }

  ngOnInit() {
    console.log(this.model);
  }

  openCandidatePage() {
    if(this.model.candidate) {
      this.router.navigate(['/candidate-view', this.model.candidate_id]);
    } else {
      this.router.navigate(['/fulltimer', this.model.fulltimer.fulltimer_uuid]);
    }
  }

  /**
   * accept suggestion
   * @param event
   */
  acceptSuggestion(event) {

    event.preventDefault();
    event.stopPropagation();

    this.alertCtrl.create({
      header: 'Reason for acceptance',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: 'Enter reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {

            if (!data.reason) {
              this.alertCtrl.create({
                message: 'Please provide reason',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }

            this.suggestionService.accept(this.model.suggestion_uuid, data.reason).subscribe(async response => {

              if (response.operation == 'success') {
                this.model.suggestion_status = 3;

                this.onUpdate.emit();
              } else {
                this.toastCtrl.create({
                  message: response.message,
                  buttons: ['Okay']
                }).then(prompt => {
                  prompt.present();
                });
              }
            });

          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * reject suggestion
   * @param event
   */
  rejectSuggestion(event) {

    event.preventDefault();
    event.stopPropagation();

    this.alertCtrl.create({
      header: 'Reason for rejection',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: 'Enter reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {

            if (!data.reason) {
              this.alertCtrl.create({
                message: 'Please provide reason',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }

            this.suggestionService.reject(this.model.suggestion_uuid, data.reason).subscribe(async response => {

              if (response.operation == 'success') {
                this.model.suggestion_status = 2;

                this.onUpdate.emit();

              } else {
                this.toastCtrl.create({
                  message: response.message,
                  buttons: ['Okay']
                }).then(prompt => {
                  prompt.present();
                });
              }
            });

          }
        }
      ]
    }).then(alert => { alert.present(); });
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
}
