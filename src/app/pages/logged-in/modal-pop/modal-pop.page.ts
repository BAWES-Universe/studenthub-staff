import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonNav } from '@ionic/angular';


@Component({
  selector: 'app-modal-pop',
  templateUrl: './modal-pop.page.html',
  styleUrls: ['./modal-pop.page.scss'],
})
export class ModalPopPage implements OnInit {

  @ViewChild(IonNav, { static: true }) nav;

  @Input() activatedRoutePath;
  @Input() activatedRoutePathProps;

  constructor(
  ) { }

  ngOnInit() {
    this.nav.setRoot(this.activatedRoutePath, this.activatedRoutePathProps);
  }
}
