import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-option',
  template: `
    <ion-item lines="none" tappable (click)="dismiss(true)"><div tabindex="0"></div>View original request</ion-item>
  `,
})
export class StoryViewOptionPage implements OnInit {

  constructor(
    public popoverCtrl: PopoverController,
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
