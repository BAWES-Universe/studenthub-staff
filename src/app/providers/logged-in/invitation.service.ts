import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { Invitation } from 'src/app/models/invitation';
import { Story } from 'src/app/models/request';
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
    let url = this._endpoint + '?expand=story,candidate,request,note,updatedBy' + params;
    return this._authhttp.get(url);
  }

  /**
   * get invitation details
   * @returns {Observable<any>}
   */
  view(invitation_uuid): Observable<any> {
    let url = this._endpoint + '/' + invitation_uuid + '?expand=story,candidate,updatedBy';
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
   * check if invitation already sent
   * @param candidate_id 
   * @param story 
   */
  isAlreadyInvited(candidate_id, story: Story) {
    const url = this._endpoint + '/is-already-invited?candidate_id=' + candidate_id + '&story_uuid=' + story.story_uuid
       + '&request_uuid=' + story.request_uuid;
    return this._authhttp.get(url);
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
