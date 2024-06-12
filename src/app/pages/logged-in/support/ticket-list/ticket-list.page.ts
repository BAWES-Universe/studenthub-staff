import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
// models
import { Ticket } from 'src/app/models/ticket';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { TicketService } from 'src/app/providers/logged-in/ticket.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
// pages
import { StaffPage } from '../../pickers/staff/staff.page';
import { TicketFormPage } from '../ticket-form/ticket-form.page';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss'],
})
export class TicketListPage implements OnInit {

  public tickets: Ticket[] = [];

  public perPageCount = 20;
  public currentPage = 0;
  public totalPages = 0;

  public loading = false;

  public assigning: boolean = false;

  public borderLimit: boolean = false;

  public filters = {
    query: null,
    ticket_status: null
  };

  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public ticketService: TicketService
  ) { }

  async ngOnInit() {

  }

  ionViewWillEnter() {
    this.currentPage = 1;
    this.loadData();
  }

  filterByStatus(event, status) {
    event.preventDefault();
    this.filters.ticket_status = status;
    this.loadData();
  }

  onSearch() {
    this.currentPage = 1;
    this.totalPages = null;
    this.loadData();
  }

  /**
   * load tickets
   */
  loadData() {

    this.loading = true;

    this.ticketService.list(this.currentPage, this.filters).subscribe(response => {

      this.perPageCount = parseInt(response.headers.get('X-Pagination-Per-Page'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

      this.tickets = response.body;
    },
      error => this.loading = false,
      () => this.loading = false,
    );
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    if (this.currentPage >= this.totalPages) {

      if (event && event.target)
        event.target.complete();
      return null;
    }

    this.loading = true;

    this.currentPage++;

    this.ticketService.list(this.currentPage, this.filters).subscribe(response => {

      this.perPageCount = parseInt(response.headers.get('X-Pagination-Per-Page'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

      this.tickets = this.tickets.concat(response.body);

      if (event && event.target)
        event.target.complete();

    }, err => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * show form to add new ticket
   */
  async showTicketForm() {

    window.history.pushState({
      navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: TicketFormPage,
      cssClass: 'popup-modal',
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });
  }

  /**
   * show staff list
   */
  async showStaffList(ticket, event) {

    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({
      navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StaffPage,
      cssClass: 'popup-modal',
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.staff) {
        this.assign(e.data.staff, ticket);
      }
    });
  }

  /**
   * assign staff to ticket
   * @param staff
   * @param ticket
   */
  assign(staff, ticket) {

    this.assigning = ticket.ticket_uuid;

    this.ticketService.assign(ticket, staff).subscribe(response => {

      this.assigning = false;

      if(response.operation == 'success') {
        ticket.staff = staff;
      }
      else
      {
        this.alertCtrl.create({
          header: this.translateService.transform('Errors'),
          message: this.authService.errorMessage(response.message)
        }).then(toast => {
          toast.present();
        });
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }
}
