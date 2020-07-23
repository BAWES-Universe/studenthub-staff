import { Injectable } from '@angular/core';
import {AuthhttpService} from "./authhttp.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private _bankEndpoint: string = "/banks";

  constructor(private _authhttp: AuthhttpService) { }
  /**
   * List of all banks without pagination
   * @returns {Observable<any>}
   */
  listAll(): Observable<any> {
    return this._authhttp.get(this._bankEndpoint + '/all');
  }
}


