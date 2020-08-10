export const environment = {
  production: true,
  envName: 'prod',
  apiEndpoint: 'https://staff.api.studenthub.co/v1',
  permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face/v1596525812/candidate-photo/',
  algoliaCandidateIndex: 'prod_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  environmentName: 'Production Server',
  serviceWorker: false
};
