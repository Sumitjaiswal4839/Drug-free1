export const environment = {
  production: true,
  supabase: {
    url: 'https://YOUR_PROJECT_ID.supabase.co',
    key: 'YOUR_ANON_KEY',
  },
  apiEndpoints: {
    users: '/api/users',
    goals: '/api/goals',
    healthHistory: '/api/health-history',
    progress: '/api/progress',
    preferences: '/api/preferences',
    supportGroups: '/api/support-groups',
    awards: '/api/awards',
  },
  oauth: {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
    },
    facebook: {
      appId: 'YOUR_FACEBOOK_APP_ID',
    },
  },
};
