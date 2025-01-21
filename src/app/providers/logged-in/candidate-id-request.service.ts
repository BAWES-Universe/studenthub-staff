import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateIdRequestService {

  public candidates = [];

  private _candidateEndpoint: string = "/candidate-id-requests";

  constructor(private _authhttp: AuthHttpService) {
  }

  list(page: number): Observable<any> {
    let url = this._candidateEndpoint + '?page=' + page + '&expand=staff';
    return this._authhttp.getRaw(url);
  }

  view(cir_uuid: string): Observable<any> {
    let url = this._candidateEndpoint + '/' + cir_uuid + '?expand=staff';
    return this._authhttp.get(url);
  }

  delete(cir_uuid: string): Observable<any> {
    let url = this._candidateEndpoint + '/' + cir_uuid;
    return this._authhttp.delete(url);
  }
}
