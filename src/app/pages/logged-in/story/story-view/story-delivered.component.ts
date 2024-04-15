import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-story-delivered-component',
    template: `
    <ion-content>

      <ion-img src="assets/images/story-delivered.svg"></ion-img>  
      
      <ion-button class="btn-close" (click)="dismiss()">
        <ion-icon name="close-outline"></ion-icon>
      </ion-button>

      <h3>Story has been delivered Successfully!</h3>
      
      <p class="txt-total-time" *ngIf="storyActivity">
        Total time: {{ storyActivity.activity_time_spent | timeSpent }}
      </p>

      <ion-progress-bar [value]="progress"></ion-progress-bar>

      <ng-container *ngIf="total != totalDelivered">
        <span class="txt-status txt-status-left">{{ totalDelivered }} done</span>
        
        <span class="txt-status txt-status-right">
            {{ total - totalDelivered }} left
        </span>
      </ng-container>
      
      <span class="txt-status txt-center" *ngIf="total == totalDelivered">
        All request stories are delivered 
      </span>

      <div class="clearfix"></div>
 
      <ion-button *ngIf="total == totalDelivered" class="btn-request" (click)="dismiss('request')">Go to Main Request </ion-button>

      <ng-container *ngIf="total != totalDelivered">
        
        <ion-button class="btn-back" (click)="dismiss('back')" fill="outline">Go Back</ion-button>
      
        <ion-button class="btn-next" (click)="dismiss('next')">Next Story</ion-button>
      </ng-container>

    </ion-content>
  `,
    styles: [`
    
    ion-content {
      --padding-start: 24px;
      --padding-end: 24px;
      --padding-top: 24px;
    }

    ion-button {
      text-transform: none;
      --box-shadow: none;
    }

    ion-img {
        width: 164px;
        height: 136px;
        margin: auto;
    }

    h3 {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 28px;
        text-align: center;
        color: var(--ion-color-custom-6);
        margin-bottom: 8px;
    }

    .txt-total-time {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        color: var(--ion-color-custom-17);
        margin: 0 0 22px 0;
    }

    .txt-status {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: var(--ion-color-custom-6);
    }

    .txt-center {
        text-align: center;
        width: 100%;
        display: inline-block;
    }

    .txt-status-left {
        float: left;
    }

    .txt-status-right {
        font-weight: 400;
        font-size: 14px;
        float: right;
        color: var(--ion-color-custom-5);
    }

    .btn-close {
        --background: var(--ion-color-custom-8);
        --border-radius: 100%;
        position: absolute;
        right: 24px;
        top: 24px;
        --color: var(--ion-color-custom-7);
        width: 40px;
        height: 40px;
        font-size: -1px;
        --padding-start: 0;
        --padding-end: 0;
        margin: 0;
    }

    ion-progress-bar {
        --progress-background: var(--ion-color-custom-24);
        --background: var(--ion-color-custom-22);
        border-radius: 2px;
        margin-bottom: 8px;
    }

    .btn-request,
    .btn-next,
    .btn-back {
        border-radius: 12px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        --box-shadow: none;
        --text-transform: none;
        margin: 24px 0 0 0;
        height: 56px;
        --border-radius: 12px;
    }

    .btn-request,
    .btn-next {
        --background: var(--ion-color-custom-14);
        --border-radius: 12px;
    }

    .btn-next {
        width: 200px;
    }

    .btn-back {
        //--background: var(--ion-card-background);
        --border-width: 2px;
        --border-style: solid;
        --border-color: var(--ion-color-custom-14);
        --color: var(--ion-color-custom-14);
        width: 126px;
        margin-right: 16px;
    }

    .btn-request {
        width: 100%;
    }
  `]
})
export class StoryDeliveredComponent implements OnInit {

    public totalDelivered;
    public total;
    public storyActivity;
    public progress;

    constructor(
        public popoverCtrl: ModalController,
    ) { }

    ngOnInit() {
        this.progress = this.totalDelivered / this.total
    }

    /**
     * close popup
     */
    dismiss(action = null) {
        this.popoverCtrl.getTop().then(o => {
            if (o) {
                this.popoverCtrl.dismiss({
                    action: action
                });
            }
        });
    }
}
