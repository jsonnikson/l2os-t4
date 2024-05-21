import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
  owner: process.env.EXPO_PUBLIC_EAS_OWNER,
  plugins: ['expo-router'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  platforms: ['ios', 'android'],
  name: 'T4 App',
  slug: 'l2os',
  updates: {
    url: 'https://u.expo.dev/1a5b3cfb-8307-41b3-89e7-f98da96bbf11',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
})
