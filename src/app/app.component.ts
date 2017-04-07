import { Component, OnInit, NgZone } from '@angular/core';
import { Deploy } from '@ionic/cloud-angular';
import { Platform, Events, ToastController } from 'ionic-angular';

// Native Components
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/start-pages/login/login';
import { NavigationPage } from '../pages/logged-in/navigation/navigation';

import { AuthService } from '../providers/auth.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage;

  constructor(
      public deploy: Deploy,
      private _platform: Platform,
      private _events: Events,
      private _toastCtrl: ToastController,
      private _auth: AuthService,
      private _zone: NgZone,
      statusBar: StatusBar, splashScreen: SplashScreen
  ) {
    this._platform.ready().then(() => {
      // Native functions
      if (this._platform.is('cordova') && this._platform.is('mobile')) {
        statusBar.styleDefault();
        splashScreen.hide();

        // Check for App update via Ionic Deploy
        this._checkForUpdate();
      }

      // Initiate the access token request which determines login status.
      this._auth.getAccessToken();
    });
  }

  /**
   * Using Ng2 Lifecycle hooks because view lifecycle events don't trigger for Bootstrapped MyApp Component
   */
  ngOnInit(){
      // On Login Event, set root to Internal app page
      this._events.subscribe('user:login', (userEventData) => {
        this._zone.run(() => {
          this.rootPage = NavigationPage;
        });
      });

      // On Logout Event, set root to Login Page
      this._events.subscribe('user:logout', (logoutReason) => {
        // Set root to Login Page
        this.rootPage = LoginPage;

        // Show Message explaining logout reason if there's one set
        if(logoutReason){
          console.log(logoutReason);
        }
      });
  }

  /**
   * Check for app updates on the deploy channel
   */
  private _checkForUpdate(){
    this.deploy.channel = 'production';
    this.deploy.check().then((hasUpdate: boolean) => {
      if (hasUpdate) {
        // Show Toast with Download Progress
        let toast = this._toastCtrl.create({
                        message: 'Downloading Update .. 0%',
                        position: 'bottom',
                        showCloseButton: false,
                    });
        toast.present();

        // update is available, download and extract the update
        this.deploy.download({
            onProgress: p => {
                toast.setMessage('Downloading Update .. ' + p + '%');
                //console.log('Downloading = ' + p + '%');
            }
        }).then(() => {
          this.deploy.extract({
              onProgress: p => {
                  toast.setMessage('Extracting .. ' + p + '%');
                  //console.log('Extracting = ' + p + '%');
              }
          }).then(() => {
            // Reload App after 3 seconds
            toast.setMessage('Restarting app to apply update..');
            setTimeout(() => {
              this.deploy.load();
            }, 3000);

            // Get info about the currently active snapshot 
            this.deploy.info().then((info: {deploy_uuid: string, binary_version: string}) => {
              
              let activeSnapshot = info.deploy_uuid;

              // List of snapshots applied on this device.
              this.deploy.getSnapshots().then((snapshots) => {
                // Loop through Existing snapshots and delete the inactive ones
                snapshots.forEach(snapshot => {
                  if(snapshot != activeSnapshot){
                    this.deploy.deleteSnapshot(snapshot).then(() => {
                      // Reload app to apply the update
                      return this.deploy.load();
                    });
                  }
                });
              });
            });
          });
        });
      }
    });
  }
}
