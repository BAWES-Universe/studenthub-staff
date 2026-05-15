import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.studenthub.staff',
  appName: 'Studenthub Staff',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http'
  }
};

export default config;
