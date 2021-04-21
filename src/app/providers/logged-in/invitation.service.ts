import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { Invitation } from 'src/app/models/invitation';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private _endpoint = '/invitations';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all invitations
   * @returns {Observable<any>}
   */
  list(params: string = ''): Observable<any> {
    let url = this._endpoint + '?expand=candidate,request,note,updatedBy' + params;
    return this._authhttp.get(url);
  }

  /**
   * get invitation details
   * @returns {Observable<any>}
   */
  view(invitation_uuid): Observable<any> {
    let url = this._endpoint + '/' + invitation_uuid + '?expand=candidate,updatedBy';
    return this._authhttp.get(url);
  }

  /**
   * create new invitation_uuid for request
   * @param params
   */
  create(params) {
    return this._authhttp.post(this._endpoint, {
      request_uuid: params.request_uuid,
      candidate_id: params.candidate_id,
      reason: params.reason
    });
  }

  /**
   * delete invitation
   * @param invitation
   */
  delete(invitation: Invitation) {
    const url = this._endpoint + '/' + invitation.invitation_uuid;
    return this._authhttp.delete(url);
  }
}
