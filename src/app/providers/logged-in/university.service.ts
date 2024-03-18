import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
//services
import {AuthHttpService} from "./authhttp.service";


@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  private _universityEndpoint: string = "/universities";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all universities
   * @returns {Observable<any>}
   */
  list(page: number, keyword): Observable<any> {
    let url = this._universityEndpoint + '?page=' + page + "&expand=totalCandidates";
    if (keyword) {
      url += '&keyword=' + keyword;
    } 
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all universities
   * @returns {Observable<any>}
   */
  view(university_id): Observable<any> {
    return this._authhttp.get(this._universityEndpoint + '/' + university_id + "?expand=totalCandidates") ;
  }

  /**
   * List of all universities
   * @returns {Observable<any>}
   */
  listAll(): Observable<any> {
    let url = this._universityEndpoint + '/all?expand=totalCandidates';
    return this._authhttp.get(url);
  }
}


