# API Service Reference Guide

This document provides a complete reference for all backend services and their available methods.

## Authentication Services

### SupabaseService

Initializes and manages the Supabase client connection.

```typescript
// Initialize Supabase client
constructor()

// Get current session
getSession(): Session | null
getSessionObservable(): Observable<Session | null>

// Email/Password Authentication
signUp(email: string, password: string): Promise<any>
signIn(email: string, password: string): Promise<any>

// OAuth Authentication
signInWithOAuth(provider: 'google' | 'facebook'): Promise<any>

// Session Management
signOut(): Promise<any>
getCurrentUser(): Promise<any>
refreshSession(): Promise<any>

// Password Management
resetPassword(email: string): Promise<any>
updatePassword(newPassword: string): Promise<any>

// Get the Supabase client
getClient(): SupabaseClient
```

### AuthService

High-level authentication operations and state management.

```typescript
// Observable streams
currentUser$: Observable<User | null>
isAuthenticated$: Observable<boolean>

// Authentication Methods
register(email: string, password: string, firstName?: string, lastName?: string): Observable<any>
login(email: string, password: string): Observable<any>
loginWithGoogle(): Observable<any>
loginWithFacebook(): Observable<any>
logout(): Observable<any>

// Password Management
resetPassword(email: string): Observable<any>
updatePassword(newPassword: string): Observable<any>

// State Access
getCurrentUser(): Observable<User | null>
isAuthenticated(): Observable<boolean>
getAccessToken(): Observable<string | null>
```

## User Management

### UserService

Manages user profile data and account operations.

```typescript
// Read Operations
getUserById(userId: string): Observable<User>
getAllUsers(): Observable<User[]>
getUserStats(userId: string): Observable<any>

// Write Operations
updateUser(userId: string, updates: Partial<User>): Observable<User>
updateProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile>

// Delete Operations
deleteUser(userId: string): Observable<void>
```

**User Model:**
```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

## Goal Management

### GoalsService

Manages daily, weekly, and monthly goals.

```typescript
// Read Operations
getGoalsByUser(userId: string): Observable<Goal[]>
getGoalById(goalId: string): Observable<Goal>
getGoalsByCategory(userId: string, category: string): Observable<Goal[]>
getCompletedGoals(userId: string): Observable<Goal[]>

// Write Operations
createGoal(userId: string, goal: GoalCreate): Observable<Goal>
updateGoal(goalId: string, updates: Partial<Goal>): Observable<Goal>

// Delete Operations
deleteGoal(goalId: string): Observable<void>
```

**Goal Model:**
```typescript
interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'daily' | 'weekly' | 'monthly';
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}
```

## Health History

### HealthHistoryService

Manages medical records and substance use history.

```typescript
// Read Operations
getHistoryByUser(userId: string): Observable<HealthHistory[]>
getHistoryById(recordId: string): Observable<HealthHistory>
getRecentHistory(userId: string, days?: number): Observable<HealthHistory[]>

// Write Operations
createRecord(userId: string, record: HealthHistoryCreate): Observable<HealthHistory>
updateRecord(recordId: string, updates: Partial<HealthHistory>): Observable<HealthHistory>

// Delete Operations
deleteRecord(recordId: string): Observable<void>
```

**HealthHistory Model:**
```typescript
interface HealthHistory {
  id: string;
  userId: string;
  recordDate: Date;
  substanceType: string;
  useFrequency: string;
  duration?: string;
  symptoms?: string[];
  medicalTreatment?: string;
  doctorName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Progress Tracking

### ProgressService

Tracks user progress with mood ratings and sober days.

```typescript
// Read Operations
getProgressByUser(userId: string, limit?: number): Observable<Progress[]>
getProgressById(progressId: string): Observable<Progress>
getWeeklyStats(userId: string): Observable<ProgressStatistics>
getMonthlyStats(userId: string): Observable<ProgressStatistics>
getTotalSoberDays(userId: string): Observable<number>

// Write Operations
createProgress(userId: string, progress: ProgressCreate): Observable<Progress>
updateProgress(progressId: string, updates: Partial<Progress>): Observable<Progress>

// Delete Operations
deleteProgress(progressId: string): Observable<void>
```

**Progress Model:**
```typescript
interface Progress {
  id: string;
  userId: string;
  date: Date;
  soberDays: number;
  moodRating: number; // 1-10
  energyLevel: number; // 1-10
  notes?: string;
  milestones?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProgressStatistics {
  totalSoberDays: number;
  averageMood: number;
  weeklyTrend: ProgressTrendData[];
  monthlyTrend: ProgressTrendData[];
}
```

## User Preferences

### PreferencesService

Manages user settings and preferences.

```typescript
// Read Operations
getPreferencesByUser(userId: string): Observable<Preference>

// Write Operations
updatePreferences(userId: string, updates: PreferenceUpdate): Observable<Preference>
createDefaultPreferences(userId: string): Observable<Preference>

// Convenience Methods
updateTheme(userId: string, theme: 'light' | 'dark'): Observable<Preference>
updateNotificationSettings(
  userId: string,
  emailNotifications: boolean,
  pushNotifications: boolean,
  weeklyReports: boolean
): Observable<Preference>
updatePrivacyLevel(
  userId: string,
  privacyLevel: 'public' | 'friends-only' | 'private'
): Observable<Preference>

// Delete Operations
deletePreferences(userId: string): Observable<void>
```

**Preference Model:**
```typescript
interface Preference {
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
```

## Support Groups

### SupportGroupsService

Manages support group information and membership.

```typescript
// Read Operations
getAllGroups(): Observable<SupportGroup[]>
getGroupById(groupId: string): Observable<SupportGroup>
getGroupsByCategory(category: string): Observable<SupportGroup[]>
getGroupMembers(groupId: string): Observable<SupportGroupMember[]>
getUserGroups(userId: string): Observable<SupportGroup[]>

// Write Operations
createGroup(group: Partial<SupportGroup>): Observable<SupportGroup>
updateGroup(groupId: string, updates: Partial<SupportGroup>): Observable<SupportGroup>

// Delete Operations
deleteGroup(groupId: string): Observable<void>

// Membership Management
joinGroup(groupId: string, userId: string): Observable<SupportGroupMember>
leaveGroup(groupId: string, userId: string): Observable<void>
```

**SupportGroup Model:**
```typescript
interface SupportGroup {
  id: string;
  name: string;
  description?: string;
  category: string;
  meetingDay: string;
  meetingTime: string;
  location?: string;
  meetingLink?: string;
  facilitator?: string;
  maxMembers?: number;
  currentMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SupportGroupMember {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: Date;
  role: 'member' | 'moderator' | 'facilitator';
}
```

## Awards & Achievements

### AwardsService

Manages user awards and achievement milestones.

```typescript
// Read Operations
getAwardsByUser(userId: string): Observable<Award[]>
getAwardById(awardId: string): Observable<Award>
getAwardsByCategory(userId: string, category: string): Observable<Award[]>
getAllAchievements(): Observable<Achievement[]>
getAchievementById(achievementId: string): Observable<Achievement>

// Write Operations
createAward(userId: string, award: Partial<Award>): Observable<Award>
createAchievement(achievement: Partial<Achievement>): Observable<Achievement>

// Delete Operations
deleteAward(awardId: string): Observable<void>

// Business Logic
checkAndAwardAchievements(userId: string): Observable<Award[]>
```

**Award Model:**
```typescript
interface Award {
  id: string;
  userId: string;
  name: string;
  description?: string;
  badge?: string;
  category: string;
  awardedAt: Date;
  milestone?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  requirements: string;
}
```

## Common Patterns

### Error Handling

All services follow RxJS error handling patterns:

```typescript
service.getData().subscribe(
  data => {
    // Success
  },
  error => {
    // Handle error
    console.error('Error:', error);
  }
);
```

### Observable Patterns

Use async pipe in templates:

```html
<div *ngIf="(data$ | async) as data">
  {{ data.name }}
</div>
```

Or subscribe in component:

```typescript
data$ = this.service.getData();
```

### Type-Safe Operations

All services are fully typed with TypeScript:

```typescript
goal: Goal = { /* ... */ };
updatedGoal: Goal = await this.goalsService
  .updateGoal(goalId, goal)
  .toPromise();
```

## Authentication Guard

### AuthGuard

Protects routes that require authentication:

```typescript
// In routing module
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [AuthGuard]
}
```

## HTTP Interceptor

### AuthInterceptor

Automatically:
1. Adds JWT token to all requests
2. Handles token refresh on 401 errors
3. Logs out user if refresh fails

Registered in `app.module.ts`:

```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}
```

## Performance Tips

1. **Limit results** - Use limit parameter for pagination
2. **Cache data** - Store frequently accessed data
3. **Unsubscribe** - Always unsubscribe from observables
4. **Use takeUntil** - For cleaner subscription management
5. **Lazy load** - Load data only when needed

## Error Codes

| Code | Meaning |
|------|---------|
| 401 | Unauthorized - Token missing or invalid |
| 403 | Forbidden - User doesn't have permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable - Invalid data |
| 500 | Server Error - Contact support |

## Rate Limiting

Supabase free tier limits:
- 500K monthly active users
- 2GB database
- 5GB file storage
- Check dashboard for current usage

## Next Steps

1. Implement caching layer for frequently accessed data
2. Add data pagination for large datasets
3. Implement real-time listeners with Supabase subscriptions
4. Add offline capability with local storage
5. Implement data export/import functionality


<br><br>