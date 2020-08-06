
export const environment = {
  production: true,
  envName: 'krushn',
  //apiEndpoint: 'https://staff.api.studenthub.co/v1',
  apiEndpoint: 'http://localhost:8888/bawes/studenthub/staff/web/v1',
  permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/photos/",
  permanentCloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
  algoliaCandidateIndex: 'krushn_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, //5 min in millisecond
  environmentName: 'Krushn Local Machine',
  serviceWorker: false
}
