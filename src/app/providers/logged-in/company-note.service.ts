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
   * List of all notest
   * @param page
   * @param searchParams
   */
  list(page, searchParams = ''): Observable<any> {
    const url = this.companyNoteEndpoint + '?page=' + page + searchParams + '&expand=createdBy,updatedBy';
    return this.authhttp.getRaw(url);
  }

  /**
   * create note
   * @param model
   */
  create(model: Note): Observable<any>{
    return this.authhttp.post(this.companyNoteEndpoint, {
      company_id: model.company_id,
      note: model.note_text,
      type: model.note_type
    });
  }

  /**
   * update note
   * @param model
   */
  update(model: Note): Observable<any>{
    return this.authhttp.patch(`${this.companyNoteEndpoint}/${model.note_uuid}`, {
      note: model.note_text,
      type: model.note_type
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
