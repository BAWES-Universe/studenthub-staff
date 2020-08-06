
export const environment = {
    production: false,
    envName: 'dev',
    apiEndpoint: 'https://staff.api.dev.studenthub.co/v1',
    // permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/",
    // permanentBucketUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
    algoliaCandidateIndex: 'dev_candidate_public',
    algoliaCacheDuration: 5 * 60 * 1000, //5 min in millisecond
    permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/photos/',
    permanentCloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/v1596525812/candidate-photo/',
    environmentName: 'Dev Server',
    serviceWorker: true
};
