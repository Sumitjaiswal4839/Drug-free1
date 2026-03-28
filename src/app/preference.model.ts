export interface Preference {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  language: string;
  timezone: string;
  privacyLevel: 'public' | 'friends-only' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

export interface PreferenceUpdate {
  theme?: 'light' | 'dark';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyReports?: boolean;
  language?: string;
  timezone?: string;
  privacyLevel?: 'public' | 'friends-only' | 'private';
}
