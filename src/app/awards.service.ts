import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Award, Achievement } from './award.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AwardsService {
  constructor(private supabaseService: SupabaseService) {}

  public getAwardsByUser(userId: string): Observable<Award[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('awards')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((award: any) => this.mapToAward(award));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getAwardById(awardId: string): Observable<Award> {
    return from(
      this.supabaseService.getClient().from('awards').select('*').eq('id', awardId).single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToAward(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createAward(userId: string, award: Partial<Award>): Observable<Award> {
    const awardData = {
      user_id: userId,
      name: award.name,
      description: award.description,
      badge: award.badge,
      category: award.category,
      awarded_at: award.awardedAt?.toISOString() || new Date().toISOString(),
      milestone: award.milestone,
    };

    return from(
      this.supabaseService.getClient().from('awards').insert([awardData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToAward(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteAward(awardId: string): Observable<void> {
    return from(this.supabaseService.getClient().from('awards').delete().eq('id', awardId)).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getAwardsByCategory(userId: string, category: string): Observable<Award[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('awards')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('awarded_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((award: any) => this.mapToAward(award));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getAllAchievements(): Observable<Achievement[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('achievements')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((achievement: any) => this.mapToAchievement(achievement));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getAchievementById(achievementId: string): Observable<Achievement> {
    return from(
      this.supabaseService
        .getClient()
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToAchievement(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createAchievement(achievement: Partial<Achievement>): Observable<Achievement> {
    const achievementData = {
      name: achievement.name,
      description: achievement.description,
      badge: achievement.badge,
      requirements: achievement.requirements,
    };

    return from(
      this.supabaseService.getClient().from('achievements').insert([achievementData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToAchievement(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public checkAndAwardAchievements(userId: string): Observable<Award[]> {
    return from(
      this.supabaseService.getClient().rpc('check_and_award_achievements', { user_id: userId })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((award: any) => this.mapToAward(award));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private mapToAward(data: any): Award {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      badge: data.badge,
      category: data.category,
      awardedAt: new Date(data.awarded_at),
      milestone: data.milestone,
    };
  }

  private mapToAchievement(data: any): Achievement {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      badge: data.badge,
      requirements: data.requirements,
    };
  }
}
