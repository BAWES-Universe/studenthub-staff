// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: 'dev',
  permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face/v1596525812/dev/',
  cloudinaryVideoUrl: 'https://res.cloudinary.com/studenthub/video/upload/w_250/v1596453482/dev/',
  apiEndpoint: 'https://staff.api.dev.studenthub.co/v1',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  algoliaCandidateIndex: 'dev_candidate_public',
  environmentName: 'dev Server',
  serviceWorker: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
