
export const environment = {
    production: false,
    envName: 'dev',
    apiEndpoint: 'http://localhost:25080/v1',
    algoliaCandidateIndex: 'dev_candidate_public',
    algoliaFulltimerIndex: 'dev_fulltimer_public',
    algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
    permanentBucketUrl: 'https://studenthub-uploads-dev-server.s3.amazonaws.com/',
    cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
    environmentName: 'Dev Server',
    marker: null,//'assets/images/car.svg',
    serviceWorker: true,
    mixpanelKey: 'ac62dbe81767f8871f754c7bdf6669d6',
    sentryDsn: 'https://6601c3bc5a9740d9fa828be2db82242a@o70039.ingest.us.sentry.io/4511495400849408',
};