import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
import { Note } from 'src/app/models/note';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { InterviewEvaluationFormPage } from '../interview-evaluation-form/interview-evaluation-form.page';


@Component({
  selector: 'app-interview-evaluation-view',
  templateUrl: './interview-evaluation-view.page.html',
  styleUrls: ['./interview-evaluation-view.page.scss'],
})
export class InterviewEvaluationViewPage implements OnInit {

  public interview_evaluation_uuid: string;

  public model: InterviewEvaluation;

  public loadingNotes: boolean = false;
  
  public pageCount;
  public currentPage;
  public total;

  public borderLimit = false;
  
  public note_text: string = ""; 
  public savingNote: boolean = false; 
  public loading: boolean = false; 

  constructor(
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public interviewEvaluationService: InterviewEvaluationService,
    public noteService: NoteService
  ) { }

  ngOnInit() {
    this.interview_evaluation_uuid = this.activatedRoute.snapshot.paramMap.get("interview_evaluation_uuid");
    this.loadData();
  }

  loadData() {
    this.loading = true; 

    this.interviewEvaluationService.view(this.interview_evaluation_uuid).subscribe(res => {
      this.loading = false; 

      this.model = res;

      this.loadNotes();
    });
  }

  loadNotes() {
    this.loadingNotes = true;
 
    this.interviewEvaluationService.listVersions(this.interview_evaluation_uuid, this.currentPage).subscribe(res => {

      this.loadingNotes = false;

      this.model.interviewEvaluationNoteVersions = res.body;

      this.pageCount = parseInt(res.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(res.headers.get('X-Pagination-Total-Count'));
    });
  }

  /**
   * @param event 
   */
  doInfiniteInterviews(event) {

    this.loadingNotes = true;

    this.currentPage++;

    this.interviewEvaluationService.listVersions(this.interview_evaluation_uuid, this.currentPage).subscribe(res => {
      
      this.loadingNotes = false; 

      event.target.complete();

      this.model.interviewEvaluationNoteVersions = this.model.interviewEvaluationNoteVersions.concat(res.body);
      this.pageCount = parseInt(res.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(res.headers.get('X-Pagination-Total-Count'));
    }, () => {
      this.loadingNotes = false; 

      event.target.complete();
    });
  }

  async addVersion() {
    
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    let interviewEvaluationNotes = [];

    if (this.model.interviewEvaluationNoteVersions.length > 0) {
      this.model.interviewEvaluationNoteVersions[0].interviewEvaluationNotes.forEach(val => {
        interviewEvaluationNotes.push(val);
      });
    }

    const modal = await this.modalCtrl.create({
      component: InterviewEvaluationFormPage,
      componentProps: {
        interviewEvaluationNotes: interviewEvaluationNotes,
        model: this.model,
        candidate_id: this.model.candidate_id
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  addNote() {
    if (this.note_text.length == 0) {
      return null; 
    }
    
    let note = new Note;
    note.note_text = this.note_text;

    this.savingNote = true; 

    this.interviewEvaluationService.addNote(this.interview_evaluation_uuid, note).subscribe(async res => {
      
      this.savingNote = false; 

      if (res.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService._processResponseMessage(res),
          buttons: ['Okay']
        });
        prompt.present();
      } else {
        
        if (!this.model.notes) 
          this.model.notes = [];

        this.model.notes = [res.note].concat(this.model.notes);

        this.note_text = "";
      }
    });
  }
}
