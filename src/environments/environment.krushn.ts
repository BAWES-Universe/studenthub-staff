
export const environment = {
  production: true,
  envName: 'krushn',
  apiEndpoint: 'http://localhost:8888/studenthub/staff/web/v1',
  permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
  algoliaCandidateIndex: 'krushn_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  environmentName: 'Krushn Local Machine',
  serviceWorker: false
};
