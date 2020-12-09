import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//models
import { Note } from 'src/app/models/note';
//services
import { CompanyNoteService } from 'src/app/providers/logged-in/company-note.service';


@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.page.html',
  styleUrls: ['./note-view.page.scss'],
})
export class NoteViewPage implements OnInit {

  public note_uuid: string;

  public note: Note;

  public loading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public noteService: CompanyNoteService
  ) { }

  ngOnInit() {
    this.note_uuid = this.route.snapshot.params.note_uuid;
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
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }
}
