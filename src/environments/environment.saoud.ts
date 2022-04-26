export const environment = {
  production: true,
  envName: 'saoud',
  apiEndpoint: 'http://localhost/~Saoud/studenthub/studenthub/staff/web/v1',
  permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
  algoliaCandidateIndex: 'saoud_candidate_public',
  algoliaFulltimerIndex: 'saoud_fulltimer_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  environmentName: 'Saoud Local Machine',
  s3Domain: 'studenthub-uploads-dev-server',
  marker: null,//'assets/images/car.svg',
  serviceWorker: false
};
