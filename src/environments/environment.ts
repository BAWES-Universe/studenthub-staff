// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: 'dev',
  permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
  apiEndpoint: 'https://staff.api.dev.studenthub.co/v1',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  algoliaCandidateIndex: 'dev_candidate_public',
  algoliaFulltimerIndex: 'dev_fulltimer_public',
  environmentName: 'dev Server',
  marker: null,//'assets/images/car.svg',
  serviceWorker: true,
  mixpanelKey: 'ac62dbe81767f8871f754c7bdf6669d6',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
