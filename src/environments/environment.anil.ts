
export const environment = {
  production: false,
  envName: 'anil',
  apiEndpoint: 'http://localhost/bawes/studenthub/studenthub/staff/web/v1',
  // permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/",
  permanentBucketUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
  algoliaCandidateIndex: 'anil_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, //5 min in millisecond
  environmentName: 'Anil Local Machine',
  serviceWorker: false
};
