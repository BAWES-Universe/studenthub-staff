import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// services
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { AwsService } from 'src/app/providers/aws.service';
import { NoteService } from '../../../../providers/logged-in/note.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { AuthService } from 'src/app/providers/auth.service';
// models
import { Fulltimer } from 'src/app/models/fulltimer';
import { Note } from 'src/app/models/note';
import { Story } from 'src/app/models/request';
import { SuggestPage } from "../../suggest/suggest.page";
// pages
import { FulltimerFormPage } from '../fulltimer-form/fulltimer-form.page';
import { CompanyNoteFormPage } from '../../company/company-note-form/company-note-form.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-fulltimer-view',
  templateUrl: './fulltimer-view.page.html',
  styleUrls: ['./fulltimer-view.page.scss'],
})
export class FulltimerViewPage implements OnInit {

  public borderLimit = false;

  public fulltimer_uuid: string;

  public fulltimer: Fulltimer;

  public loading = false;
  public suggesting = false;

  public notes: Note[] = [];

  public story: Story;

  constructor(
    public aws: AwsService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private fulltimerService: FulltimerService,
    public suggestionService: SuggestionService,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    public noteService: NoteService,
    public eventService: EventService,
    public analyticService: AnalyticsService,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.analyticService.page('Fulltimer View Page');

    this.fulltimer_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.story) {
      this.story = state.story;
    } else if (this.authService.story) {
      this.story = this.authService.story;
    }

    this.loadData();
    this.loadNotes(false);

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data.fulltimer_uuid == this.fulltimer_uuid) {
        this.loadNotes();
      }
    });
  }

  loadData() {
    this.loading = true;
    this.fulltimerService.view(this.fulltimer_uuid).subscribe(res => {
      this.loading = false;
      this.fulltimer = res;
    });
  }

  /**
   * open popup to update modal
   */
  async addNote() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let note = new Note;
    note.fulltimer_uuid = this.fulltimer_uuid;

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note,
        fulltimer: this.fulltimer
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadNotes();
    }
  }

  openNotes() {
    this.router.navigate(['fulltimer-notes', this.fulltimer_uuid], {
      state: {
        fulltimer: this.fulltimer
      }
    });
  }

  /**
   * return area name
   * @param area
   * @param country
   */
  area(area, country) {
    return this.translateService.langContent(area.area_name_en, area.area_name_ar) + ' ' +
      this.translateService.langContent(country.country_name_en, country.country_name_ar);
  }

  /**
   * get candidate resume url
   */
  getResumeUrl() {
    return this.aws.permanentBucketUrl + 'fulltimer-resume/' + encodeURIComponent(this.fulltimer.fulltimer_pdf_cv);
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        model: this.fulltimer,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });

    return await modal.present();
  }

  /**
   * On candidate selected from list
   */
  rowSelected(store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * load notes
   * @param loading
   */
  loadNotes(loading = true) {
    const params = '&fulltimer_uuid=' + this.fulltimer_uuid;

    this.noteService.list(params).subscribe(async jsonResponse => {
      this.notes = jsonResponse;
    });
  }

  /**
   * suggess this candidate
   */
  async suggest() {

    if(this.story) {
      return this.addSuggestion();
    }

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: SuggestPage,
      componentProps: {
        fulltimer: this.fulltimer
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadNotes();
      }
    });
    return await modal.present();
  }

  /**
   * add suggestion with given story
   */
  async addSuggestion() {

    const confirm = await this.alertCtrl.create({
      header: 'Reason for suggestion',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {

            this.suggesting = true;

            const params = {
              request_uuid: this.story.request_uuid,
              story_uuid: this.story.story_uuid,
              fulltimer_uuid: this.fulltimer_uuid,
              suggestion: data.feedback
            };

            this.suggestionService.create(params).subscribe(async response => {

              this.suggesting = false;

              // On Success
              if (response.operation == 'success') {
                this.toastCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  duration: 2000,
                  position: 'top',
                  buttons: ['Okay']
                }).then(prompt => {
                  prompt.present();
                });
                //this.candidate.invited = response.suggestionCount;
                this.loadNotes();
              }

              // On Failure
              if (response.operation == 'error') {
                const prompt = await this.alertCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Okay']
                });
                prompt.present();
              }
            }, () => {
              this.suggesting = false;
            });
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * suggestion list page
   * @param status
   */
  suggestionListPage(status: number) {
    if (status == 1 && this.fulltimer.suggested == "0") { // Suggested
      return false;
    }
    if (status == 2 && this.fulltimer.suggestionRejected == "0") { // Rejected
      return false;
    }
    if (status == 3 && this.fulltimer.suggestionAccepted == "0") { // Accepted
      return false;
    }

    this.router.navigate(['fulltimer-suggestions', this.fulltimer_uuid, status], {
      state: {
        fulltimer: this.fulltimer
      }
    });
  }
}
