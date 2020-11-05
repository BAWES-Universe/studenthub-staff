import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import {CandidateNote} from 'src/app/models/candidate.note';


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
  create(model: CandidateNote): Observable<any>{
    return this.authhttp.post(this.candidateNoteEndpoint, {
      candidate_id: model.candidate_id,
      note: model.note_text,
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: CandidateNote): Observable<any>{
    return this.authhttp.patch(`${this.candidateNoteEndpoint}/${model.candidate_note_uuid}`, {
      note: model.note_text,
    });
  }

  /**
   * toggle committed
   * @param model 
   */
  toggleCommitted(model: CandidateNote): Observable<any>{
    const url = `${this.candidateNoteEndpoint}/toggle-committed`;
    return this.authhttp.patch(url, {
      candidate_id: model.candidate_id,
      note: model.note_text,
    });
  }

  /**
   * delete note
   * @param model
   */
  delete(model: CandidateNote): Observable<any>{
    return this.authhttp.delete(`${this.candidateNoteEndpoint}/${model.candidate_note_uuid}`);
  }

  /**
   * list candidate note
   */
  list(): Observable<any>{
    return this.authhttp.getRaw(`${this.candidateNoteEndpoint}`);
  }
}
