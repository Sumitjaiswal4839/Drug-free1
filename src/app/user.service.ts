import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { User, UserProfile } from './user.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  public getUserById(userId: string): Observable<User> {
    return from(this.supabaseService.getClient().from('users').select('*').eq('id', userId).single()).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToUser(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getAllUsers(): Observable<User[]> {
    return from(this.supabaseService.getClient().from('users').select('*')).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((user: any) => this.mapToUser(user));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateUser(userId: string, updates: Partial<User>): Observable<User> {
    const updateData = this.mapFromUser(updates);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService.getClient().from('users').update(updateData).eq('id', userId).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToUser(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    const updateData = this.mapFromUserProfile(profile);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService.getClient().from('users').update(updateData).eq('id', userId).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToUserProfile(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteUser(userId: string): Observable<void> {
    return from(this.supabaseService.getClient().from('users').delete().eq('id', userId)).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getUserStats(userId: string): Observable<any> {
    return from(this.supabaseService.getClient().rpc('get_user_stats', { user_id: userId })).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      profilePicture: data.profile_picture,
      dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
      phone: data.phone,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastLogin: data.last_login ? new Date(data.last_login) : undefined,
    };
  }

  private mapToUserProfile(data: any): UserProfile {
    return {
      ...this.mapToUser(data),
      recoveryStartDate: data.recovery_start_date ? new Date(data.recovery_start_date) : undefined,
      recoveryGoal: data.recovery_goal,
      emergencyContact: data.emergency_contact,
      emergencyContactPhone: data.emergency_contact_phone,
    };
  }

  private mapFromUser(user: Partial<User>): any {
    return {
      first_name: user.firstName,
      last_name: user.lastName,
      profile_picture: user.profilePicture,
      date_of_birth: user.dateOfBirth?.toISOString(),
      phone: user.phone,
      address: user.address,
    };
  }

  private mapFromUserProfile(profile: Partial<UserProfile>): any {
    return {
      ...this.mapFromUser(profile),
      recovery_start_date: profile.recoveryStartDate?.toISOString(),
      recovery_goal: profile.recoveryGoal,
      emergency_contact: profile.emergencyContact,
      emergency_contact_phone: profile.emergencyContactPhone,
    };
  }
}
