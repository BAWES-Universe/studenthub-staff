export const environment = {
  production: false,
  envName: 'dev-withoutsentry',
  apiEndpoint: 'https://staff.api.dev.studenthub.co/v1',
  permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
  algoliaCandidateIndex: 'dev_candidate_public',
  algoliaFulltimerIndex: 'dev_fulltimer_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  environmentName: 'Dev Server without sentry',
  marker: null,//'assets/images/car.svg',
  serviceWorker: true,
  mixpanelKey: 'ac62dbe81767f8871f754c7bdf6669d6',
};
