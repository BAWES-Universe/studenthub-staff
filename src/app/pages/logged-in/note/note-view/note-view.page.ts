import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
// models
import { Note } from 'src/app/models/note';
import { EventService } from 'src/app/providers/event.service';
// services
import { NoteService } from 'src/app/providers/logged-in/note.service';
// pages
import { CompanyNoteFormPage } from '../../company/company-note-form/company-note-form.page';


@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.page.html',
  styleUrls: ['./note-view.page.scss'],
})
export class NoteViewPage implements OnInit {

  public note_uuid: string;

  public note: Note;

  public loading: boolean = false;

  public deletingNote: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public route: ActivatedRoute,
    public location: Location,
    public eventService: EventService,
    public noteService: NoteService
  ) { }

  ngOnInit() {
    if(!this.note_uuid)
      this.note_uuid = this.route.snapshot.params.note_uuid;

    if(!this.note)
      this.loadData();
  }

  /**
   * load suggestion detail
   */
  loadData() {
    this.loading = true;

    const params = { note_uuid: this.note_uuid };

    this.noteService.view(params).subscribe(data => {
      this.note = data;

      this.loading = false;
    });
  }

  /**
   * open popup to update modal
   */
  async edit() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note: this.note,
        // from: this.from,
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

      this.eventService.noteUpdated$.next(this.note);

      this.eventService.companyRequestUpdate$.next({
        company_id: this.note.company_id,
        request_uuid: this.note.request_uuid,
        request_updated_datetime: data.request_updated_datetime
      });
    }
  }

  /**
  * removing note
  */
  async delete() {

    const confirm = await this.alertCtrl.create({
      header: 'Delete Note',
      message: 'Do you want to delete this note?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deletingNote = true;

            this.noteService.delete(this.note).subscribe(async response => {

              this.deletingNote = false;

              if (response.operation == 'success') {

                /*this.eventService.companyRequestUpdate$.next({
                  request_uuid: this.note.request_uuid,
                  request_updated_datetime: response.request_updated_datetime
                });*/

                this.eventService.noteUpdated$.next(this.note);

                this.location.back();

              } else {

                this.deletingNote = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: response.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deletingNote = false;
            });
          }
        },
        {
          text: 'No'
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
    if (!date) 
      return null;
      
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }
}
