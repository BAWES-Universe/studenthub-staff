import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
    selector: 'app-request-option',
    template: `
    <ion-item *ngIf="['delivered', 'cancelled'].indexOf(request.request_status) == -1" lines="none" tappable (click)="dismiss('update')">
        <div tabindex="0"></div> Update
    </ion-item>
    
    <ion-item lines="none" tappable (click)="dismiss('cancel')"><div tabindex="0"></div>Cancel</ion-item>
  `,
})
export class RequestOptionPage implements OnInit {

    public request;

    constructor(
        public popoverCtrl: PopoverController,
    ) { }

    ngOnInit() {
    }

    /**
     * close popup
     */
    dismiss(click = null) {
        this.popoverCtrl.getTop().then(o => {
            if (o) {
                this.popoverCtrl.dismiss({ action: click });
            }
        });
    }
}
