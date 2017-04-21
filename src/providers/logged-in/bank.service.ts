import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Store Functionality on the server
 */
@Injectable()
export class BankService {
    private _bankEndpoint: string = "/banks";

    constructor(private _authhttp: AuthHttpService) { }

    /**
     * List of all banks
     * @returns {Observable<any>}
     */
    list(page:number): Observable<any> {
        let url = this._bankEndpoint;
        return this._authhttp.getRaw(url);
    }

    /**
     * List of all banks without pagination
     * @returns {Observable<any>}
     */
    listAll(): Observable<any> {
        let url = this._bankEndpoint + '/all';
        return this._authhttp.get(url);
    }
}

