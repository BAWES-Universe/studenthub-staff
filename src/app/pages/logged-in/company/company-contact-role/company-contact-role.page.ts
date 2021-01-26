import { Component, OnInit } from '@angular/core';
import { IonNav, ModalController } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { CompanyContactFormPage } from '../company-contact-form/company-contact-form.page';

@Component({
  selector: 'app-company-contact-role',
  templateUrl: './company-contact-role.page.html',
  styleUrls: ['./company-contact-role.page.scss'],
})
export class CompanyContactRolePage implements OnInit {

  public companyContact: CompanyContact;

  public borderLimit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public nav: IonNav
    //public router: Router
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onRoleSelected(role) {
    this.companyContact.role = role;

    this.nav.push(CompanyContactFormPage, {
      companyContact: this.companyContact
    });

    /*this.router.navigate(['company-contact-form'], {
      state: {
        companyContact: this.companyContact
      }
    });*/
  }
}

