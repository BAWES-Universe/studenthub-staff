import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CandidateWorkingHourAppeal } from 'src/app/models/candidate-working-hour-appeal';
import { AuthService } from 'src/app/providers/auth.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { LogTimeManuallyPage } from '../log-time-manually/log-time-manually.page';
import { CandidateWorkingHour } from 'src/app/models/candidate';
import { ContactAttemptPage } from '../contact-attempt/contact-attempt.page';

@Component({
  selector: 'app-appeal-view',
  templateUrl: './appeal-view.page.html',
  styleUrls: ['./appeal-view.page.scss'],
})
export class AppealViewPage implements OnInit {

  public appeal_uuid;
  public appeal: CandidateWorkingHourAppeal;
  public loading: boolean; 
  public updatingStatus: boolean;
  
  public note; 
  public update;
  public sendingNote: boolean = false; 

  public borderLimit;

  constructor(
    public _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public candidateWorkingHourService: CandidateWorkingHourService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.appeal_uuid = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadData();
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  loadData() {
    
    this.loading = true;
 
    this.candidateWorkingHourService.appealDetail(this.appeal_uuid).subscribe(response => {
      this.loading = false;
      this.appeal = response;
    });
  }

  async addManulaLog() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    let model = this.appeal.originalHour;
    model.appeal_uuid = this.appeal_uuid;
    
    const modal = await this.modalCtrl.create({
      component: LogTimeManuallyPage, 
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal track-manual-modal",
      componentProps: { 
        model: model
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();
  }

  onStatusChange(event) {
    this.updatingStatus = true;

    this.candidateWorkingHourService.updateAppealStatus(this.appeal_uuid, event.target.value).subscribe(async response => {
      this.updatingStatus = false;

      if (response.operation == "success") {
        this.appeal.status = event.target.value;
      } else {
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    });
  }

  async addContactAttempt() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ContactAttemptPage, 
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal track-manual-modal",
      componentProps: { 
        appeal_uuid: this.appeal_uuid
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();
  }

  addNote() {
    this.sendingNote = true;

    const values = {
      detail: this.note,
      update: this.update
    };

    this.candidateWorkingHourService.appealUpdate(this.appeal_uuid, values).subscribe(async response => {
      this.sendingNote = false;

      if (response.operation == "success") {
        this.note = "";
        this.update = "";
        this.loadData();
      } else {
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    });
  }

  logScrolling(e) {
  }
}
