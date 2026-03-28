# Supabase Authentication Implementation Guide

This document explains the authentication system implemented for the drug recovery Angular app.

## Architecture Overview

The authentication system consists of:

1. **SupabaseService** - Core Supabase client initialization and session management
2. **AuthService** - High-level authentication logic (login, register, logout, etc.)
3. **AuthGuard** - Route protection
4. **AuthInterceptor** - HTTP request token injection and token refresh
5. **Backend Services** - Data access layer for app features
6. **Models** - TypeScript interfaces for type safety

## File Structure

```
src/app/
├── supabase.service.ts          # Core Supabase initialization
├── auth.service.ts              # Authentication logic
├── auth.guard.ts                # Route guard
├── auth.interceptor.ts          # HTTP interceptor
├── user.service.ts              # User CRUD operations
├── goals.service.ts             # Goals management
├── health-history.service.ts    # Medical records
├── progress.service.ts          # Progress tracking
├── preferences.service.ts       # User preferences
├── support-groups.service.ts    # Support group operations
├── awards.service.ts            # Awards & achievements
├── user.model.ts                # User interfaces
├── goal.model.ts                # Goal interfaces
├── health-history.model.ts      # Health history interfaces
├── progress.model.ts            # Progress interfaces
├── preference.model.ts          # Preference interfaces
├── support-group.model.ts       # Support group interfaces
├── award.model.ts               # Award interfaces
├── app.module.ts                # Module setup with interceptor
├── environment.ts               # Dev environment config
└── environment.prod.ts          # Production environment config

schema.sql                        # Database schema & RLS policies
environment.ts                    # Environment configuration
environment.prod.ts              # Production environment config
SUPABASE_SETUP.md               # Setup instructions
```

## Usage Examples

### 1. Register a New User

```typescript
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}

  register(email: string, password: string, firstName: string, lastName: string) {
    this.authService.register(email, password, firstName, lastName).subscribe(
      (response) => {
        console.log('Registration successful', response);
      },
      (error) => {
        console.error('Registration failed', error);
      }
    );
  }
}
```

### 2. Login with Email/Password

```typescript
login(email: string, password: string) {
  this.authService.login(email, password).subscribe(
    (response) => {
      console.log('Login successful', response);
      // User is now authenticated
    },
    (error) => {
      console.error('Login failed', error);
    }
  );
}
```

### 3. Login with Google

```typescript
loginWithGoogle() {
  this.authService.loginWithGoogle().subscribe(
    (response) => {
      console.log('Google login successful', response);
    },
    (error) => {
      console.error('Google login failed', error);
    }
  );
}
```

### 4. Access Current User

```typescript
// Observable
this.authService.getCurrentUser().subscribe((user) => {
  console.log('Current user:', user);
});

// Check if authenticated
this.authService.isAuthenticated().subscribe((isAuth) => {
  console.log('Is authenticated:', isAuth);
});
```

### 5. Logout

```typescript
logout() {
  this.authService.logout().subscribe(
    () => {
      console.log('Logged out successfully');
    },
    (error) => {
      console.error('Logout failed', error);
    }
  );
}
```

### 6. Protect Routes

In your `app-routing.module.ts`:

```typescript
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];
```

### 7. Get User Data

```typescript
import { UserService } from './user.service';

export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userService.getUserById(user.id).subscribe(
          (fullUser) => {
            this.user = fullUser;
          },
          (error) => {
            console.error('Failed to load user:', error);
          }
        );
      }
    });
  }
}
```

### 8. Create Goals

```typescript
import { GoalsService } from './goals.service';
import { Goal, GoalCreate } from './goal.model';

export class GoalsComponent {
  constructor(
    private goalsService: GoalsService,
    private authService: AuthService
  ) {}

  createGoal(goal: GoalCreate) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.goalsService.createGoal(user.id, goal).subscribe(
          (newGoal) => {
            console.log('Goal created:', newGoal);
          },
          (error) => {
            console.error('Failed to create goal:', error);
          }
        );
      }
    });
  }
}
```

### 9. Track Progress

```typescript
import { ProgressService } from './progress.service';
import { ProgressCreate } from './progress.model';

export class ProgressComponent {
  constructor(
    private progressService: ProgressService,
    private authService: AuthService
  ) {}

  recordProgress(progress: ProgressCreate) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.progressService.createProgress(user.id, progress).subscribe(
          (newProgress) => {
            console.log('Progress recorded:', newProgress);
          },
          (error) => {
            console.error('Failed to record progress:', error);
          }
        );
      }
    });
  }

  getStatistics() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.progressService.getWeeklyStats(user.id).subscribe(
          (stats) => {
            console.log('Weekly statistics:', stats);
          },
          (error) => {
            console.error('Failed to get statistics:', error);
          }
        );
      }
    });
  }
}
```

### 10. Join Support Groups

```typescript
import { SupportGroupsService } from './support-groups.service';

export class SupportGroupsComponent {
  constructor(
    private groupsService: SupportGroupsService,
    private authService: AuthService
  ) {}

  joinGroup(groupId: string) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.groupsService.joinGroup(groupId, user.id).subscribe(
          (member) => {
            console.log('Joined group:', member);
          },
          (error) => {
            console.error('Failed to join group:', error);
          }
        );
      }
    });
  }
}
```

## Key Features

### 1. Session Management
- Automatic session initialization on app load
- Real-time session state updates via observables
- Automatic token refresh on 401 errors

### 2. Type Safety
- Full TypeScript typing for all models and services
- Compile-time error checking
- IDE autocomplete support

### 3. Error Handling
- Consistent error handling across all services
- RxJS error operators for proper error propagation
- Detailed error messages for debugging

### 4. Row-Level Security
- Database-level security policies
- Users can only access their own data
- Public read access for support groups
- Admin functions protected

### 5. OAuth Integration
- Google OAuth support
- Facebook OAuth support
- Automatic redirect handling
- Social login combined with email registration

## Best Practices

1. **Always subscribe and unsubscribe**
   ```typescript
   subscription = this.authService.getCurrentUser().subscribe(...);
   
   ngOnDestroy() {
     this.subscription.unsubscribe();
   }
   ```

2. **Use takeUntil for cleaner unsubscription**
   ```typescript
   private destroy$ = new Subject<void>();
   
   ngOnInit() {
     this.authService.getCurrentUser()
       .pipe(takeUntil(this.destroy$))
       .subscribe(...);
   }
   
   ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

3. **Handle errors properly**
   ```typescript
   service.getData().subscribe(
     data => { /* handle success */ },
     error => { /* handle error */ },
     () => { /* handle completion */ }
   );
   ```

4. **Use async pipe in templates**
   ```html
   <div *ngIf="(currentUser$ | async) as user">
     Hello, {{ user.firstName }}!
   </div>
   ```

## Security Considerations

1. **Never log sensitive data** - Avoid logging passwords or tokens
2. **Validate all inputs** - Both client and server-side validation
3. **Use HTTPS** - Always use HTTPS in production
4. **Protect API keys** - Never commit credentials to git
5. **Enable RLS** - Ensure all RLS policies are active
6. **Rotate tokens** - Implement token rotation in production
7. **Monitor access** - Regular audit logs and security monitoring

## Troubleshooting

### Issue: "User not found" error
- Verify email/password are correct
- Check that user exists in Supabase Authentication
- Ensure email is confirmed (if email confirmation is enabled)

### Issue: "Unauthorized" error when fetching data
- Check that RLS policies are correct
- Verify user ID matches the authenticated user
- Ensure token is being sent with requests (check AuthInterceptor)

### Issue: CORS errors
- Add your domain to Supabase CORS settings
- Verify environment URL is correct

### Issue: Session doesn't persist
- Check browser localStorage is enabled
- Verify session is being properly initialized
- Check browser console for errors

## Performance Optimization

1. **Cache user data** - Store commonly accessed data in a BehaviorSubject
2. **Lazy load routes** - Protect routes that require authentication
3. **Pagination** - Implement pagination for large datasets
4. **Indexes** - Database indexes are already created for common queries
5. **Debounce searches** - Debounce search inputs to reduce API calls

## Next Steps

1. Implement password reset functionality
2. Add two-factor authentication
3. Create admin dashboard for user management
4. Implement email verification
5. Add audit logging
6. Set up automated backups
7. Configure email notifications


<br><br>