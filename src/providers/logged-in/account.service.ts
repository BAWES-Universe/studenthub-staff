import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Account Functionality on the server
 */
@Injectable()
export class AccountService {
    private _accountEndpoint: string = "/account";

    constructor(private _authhttp: AuthHttpService) { }

    /**
     * Update password 
     * @returns {Observable<any>}
     */
    updatePassword(params): Observable<any> {
        let url = this._accountEndpoint + '/update-password';
        return this._authhttp.post(url, params);
    }
}

