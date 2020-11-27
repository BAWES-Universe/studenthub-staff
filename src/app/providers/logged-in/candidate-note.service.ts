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
    return this.authhttp.post(this.candidateNoteEndpoint, {
      candidate_id: model.candidate_id,
      note: model.note_text,
      type: model.note_type
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: Note): Observable<any>{
    return this.authhttp.patch(`${this.candidateNoteEndpoint}/${model.note_uuid}`, {
      note: model.note_text,
      type: model.note_type
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
    return this.authhttp.delete(`${this.candidateNoteEndpoint}/${model.note_uuid}`);
  }

  /**
   * list candidate note
   */
  list(): Observable<any>{
    return this.authhttp.getRaw(`${this.candidateNoteEndpoint}?expand=createdBy,updatedBy`);
  }
}
