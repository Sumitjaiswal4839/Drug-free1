import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Preference, PreferenceUpdate } from './preference.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  constructor(private supabaseService: SupabaseService) {}

  public getPreferencesByUser(userId: string): Observable<Preference> {
    return from(
      this.supabaseService
        .getClient()
        .from('preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToPreference(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updatePreferences(userId: string, updates: PreferenceUpdate): Observable<Preference> {
    const updateData = this.mapFromPreferenceUpdate(updates);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService
        .getClient()
        .from('preferences')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToPreference(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createDefaultPreferences(userId: string): Observable<Preference> {
    const defaultPreferences = {
      user_id: userId,
      theme: 'light',
      email_notifications: true,
      push_notifications: true,
      weekly_reports: true,
      language: 'en',
      timezone: 'UTC',
      privacy_level: 'friends-only',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService.getClient().from('preferences').insert([defaultPreferences]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToPreference(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deletePreferences(userId: string): Observable<void> {
    return from(
      this.supabaseService.getClient().from('preferences').delete().eq('user_id', userId)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateTheme(userId: string, theme: 'light' | 'dark'): Observable<Preference> {
    return this.updatePreferences(userId, { theme });
  }

  public updateNotificationSettings(
    userId: string,
    emailNotifications: boolean,
    pushNotifications: boolean,
    weeklyReports: boolean
  ): Observable<Preference> {
    return this.updatePreferences(userId, {
      emailNotifications,
      pushNotifications,
      weeklyReports,
    });
  }

  public updatePrivacyLevel(userId: string, privacyLevel: 'public' | 'friends-only' | 'private'): Observable<Preference> {
    return this.updatePreferences(userId, { privacyLevel });
  }

  private mapToPreference(data: any): Preference {
    return {
      id: data.id,
      userId: data.user_id,
      theme: data.theme,
      emailNotifications: data.email_notifications,
      pushNotifications: data.push_notifications,
      weeklyReports: data.weekly_reports,
      language: data.language,
      timezone: data.timezone,
      privacyLevel: data.privacy_level,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapFromPreferenceUpdate(updates: PreferenceUpdate): any {
    return {
      theme: updates.theme,
      email_notifications: updates.emailNotifications,
      push_notifications: updates.pushNotifications,
      weekly_reports: updates.weeklyReports,
      language: updates.language,
      timezone: updates.timezone,
      privacy_level: updates.privacyLevel,
    };
  }
}
