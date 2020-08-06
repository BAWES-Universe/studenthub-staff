export const environment = {
  production: true,
  envName: 'saoud',
  apiEndpoint: 'http://localhost/~Saoud/pogi/pogi/admin/web/v1',
  permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/photos/",
  permanentCloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
  algoliaCandidateIndex: 'saoud_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, //5 min in millisecond
  environmentName: 'Saoud Local Machine',
  s3Domain: 'studenthub-uploads-dev-server',
  serviceWorker: false
}
