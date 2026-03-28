import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Progress, ProgressCreate, ProgressStatistics, ProgressTrendData } from './progress.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  constructor(private supabaseService: SupabaseService) {}

  public getProgressByUser(userId: string, limit: number = 100): Observable<Progress[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((progress: any) => this.mapToProgress(progress));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getProgressById(progressId: string): Observable<Progress> {
    return from(
      this.supabaseService
        .getClient()
        .from('progress')
        .select('*')
        .eq('id', progressId)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToProgress(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createProgress(userId: string, progress: ProgressCreate): Observable<Progress> {
    const progressData = {
      user_id: userId,
      date: progress.date.toISOString(),
      sober_days: progress.soberDays,
      mood_rating: progress.moodRating,
      energy_level: progress.energyLevel,
      notes: progress.notes,
      milestones: progress.milestones,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService.getClient().from('progress').insert([progressData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToProgress(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateProgress(progressId: string, updates: Partial<Progress>): Observable<Progress> {
    const updateData = this.mapFromProgress(updates);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService.getClient().from('progress').update(updateData).eq('id', progressId).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToProgress(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteProgress(progressId: string): Observable<void> {
    return from(this.supabaseService.getClient().from('progress').delete().eq('id', progressId)).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getWeeklyStats(userId: string): Observable<ProgressStatistics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    return from(
      this.supabaseService
        .getClient()
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.calculateStatistics(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getMonthlyStats(userId: string): Observable<ProgressStatistics> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    return from(
      this.supabaseService
        .getClient()
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.calculateStatistics(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getTotalSoberDays(userId: string): Observable<number> {
    return from(
      this.supabaseService.getClient().rpc('get_total_sober_days', { user_id: userId })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data || 0;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private calculateStatistics(data: any[]): ProgressStatistics {
    const soberDays = data.length > 0 ? Math.max(...data.map((p) => p.sober_days)) : 0;
    const averageMood =
      data.length > 0
        ? data.reduce((sum, p) => sum + p.mood_rating, 0) / data.length
        : 0;

    const weeklyTrend: ProgressTrendData[] = data.map((p) => ({
      date: new Date(p.date),
      value: p.mood_rating,
    }));

    const monthlyTrend: ProgressTrendData[] = this.aggregateMonthlyData(data);

    return {
      totalSoberDays: soberDays,
      averageMood,
      weeklyTrend,
      monthlyTrend,
    };
  }

  private aggregateMonthlyData(data: any[]): ProgressTrendData[] {
    const aggregated: { [key: string]: number[] } = {};

    data.forEach((p) => {
      const date = new Date(p.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!aggregated[key]) {
        aggregated[key] = [];
      }
      aggregated[key].push(p.mood_rating);
    });

    return Object.entries(aggregated).map(([key, values]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        date: new Date(year, month, 1),
        value: values.reduce((a, b) => a + b) / values.length,
      };
    });
  }

  private mapToProgress(data: any): Progress {
    return {
      id: data.id,
      userId: data.user_id,
      date: new Date(data.date),
      soberDays: data.sober_days,
      moodRating: data.mood_rating,
      energyLevel: data.energy_level,
      notes: data.notes,
      milestones: data.milestones,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapFromProgress(progress: Partial<Progress>): any {
    return {
      date: progress.date?.toISOString(),
      sober_days: progress.soberDays,
      mood_rating: progress.moodRating,
      energy_level: progress.energyLevel,
      notes: progress.notes,
      milestones: progress.milestones,
    };
  }
}
