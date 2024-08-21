import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, Platform, PopoverController } from '@ionic/angular';
//models
import { Note } from 'src/app/models/note';
import { CompanyNoteFormPage } from 'src/app/pages/logged-in/company/company-note-form/company-note-form.page';
//services
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { ActionComponent } from '../action/action.component';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {

  @Input() note: Note;
  @Input() from;

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  public deletingNote: boolean = false;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public noteService: NoteService
  ) { }

  ngOnInit() {

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

  doNothing(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * show action popover
   * @param event 
   */
  async showActions(event) {
    
    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const actions = [
      {
        name: "Edit Note",
        icon: 'assets/icon/icon-edit-2.svg',
        trigger: 'edit'
      },
      {
        name: "Delete Note",
        icon: 'assets/icon/icon-trash-2.svg',
        trigger:  'delete'
      }
    ];

    const modal = await this.popoverCtrl.create({
      component: ActionComponent,
      componentProps: {
        actions: actions
      },
      cssClass: 'store-option',
      event,
      translucent: true,
      showBackdrop: false
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.action) {
      if(data.action.trigger == 'edit') {
        this.edit(event);
      } else if(data.action.trigger == 'delete') {
        this.delete(event);
      } 
    }
  }

  /**
   * open popup to update modal
   */
  async edit(event) {

    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note: this.note,
        from: this.from,
      },
      cssClass: "popup-modal"
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
      this.onChange.emit({
        request_updated_datetime: data.request_updated_datetime
      });
    }
  }

  /**
  * removing note
  * @param event
  */
  async delete(event) {

    event.preventDefault();
    event.stopPropagation();

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

                this.onDelete.emit();

              } else {

                this.deletingNote = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: this.authService.errorMessage(response.message),
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
}
