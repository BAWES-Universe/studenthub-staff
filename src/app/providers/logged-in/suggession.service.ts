import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class SuggessionService {

  private _endpoint = '/suggestions';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all suggestions
   * @returns {Observable<any>}
   */
  list(params: string = ''): Observable<any> {
    let url = this._endpoint + '?expand=note,candidate,fulltimer' + params;
    return this._authhttp.get(url);
  }

  create(params) {
    return this._authhttp.post(this._endpoint, {
      suggestion: params.suggestion,
      request_uuid: params.request_uuid,
      fulltimer_uuid: params.fulltimer_uuid,
      candidate_id: params.candidate_id
    });
  }
}
