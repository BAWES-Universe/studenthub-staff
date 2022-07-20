import {Component, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-story-close-component',
  template: `
    <ion-header>
      <ion-toolbar class="container">
        <ion-title>Stop work?</ion-title>
        <ion-buttons slot="end">
          <ion-button class="close_btn" (click)="dismiss()"><ion-icon name="close-circle-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>Are you sure you want to stop working on this story?</p>
      <ion-button class="cancel-stop-btn" (click)="dismiss()" fill="outline">No</ion-button><ion-button (click)="dismiss(true)" class="stop-work-btn">Stop Work</ion-button>
    </ion-content>
  `,
  styles: [`
    ion-header {
      height: 76px;
      padding-top: 12px;
    }

    ion-header::after { 
      bottom: 0;
      background-image: none;
      box-shadow: inset 0 -1px 0 0 #e2e2e6;
    }

    ion-content {
      --padding-start: 24px;
      --padding-end: 24px;
      --padding-top: 24px;
    }

    ion-button {
      text-transform: none;
      --box-shadow: none;
    }

    .cancel-stop-btn { width: 126px;height: 56px;--border-radius: 12px;--border-color: #4c70f2;margin-right: 16px;}
    .stop-work-btn { width: 166px;height: 56px;--border-radius: 12px;}
    .close_btn ion-icon{ --color: grey;}

    p {  
      margin-top: 0px;
      font-family: Inter;font-size: 16px;font-weight: 500;font-stretch: normal;font-style: normal;line-height: 1.5;letter-spacing: normal;text-align: left;color: #4b4b61;}
    ion-toolbar {    
      padding: 0;
    }

    ion-title { 
      padding: 0 33px;
      font-family: Inter;
      font-size: 20px !important;
      font-weight: bold;font-stretch: normal;font-style: normal;line-height: 1.4;letter-spacing: normal;text-align: left;color: #23233d; }
  `]
})
export class StoryCloseConfirmationComponent  implements OnInit {

  constructor(
    public popoverCtrl: ModalController,
  ) { }

  ngOnInit() {

  }
  /**
   * close popup
   */
  dismiss(click = false) {
    this.popoverCtrl.getTop().then(o => {
      if(o) {
        this.popoverCtrl.dismiss({click});
      }
    });
  }
}

//https://app.zeplin.io/project/5f0c218c589cf08e20c5405f/screen/62011c369b7b799f7af28377