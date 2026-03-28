import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, delay } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const storedUser = localStorage.getItem('localdb_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }

  private saveToLocalDb(user: User): void {
    localStorage.setItem('localdb_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  public register(email: string, password: string, firstName?: string, lastName?: string): Observable<any> {
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('localdb_users_table') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return throwError(() => 'Email already registered!');
    }

    const newUser: User = {
      id: 'local_' + Math.random().toString(36).substr(2, 9),
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      password // storing insecurely just for mock local db
    } as any;

    users.push(newUser);
    localStorage.setItem('localdb_users_table', JSON.stringify(users));

    // Auto login after register
    return new Observable(obs => {
      setTimeout(() => {
        this.saveToLocalDb(newUser);
        obs.next({ user: newUser });
        obs.complete();
      }, 800);
    });
  }

  public login(email: string, password: string): Observable<any> {
    return new Observable(obs => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('localdb_users_table') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user) {
          this.saveToLocalDb(user);
          obs.next({ user });
          obs.complete();
        } else {
          obs.error('Invalid email or password');
        }
      }, 800);
    });
  }

  // You must replace this with your actual Google OAuth Client ID that you get from Google Cloud Console.
  // Setup instructions: Go to console.cloud.google.com -> APIs & Services -> Credentials -> Create OAuth client ID
  private GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';

  public renderGoogleButton(element: HTMLElement, onSuccess: (user: User) => void, onError: (err: any) => void): void {
    if ((window as any).google && (window as any).google.accounts) {
      (window as any).google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          this.handleGoogleCredential(response.credential).subscribe({
            next: (user) => onSuccess(user),
            error: (err) => onError(err)
          });
        }
      });
      (window as any).google.accounts.id.renderButton(element, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        width: 300
      });
      // Optionally trigger prompt: (window as any).google.accounts.id.prompt();
    } else {
      // Retry if script not loaded yet
      setTimeout(() => this.renderGoogleButton(element, onSuccess, onError), 100);
    }
  }

  private handleGoogleCredential(credential: string): Observable<User> {
    return new Observable(obs => {
      try {
        // Decode the JWT token payload from Google
        const payload = JSON.parse(atob(credential.split('.')[1]));

        console.log("Real Google Payload Fetched: ", payload);

        const realGoogleUser = {
          id: 'google_' + payload.sub,
          email: payload.email,
          firstName: payload.given_name || payload.name,
          lastName: payload.family_name || '',
          profilePicture: payload.picture,
          createdAt: new Date(),
          updatedAt: new Date()
        } as unknown as User;

        const users = JSON.parse(localStorage.getItem('localdb_users_table') || '[]');
        let existingUser = users.find((u: any) => u.email === realGoogleUser.email);

        if (!existingUser) {
          users.push(realGoogleUser);
          localStorage.setItem('localdb_users_table', JSON.stringify(users));
          existingUser = realGoogleUser;
        }

        this.saveToLocalDb(existingUser);
        obs.next(existingUser);
        obs.complete();
      } catch (e) {
        obs.error("Failed to decode Google Credential");
      }
    });
  }

  public logout(): Observable<any> {
    localStorage.removeItem('localdb_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    return of(true).pipe(delay(300));
  }

  public updatePassword(newPassword: string): Observable<any> {
    // local db mock
    const currentUser = this.currentUserSubject.value as any;
    if (currentUser) {
      currentUser.password = newPassword;
      this.saveToLocalDb(currentUser);
      return of(true).pipe(delay(500));
    }
    return throwError(() => 'No user logged in to update password');
  }

  public getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  public getAccessToken(): Observable<string | null> {
    return of('mock-local-token');
  }

  // OTP Mocks
  public requestOTP(email: string): Observable<any> { return of(true).pipe(delay(500)); }
  public verifyOTP(email: string, code: string): Observable<any> { return of(true).pipe(delay(500)); }
  public resendOTP(email: string): Observable<any> { return of(true).pipe(delay(500)); }

  // Password Reset Mocks
  public forgotPassword(email: string): Observable<any> { return of(true).pipe(delay(500)); }
  public resetPassword(token: string, newPassword: string, email: string): Observable<any> { return of(true).pipe(delay(500)); }
  public validateResetToken(token: string): Observable<any> { return of(true).pipe(delay(500)); }
}
