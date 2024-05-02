import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from 'src/environments/environment';
//services
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(public authService: AuthService) { 
    mixpanel.init(environment.mixpanelKey);
  }

  /**
   * register user
   * @param id 
   * @param params 
   */
  async user(id, params) {
    
    //segment

    if(window.analytics)
      window.analytics.identify(id, {
        name: params.name,
        email: params.email,
      });

    //mixpanel 

    mixpanel.identify(id);

    mixpanel.people.set(params);
  }

  /**
   * page event
   * @param name 
   */
  async page(name) {
    if(window.analytics)
      window.analytics.page(name);

    const params = {
      //language : this.authService.language_pref,
      channel : "Staff Web App",
    }

    mixpanel.track("Page View", {
      "name": name,
      ...params
    });
  }

  /**
   * custom event
   * @param eventName 
   * @param params 
   */
  async track(eventName, params) {
    
    //params.language = this.authService.language_pref; 
    params.channel = "Staff Web App"; 
    
    if(window.analytics)
      window.analytics.track(eventName, params);

    mixpanel.track(eventName, params);
  }

  refresh() {
    mixpanel.reset();
  }
}
