import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skyon.community',
  appName: 'Skyon App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
