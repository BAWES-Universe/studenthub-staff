import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// services
import { StaffService } from 'src/app/providers/logged-in/staff.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { EventService } from 'src/app/providers/event.service';
import { StoryService } from 'src/app/providers/logged-in/story.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { AuthService } from 'src/app/providers/auth.service';
// models
import { Staff } from 'src/app/models/staff';
import { Note } from 'src/app/models/note';
//components
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';


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

  public suggestions = [];

  public segment = 'details';

  constructor(
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    private staffService: StaffService,
    public suggestionService: SuggestionService,
    //private noteService: NoteService,
    //public storyService: StoryService,
    public authService: AuthService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    window.analytics.page('Team View Page');

    if(!this.staff_id)
      this.staff_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.staff = state.model;
    }

    if (!this.staff) {
      this.loadData();
    }

    /*this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data.staff_id == this.staff_id) {
        this.loadNotes();
      }
    });*/
  }

  ionViewWillEnter() {
    //this.loadNotes();
    //this.loadStories();
    this.loadSuggestions();
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
   async loadSuggestions(loading = true) {

    this.loading = loading;

    const params = '&staff_id=' + this.staff_id + '&expand=candidate,fulltimer,request,request.company,note';

    this.suggestionService.list(1, params).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.suggestions = response.body;
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

    const params = 'staff_id=' + this.staff_id + '&expand=candidate,fulltimer,request,request.company,note';

    this.suggestionService.list(this.currentPage, params).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.suggestions = this.suggestions.concat(response.body);
    },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  /**
   * ability to update password
   */
  async changePassword() {
    // this.navController.navigateForward('/change-password');
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent,
      cssClass: 'modal-change-password'
    });

    await modal.present();
  }
}
