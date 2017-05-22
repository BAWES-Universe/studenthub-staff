import { Injectable, Inject } from '@angular/core';

import { Platform } from 'ionic-angular';

// Custom
import { EnvConfig } from '../app/environments/environments.token';

/*
  Handles all Environment-based config
*/
@Injectable()
export class ConfigService {

  // Endpoint Urls
  public apiBaseUrl: string;

  // InAppBrowser Settings
  public browserTarget: string;
  public browserOptions: string;
  public browserOptionsWithCache: string;

  /**
   * Be sure to set NODE_ENV to the envName configured in environments
   * to load its configuration on Ionic serve / build or any other command
   * 
   * eg: export NODE_ENV=prod && ionic serve
   */
  constructor(public platform: Platform, @Inject(EnvConfig) public envConfig) {
    console.log("Loaded Environment: " + this.envConfig.environmentName);

    // Set base API endpoint based on env config
    this.apiBaseUrl = this.envConfig.apiEndpoint;

    this.setupDeviceSpecificConfigs();
  }

  /**
   * Setup Device Specific Configs
   */
  setupDeviceSpecificConfigs(){
    // Generic Configs
    this.browserTarget = "_blank";
    this.browserOptions = "location=no";
    this.browserOptionsWithCache = "location=no";

    // iOS Specific Configs
    if(this.platform.is("ios")){
      this.browserTarget = "_blank";
      this.browserOptions = "location=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=cancel";
      this.browserOptionsWithCache = "location=no,clearcache=no,clearsessioncache=no,closebuttoncaption=cancel";
    }
    // Android Specific Configs
    if(this.platform.is("android")){
      this.browserTarget = "_blank";
      this.browserOptions = "location=yes,zoom=no,clearcache=yes,clearsessioncache=yes";
      this.browserOptionsWithCache = "location=yes,zoom=no,clearcache=no,clearsessioncache=no";
    }
    if(this.platform.is("android")){
      this.browserTarget = "_blank";
      this.browserOptions = "location=yes,zoom=no,clearcache=yes,clearsessioncache=yes";
      this.browserOptionsWithCache = "location=yes,zoom=no,clearcache=no,clearsessioncache=no";
    }
    if(this.platform.is("core")){
      this.browserTarget = "_system";
    }
  }

}
