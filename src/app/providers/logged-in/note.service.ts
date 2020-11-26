import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private mallEndpoint = '/notes';

  constructor(private authHttp: AuthHttpService) { }

  /**
   * List of all Notes
   * @returns {Observable<any>}
   */
  listByStaff(page: number, staffID: number): Observable<any>{
    return this.authHttp.getRaw(this.mallEndpoint + '/staff/' + staffID + '?expand=company&page=' + page);
  }
}
