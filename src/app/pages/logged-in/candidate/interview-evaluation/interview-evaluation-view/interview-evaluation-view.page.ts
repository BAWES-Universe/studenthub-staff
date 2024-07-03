import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
//models
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
import { Note } from 'src/app/models/note';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';


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
    public alertCtrl: AlertController,
    public authService: AuthService,
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

      if(!this.model.notes) {
        this.loadNotes();
      }
    });
  }

  loadNotes() {
    this.loadingNotes = true;

    const urlParams = "&interview_evaluation_uuid=" + this.interview_evaluation_uuid;
    
    this.noteService.list(urlParams, this.currentPage).subscribe(res => {

      this.loadingNotes = false;

      this.model.notes = res.body;

      this.pageCount = parseInt(res.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(res.headers.get('X-Pagination-Total-Count'));
    });
  }

  doInfiniteInterviews(event) {

    this.loadingNotes = true;

    this.currentPage++;

    const urlParams = "&interview_evaluation_uuid=" + this.interview_evaluation_uuid;
    
    this.noteService.list(urlParams, this.currentPage).subscribe(res => {
      this.loadingNotes = false; 

      event.target.complete();

      this.model.notes = this.model.notes.concat(res.body);
      this.pageCount = parseInt(res.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(res.headers.get('X-Pagination-Total-Count'));
    }, () => {
      this.loadingNotes = false; 

      event.target.complete();
    });
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
