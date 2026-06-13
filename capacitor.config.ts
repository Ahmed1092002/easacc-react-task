import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.easacc.reacttask',
  appName: 'Easacc React Task',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
