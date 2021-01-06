import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// services
import { StaffService } from 'src/app/providers/logged-in/staff.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Staff } from 'src/app/models/staff';
import { Note } from 'src/app/models/note';


@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.page.html',
  styleUrls: ['./team-view.page.scss'],
})
export class TeamViewPage implements OnInit {

  public borderLimit = false;

  public staff_id: any;
  public staff: Staff;
  public loading = false;
  public loadMore = false;

  public pageCount = 0;
  public currentPage = 1;
  public notes: Note[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private staffService: StaffService,
    private noteService: NoteService,
    public eventService: EventService
  ) { }

  ngOnInit() {

    if(!this.staff_id)
      this.staff_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.staff = state.model;
    }

    if (!this.staff) {
      this.loadData();
    }

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data.staff_id == this.staff_id) {
        this.loadNotes();
      }
    });
  }

  ionViewWillEnter() {
    if (this.staff_id) {
      this.loadNotes();
    }
  }

  loadData() {
    this.loading = true;
    this.staffService.detail(this.staff_id).subscribe(res => {
      this.loading = false;
      this.staff = res;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * load store list
   * @param page
   */
  async loadNotes(loading = true) {

    this.loading = loading;

    const params = 'staff_id=' + this.staff_id;

    this.noteService.list(params, 1).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.notes = response.body;
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * load more
   * @param event
   */
  doInfinite(event) {
    this.loadMore = true;

    this.currentPage++;

    const params = 'staff_id=' + this.staff_id;

    this.noteService.list(params, this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.notes = this.notes.concat(response.body);
    },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }
}
