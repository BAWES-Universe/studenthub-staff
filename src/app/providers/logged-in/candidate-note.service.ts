import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Note } from 'src/app/models/note';


@Injectable({
  providedIn: 'root'
})
export class CandidateNoteService {

  private candidateNoteEndpoint = '/candidate-notes';

  constructor(private authhttp: AuthHttpService) { }

  /**
   * create note
   * @param model
   */
  create(model: Note): Observable<any>{
    const url = this.candidateNoteEndpoint;
    return this.authhttp.post(url, {
      candidate_id: model.candidate_id,
      note: model.note_text,
      type: model.note_type,
      company_id: (model.company_id) ? model.company_id : null,
      request_uuid: (model.request_uuid) ? model.request_uuid : null,
      contact_uuid: (model.contact_uuid) ? model.contact_uuid : null,
      fulltimer_uuid: (model.fulltimer_uuid) ? model.fulltimer_uuid : null,
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: Note): Observable<any>{
    const url = `${this.candidateNoteEndpoint}/${model.note_uuid}`;
    return this.authhttp.patch(url, {
      note: model.note_text,
      type: model.note_type,
      company_id: (model.company_id) ? model.company_id : null,
      request_uuid: (model.request_uuid) ? model.request_uuid : null,
      contact_uuid: (model.contact_uuid) ? model.contact_uuid : null,
      fulltimer_uuid: (model.fulltimer_uuid) ? model.fulltimer_uuid : null,
    });
  }

  /**
   * toggle committed
   * @param model
   */
  toggleCommitted(model: Note): Observable<any>{
    const url = `${this.candidateNoteEndpoint}/toggle-committed`;
    return this.authhttp.patch(url, {
      candidate_id: model.candidate_id,
      note: model.note_text,
      type: model.note_type
    });
  }

  /**
   * delete note
   * @param model
   */
  delete(model: Note): Observable<any>{
    const url = `${this.candidateNoteEndpoint}/${model.note_uuid}`;
    return this.authhttp.delete(url);
  }

  /**
   * list candidate note
   */
  list(): Observable<any>{
    const url = `${this.candidateNoteEndpoint}?expand=createdBy,updatedBy,company,request`;
    return this.authhttp.getRaw(url);
  }

  /**
   * list candidate note by id
   */
  listById(id: number): Observable<any>{
    const url = `${this.candidateNoteEndpoint}/list-by-id/${id}?expand=createdBy,updatedBy,company,request`;
    return this.authhttp.getRaw(url);
  }
}
