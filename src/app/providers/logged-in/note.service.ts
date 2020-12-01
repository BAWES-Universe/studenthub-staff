import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {Note} from '../../models/note';
import {AuthHttpService} from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private noteEndpoint = '/notes';

  constructor(private authHttp: AuthHttpService) { }

  /**
   * List of all Notes
   * @returns {Observable<any>}
   */
  listByStaff(page: number, staffID: number): Observable<any>{
    return this.authHttp.getRaw(this.noteEndpoint + '/staff/' + staffID + '?expand=company&page=' + page);
  }

  /**
   * create note
   * @param model
   */
  create(model: Note): Observable<any>{
    return this.authHttp.post(this.noteEndpoint, {
      candidate_id: model.candidate_id,
      company_id: (model.company_id) ? model.company_id : null,
      request_uuid: (model.request_uuid) ? model.request_uuid : null,
      contact_uuid: (model.contact_uuid) ? model.contact_uuid : null,
      fulltimer_uuid: (model.fulltimer_uuid) ? model.fulltimer_uuid : null,
      note: model.note_text,
      type: model.note_type
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: Note): Observable<any>{
    return this.authHttp.patch(`${this.noteEndpoint}/${model.note_uuid}`, {
      note: model.note_text,
      type: model.note_type,
      company_id: (model.company_id) ? model.company_id : null,
      request_uuid: (model.request_uuid) ? model.request_uuid : null,
      contact_uuid: (model.contact_uuid) ? model.contact_uuid : null,
      fulltimer_uuid: (model.fulltimer_uuid) ? model.fulltimer_uuid : null,
    });
  }

  /**
   * delete note
   * @param model
   */
  delete(model: Note): Observable<any>{
    return this.authHttp.delete(`${this.noteEndpoint}/${model.note_uuid}`);
  }

  /**
   * list candidate note
   */
  list(): Observable<any>{
    return this.authHttp.getRaw(`${this.noteEndpoint}?expand=createdBy,updatedBy`);
  }

  /**
   * list candidate note
   */
  listByTypeAndId(type: string, id): Observable<any>{
    return this.authHttp.getRaw(`${this.noteEndpoint}/${type}/${id}?expand=createdBy,updatedBy`);
  }
}
