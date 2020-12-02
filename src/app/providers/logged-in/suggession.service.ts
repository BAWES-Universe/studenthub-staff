import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class SuggessionService {

  private _endpoint = '/suggestions';

  constructor(private _authhttp: AuthHttpService) { }

  create(params) {
    return this._authhttp.post(this._endpoint, {
      suggestion: params.suggestion,
      request_uuid: params.request_uuid,
      fulltimer_uuid: params.fulltimer_uuid,
      candidate_id: params.candidate_id
    });
  }
}
