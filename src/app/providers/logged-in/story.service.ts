import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

// services
import {AuthHttpService} from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  private storyEndpoint = '/story';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return list of all stories
   * @returns {Observable<any>}
   */
  list(page: number = 1, urlParams = ''): Observable<any>{
    const url = this.storyEndpoint + '/list?page=' + page + urlParams;
    return this._authhttp.getRaw(url);
  }

  /**
   * get the current story that staff is workin on
   * @param storyUuid
   */
  getCurrentStory(urlParams= '?expand=request,request.company'): Observable<any>{
    return this._authhttp.get(`${this.storyEndpoint}/current-story${urlParams}`);
  }

  /**
   * detail
   * @param storyUuid
   */
  detail(storyUuid: number, urlParams): Observable<any> {
    const url = `${this.storyEndpoint}/${storyUuid}${urlParams}`;
    return this._authhttp.get(url);
  }

  /**
   * detail
   * @param storyUuid
   */
  loadActiveStory(urlParams= '?expand=staff,request,request.company'): Observable<any> {
    const url = `${this.storyEndpoint}/active-story${urlParams}`;
    return this._authhttp.get(url);
  }

 /**
   * detail
   * @param storyUuid
   */
  listAllOldHistory(urlParams= '?expand=staff,request,request.company'): Observable<any> {
    const url = `${this.storyEndpoint}/all-old-stories${urlParams}`;
    return this._authhttp.get(url);
  }

  /**
   * detail
   * @param storyUuid
   */
  changeStoryStatus(status: number, story_uuid): Observable<any>{
    const url = `${this.storyEndpoint}/change-story-status`;
    return this._authhttp.post(url, {
      story_uuid,
      status,
    });
  }

  /**
   * assign staff to request
   * @param request_uuid
   * @param staff_id
   * @returns
   */
  assign(request_uuid, staff_id): Observable<any> {
    const url = `${this.storyEndpoint}/assign/${request_uuid}`;
    return this._authhttp.patch(url, {
      staff_id: staff_id
    });
  }

  /**
   * check if request updated
   * @param story_uuid
   */
  isUpdated(story_uuid): Observable<any> {
    const url = `${this.storyEndpoint}/is-story-updated/${story_uuid}`;
    return this._authhttp.get(url);
  }
}
