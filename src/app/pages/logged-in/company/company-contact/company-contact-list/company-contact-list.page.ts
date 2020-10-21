import { Component, OnInit } from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.page.html',
  styleUrls: ['./company-contact-list.page.scss'],
})
export class CompanyContactListPage implements OnInit {

  public contacts;
  public contactList = [];
  constructor(
    public popupCtrl: PopoverController
  ) {
  }

  ngOnInit() {
    this.contactList = this.contacts;
  }
  doNothing(event) {
    event.stopPropagation();
  }

  onContactSelected(companyContact){
    this.popupCtrl.dismiss({companyContact});
  }

  filter(ev){
    if (ev.target.value) {
      this.contactList = this.contacts.filter(item => {
        return (
          item.contact_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
          item.contact_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1
        );
      });
    } else {
      this.contactList = this.contacts;
    }
  }
}
