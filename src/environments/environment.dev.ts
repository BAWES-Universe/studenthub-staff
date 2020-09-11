
export const environment = {
    production: false,
    envName: 'dev',
    apiEndpoint: 'https://staff.api.dev.studenthub.co/v1',
    algoliaCandidateIndex: 'dev_candidate_public',
    algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
    permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
    cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face/v1596525812/dev/',
    environmentName: 'Dev Server',
    serviceWorker: true
};
 