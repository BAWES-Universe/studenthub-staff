import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import {Note} from 'src/app/models/note';


@Injectable({
  providedIn: 'root'
})
export class CompanyNoteService {

  private companyNoteEndpoint = '/notes';

  constructor(private authhttp: AuthHttpService) { }

  /**
   * create note
   * @param model
   */
  create(model: Note): Observable<any>{
    return this.authhttp.post(this.companyNoteEndpoint, {
      company_id: model.company_id,
      note: model.note_text,
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: Note): Observable<any>{
    return this.authhttp.patch(`${this.companyNoteEndpoint}/${model.note_uuid}`, {
      note: model.note_text,
    });
  }

  /**
   * delete note
   * @param model
   */
  delete(model: Note): Observable<any>{
    return this.authhttp.delete(`${this.companyNoteEndpoint}/${model.note_uuid}`);
  }
}
