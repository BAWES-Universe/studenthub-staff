import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Note } from 'src/app/models/note';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private noteEndpoint = '/notes';

  constructor(private authhttp: AuthHttpService) { }

  /**
   * List of all notest
   * @param page
   * @param searchParams
   */
  list(searchParams = '', page = null): Observable<any> {
    let url = this.noteEndpoint + '?' + searchParams + '&expand=companyContact,request,company,createdBy,updatedBy';

    if(page) {
      url += '&page=' + page;
    }

    return this.authhttp.getRaw(url);
  }

  /**
   * Return note detail 
   * @param note
   */
  view(note): Observable<any> {
    const url = this.noteEndpoint + '/' + note.note_uuid + '?expand=companyContact,request,company,createdBy,updatedBy';
    return this.authhttp.get(url);
  }

  /**
   * create note
   * @param model
   */
  create(model: Note): Observable<any>{
    return this.authhttp.post(this.noteEndpoint, {
      company_id: model.company_id,
      note: model.note_text,
      type: model.note_type,
      contact_uuid: model.contact_uuid,
      request_uuid: model.request_uuid,
      fulltimer_uuid: model.fulltimer_uuid,
      candidate_id: model.candidate_id
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: Note): Observable<any>{
    return this.authhttp.patch(`${this.noteEndpoint}/${model.note_uuid}`, {
      note: model.note_text,
      type: model.note_type,
      company_id: model.company_id,
      contact_uuid: model.contact_uuid,
      request_uuid: model.request_uuid,
      fulltimer_uuid: model.fulltimer_uuid,
      candidate_id: model.candidate_id
    });
  }

  /**
   * delete note
   * @param model
   */
  delete(model: Note): Observable<any>{
    return this.authhttp.delete(`${this.noteEndpoint}/${model.note_uuid}`);
  }
}
