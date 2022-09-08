import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {AuthService} from "../../../../providers/auth.service";


@Component({
    selector: 'app-request-option',
    template: `
    <ion-item *ngIf="['delivered', 'cancelled'].indexOf(request.request_status) == -1" lines="none" tappable (click)="dismiss('update')">
        <div tabindex="0"></div> Update
    </ion-item>

    <ion-item lines="none" tappable (click)="dismiss('cancel')"><div tabindex="0"></div>Cancel</ion-item>
    <ion-item *ngIf="request.request_status == 'delivered'" lines="none" tappable (click)="dismiss('rework')"><div tabindex="0"></div>Set as Rework</ion-item>
    <ion-item lines="none" tappable (click)="dismiss('create_story')"><div tabindex="0"></div>Create Story</ion-item>
  `,
})
export class RequestOptionPage implements OnInit {

    public request;

    constructor(
        public popoverCtrl: PopoverController,
        public authService: AuthService,
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
