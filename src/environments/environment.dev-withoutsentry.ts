export const environment = {
  production: false,
  envName: 'dev-withoutsentry',
  apiEndpoint: 'https://staff.api.dev.studenthub.co/v1',
  permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/photos/",
  // permanentBucketUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
  permanentCloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
  algoliaCandidateIndex: 'dev_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, //5 min in millisecond
  environmentName: 'Dev Server without sentry',
  serviceWorker: true
};
