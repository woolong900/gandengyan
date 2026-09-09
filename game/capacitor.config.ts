import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gandengyan.mahjong',
  appName: '干瞪眼麻将',
  webDir: 'dist',
  android: {
    backgroundColor: '#0b1a12',
    allowMixedContent: true,
  },
  ios: {
    backgroundColor: '#0b1a12',
    contentInset: 'never',
    preferredContentMode: 'mobile',
  },
};

export default config;
