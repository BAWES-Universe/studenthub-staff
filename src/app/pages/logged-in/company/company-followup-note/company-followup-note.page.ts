import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
//models
import { Note } from 'src/app/models/note';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import {AuthService} from "../../../../providers/auth.service";


@Component({
  selector: 'app-company-followup-note',
  templateUrl: './company-followup-note.page.html',
  styleUrls: ['./company-followup-note.page.scss'],
})
export class CompanyFollowupNotePage implements OnInit {

  public company_id;

  public saving: boolean = false;

  public form: FormGroup;

  public model: Note = new Note();

  public borderLimit: boolean = false;

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public companyService: CompanyService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Company Followup Note Page');

    this.form = this.fb.group({
      note: ['', Validators.required],
      type: ['Internal Note', Validators.required],
    });
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.note_text = this.form.value.note;
    this.model.note_type = this.form.value.type;
    this.model.company_id = this.company_id;
  }

  /**
   * add follow up note for company
   */
  save() {

    this.updateModelDataFromForm();

    this.saving = true;

    this.companyService.addFollowupNote(this.model).subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == "success") {
        // Close the page
        let data = { 
          'company_last_followup_datetime': jsonResponse.company_last_followup_datetime, 
          'company_next_followup_datetime': jsonResponse.company_next_followup_datetime 
        };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == "error") {
        let prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    }, () => {

      this.saving = false;
    });
  }

  /**
   * dismiss popup
   */
  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss();
      }
    })
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

}
