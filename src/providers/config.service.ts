import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';

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

  constructor(public platform: Platform) {
    // Initiate dev environment on computer while
    // running the production on mobile
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.initProdEnvironment();
      }else{
        this.initDevEnvironment();
      }
    });

  }

  /**
   * Initialize the Dev Environment
   * @param {string} [platform]
   */
  initDevEnvironment(platform?: string){
    this.apiBaseUrl = "http://localhost/~BAWES/payroll/staff/web/v1";
    //this.apiBaseUrl = "http://localhost/payroll/staff/web/v1";
    //this.apiBaseUrl = "http://payroll-staff.dev.studenthub.co/v1";

    this.setupDeviceSpecificConfigs();
  }

  /**
   * Initialize the Production Environment
   * @param {string} [platform]
   */
  initProdEnvironment(platform?: string){
    this.apiBaseUrl = "http://payroll-staff.dev.studenthub.co/v1";

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
