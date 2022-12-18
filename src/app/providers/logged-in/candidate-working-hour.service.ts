import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateWorkingHourService {

  private _endpoint = '/candidate-working-hours';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  list(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/date?page=${page}&expand=company,dateListByCandidate${param}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  listByHour(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/hour?page=${page}&expand=store,store.company${param}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * @param date
   * @param candidateId
   */
  detail(date, candidateId): Observable<any>{
    const url = `${this._endpoint}/date/${date}/${candidateId}?expand=company,dateListByCandidate`;
    return this._authhttp.get(url);
  }
}
