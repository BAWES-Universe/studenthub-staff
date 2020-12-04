import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { CompanyContactFormPage } from '../../company-contact-form/company-contact-form.page';


@Component({
  selector: 'app-company-contact-view',
  templateUrl: './company-contact-view.page.html',
  styleUrls: ['./company-contact-view.page.scss'],
})
export class CompanyContactViewPage implements OnInit {

  public contact_uuid: string;

  public loading: boolean = false;

  public deleting: boolean = false;

  public companyContact: CompanyContact;

  public borderLimit;

  constructor(
    public location: Location,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public companyContactService: CompanyContactService
  ) { }

  ngOnInit() {
    this.contact_uuid = this.route.snapshot.params.contact_uuid;

    const model = window.history.state.model;

    if(model) {
      this.companyContact = model;
    }

    if(!this.companyContact) {
      this.loadDetail();
    }
  }

  /**
   * load request detail
   */
  loadDetail() {
    this.loading = true;

    this.companyContactService.view(this.contact_uuid).subscribe(data => {
      this.companyContact = data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  async edit() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: {
        model: this.companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadDetail();
      }
    });
    modal.present();
  }

  async delete() {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Contact',
      message: 'Do you want to delete this contact?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.companyContactService.delete(this.companyContact).subscribe(async response => {

              this.deleting = false;

              if (response.operation == 'success') {
                this.location.back();
              }
              else {
                const prompt = await this.alertCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deleting = false;
            });
          },
        },
        {
          text: 'No',
        }
      ]
    });
    confirm.present();
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0) ?  true : false;
  }
}
