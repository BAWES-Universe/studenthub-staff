import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
// services
import {AuthHttpService} from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class RequestActivityService {

  public requestEndpoint = '/request-activity/';

  constructor(
      public authhttp: AuthHttpService
  ) {
  }

  /**
   * List requests activity
   * @returns {Observable<any>}
   */
  list(request_uuid = null): Observable<any> {
    const url = this.requestEndpoint + 'request-activities/' + request_uuid + '?expand=requestChecklist,staff,candidate,updatedBy';
    return this.authhttp.get(url);
  }
}
