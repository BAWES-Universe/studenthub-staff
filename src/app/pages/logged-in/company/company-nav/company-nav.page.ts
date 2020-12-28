import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonNav } from '@ionic/angular';


@Component({
  selector: 'app-company-nav',
  templateUrl: './company-nav.page.html',
  styleUrls: ['./company-nav.page.scss'],
})
export class CompanyNavPage implements OnInit {

  @ViewChild(IonNav, { static: true }) nav; 

  @Input() activatedRoutePath;
  @Input() activatedRoutePathProps;

  constructor() { }

  ngOnInit() {
    this.nav.setRoot(this.activatedRoutePath, this.activatedRoutePathProps); 
  }
}
