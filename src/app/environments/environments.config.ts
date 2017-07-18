/**
 * Be sure to set NODE_ENV to the envName configured below
 * to load its configuration on Ionic serve / build or any other command
 * 
 * eg: export NODE_ENV=prod && ionic serve
 */
export const environmentList = [
  {
    envName: 'khalid',
    apiEndpoint: 'http://localhost/~BAWES/payroll/staff/web/v1',
    environmentName: 'Khalid Local Machine'
  },
  {
    envName: 'saoud',
    apiEndpoint: 'http://localhost/~saoud/payroll/staff/web/v1',
    environmentName: 'Saoud Local Machine'
  },
  {
    envName: 'krushn',
    apiEndpoint: 'http://localhost/payroll/staff/web/v1',
    environmentName: 'Krushn Local Machine'
  },
  {
    envName: 'anil',
    apiEndpoint: 'http://staff.payroll.local/v1',
    environmentName: 'Anil Local Machine'
  },
  {
    envName: 'prod',
    apiEndpoint: 'https://payroll-staff.studenthub.co/v1',
    environmentName: 'Production Server'
  },
  {
    envName: 'dev',
    apiEndpoint: 'http://localhost/payroll/staff/web/v1',
    //apiEndpoint: 'http://payroll-staff.dev.studenthub.co/v1',
    environmentName: 'Dev Server'
  }
];