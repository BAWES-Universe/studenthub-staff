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
    const url = `${this.storyEndpoint}/list?page=${page}${urlParams}`;
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
  detail(storyUuid: number, urlParams): Observable<any>{
    return this._authhttp.get(`${this.storyEndpoint}/${storyUuid}${urlParams}`);
  }

  /**
   * detail
   * @param storyUuid
   */
  loadActiveStory(urlParams= '?expand=request,request.company'): Observable<any>{
    return this._authhttp.get(`${this.storyEndpoint}/active-story${urlParams}`);
  }

 /**
   * detail
   * @param storyUuid
   */
  listAllOldHistory(urlParams= '?expand=request,request.company'): Observable<any>{
    return this._authhttp.get(`${this.storyEndpoint}/all-old-stories${urlParams}`);
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
}
