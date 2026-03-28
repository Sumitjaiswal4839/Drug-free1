import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  public session$: Observable<Session | null> = this.sessionSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    this.initializeSession();
    this.setupAuthListener();
  }

  private async initializeSession(): Promise<void> {
    try {
      const { data } = await this.supabase.auth.getSession();
      this.sessionSubject.next(data.session);
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  private setupAuthListener(): void {
    this.supabase.auth.onAuthStateChange((event: any, session: Session | null) => {
      this.sessionSubject.next(session);
    });
  }

  public getClient(): SupabaseClient {
    return this.supabase;
  }

  public getSession(): Session | null {
    return this.sessionSubject.value;
  }

  public getSessionObservable(): Observable<Session | null> {
    return this.session$;
  }

  public async signUp(email: string, password: string): Promise<any> {
    return this.supabase.auth.signUp({
      email,
      password,
    });
  }

  public async signIn(email: string, password: string): Promise<any> {
    return this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  public async signInWithOAuth(provider: 'google' | 'facebook'): Promise<any> {
    return this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  public async signOut(): Promise<any> {
    return this.supabase.auth.signOut();
  }

  public async resetPassword(email: string): Promise<any> {
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  public async updatePassword(newPassword: string): Promise<any> {
    return this.supabase.auth.updateUser({
      password: newPassword,
    });
  }

  public getCurrentUser(): any {
    return this.supabase.auth.getUser();
  }

  public async refreshSession(): Promise<any> {
    return this.supabase.auth.refreshSession();
  }
}
