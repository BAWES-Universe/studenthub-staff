export const environment = {
  production: true,
  serviceWorker: true,
  envName: 'prod',
  apiEndpoint: 'https://staff.api.studenthub.co/v1',
  permanentBucketUrl: 'https://studenthub-uploads.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face/v1596525812/',
  cloudinaryVideoUrl: 'https://res.cloudinary.com/studenthub/video/upload/w_250/v1596453482/',
  algoliaCandidateIndex: 'prod_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  environmentName: 'Production Server',
};
