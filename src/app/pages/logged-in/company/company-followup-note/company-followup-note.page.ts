import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';


@Component({
  selector: 'app-company-followup-note',
  templateUrl: './company-followup-note.page.html',
  styleUrls: ['./company-followup-note.page.scss'],
})
export class CompanyFollowupNotePage implements OnInit {

  public company_id;

  public saving: boolean = false; 

  public note: string = '';

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
  }

  save() {
    this.saving = true; 

    this.companyService.addFollowupNote(this.note, this.company_id).subscribe(async jsonResponse => {

      this.saving = false; 

      // On Success
      if (jsonResponse.operation == "success") {
        // Close the page
        let data = { 'company_last_followup_datetime': jsonResponse.company_last_followup_datetime };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == "error") {
        let prompt = await this.alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    }, () => {

      this.saving = false; 
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
