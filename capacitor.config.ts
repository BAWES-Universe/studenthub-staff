import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bawes.studenthubstaff',
  appName: 'StudentHub Staff',
  webDir: 'www',
  // CRITICAL: Explicitly set androidScheme to 'https' to prevent WebView origin
  // change that would wipe local storage data when upgrading from Capacitor 4 to 7.
  // In Capacitor 4, the default scheme was 'http'; in Capacitor 6+, it changed to 'https'.
  // Setting this explicitly preserves existing user data.
  server: {
    androidScheme: 'https',
  },
};

export default config;
