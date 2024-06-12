import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { Ticket } from '../../models/ticket';
import { TicketComment } from '../../models/ticket_comment';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public endpoint: string = "/tickets";

  constructor(
    public _authhttp: AuthHttpService
  ) { }

  /**
   * return ticket lists
   * @param page
   * @returns
   */
  list(page: number = 1, filters: any = {}): Observable<any> {
    let url = `${this.endpoint}?expand=restaurant,candidate,staff&page=${page}`;

    if(typeof filters.ticket_status === "number") {
      url += '&status=' + filters.ticket_status;
    }

    if(filters.query) {
      url += '&query=' + filters.query;
    }

    return this._authhttp.getRaw(url);
  }

  /**
   * list comments
   * @param ticket_uuid
   * @returns
   */
  listComments(ticket_uuid: string): Observable<any> {
    const url = `${this.endpoint}/comments/${ticket_uuid}?expand=ticketCommentAttachments.attachment,candidate,staff`;
    return this._authhttp.get(url);
  }

  /**
   * return ticket detail
   * @param ticket_uuid
   * @returns
   */
  view(ticket_uuid): Observable<any> {
    let url = `${this.endpoint}/${ticket_uuid}?expand=ticketAttachments.attachment,candidate,staff,ticketComments,ticketComments.candidate,ticketComments.staff,ticketComments.ticketCommentAttachments.attachment`;
    return this._authhttp.get(url);
  }

  /**
   * generate tickets
   * @param ticket
   * @param attachments
   * @returns
   */
  create(ticket: Ticket, attachments = []): Observable<any> {
    let url = `${this.endpoint}`;
    return this._authhttp.post(url, {
      detail:  ticket.ticket_detail,
      candidate_id:  ticket.candidate_id,
      staff_id:  ticket.staff_id,
      attachments: attachments
    });
  }

  /**
   * comment on ticket
   * @param model
   * @param attachments
   * @returns
   */
  comment(model: TicketComment, attachments = []): Observable<any> {
    let url = `${this.endpoint}/comment/${model.ticket_uuid}`;
    return this._authhttp.patch(url, {
      comment_detail:  model.ticket_comment_detail,
      attachments: attachments,
      status: model.status
    });
  }

  /**
   * assign staff to ticket
   * @param ticket
   * @param staff
   * @returns
   */
  assign(ticket, staff): Observable<any> {
    let url = `${this.endpoint}/assign/${ticket.ticket_uuid}`;
    return this._authhttp.patch(url, {
      staff_id: staff.staff_id
    });
  }
}
