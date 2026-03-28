import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Goal, GoalCreate } from './goal.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  constructor(private supabaseService: SupabaseService) {}

  public getGoalsByUser(userId: string): Observable<Goal[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('target_date', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((goal: any) => this.mapToGoal(goal));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getGoalById(goalId: string): Observable<Goal> {
    return from(
      this.supabaseService.getClient().from('goals').select('*').eq('id', goalId).single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToGoal(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createGoal(userId: string, goal: GoalCreate): Observable<Goal> {
    const goalData = {
      user_id: userId,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target_date: goal.targetDate.toISOString(),
      status: 'pending',
      priority: goal.priority,
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService.getClient().from('goals').insert([goalData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToGoal(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateGoal(goalId: string, updates: Partial<Goal>): Observable<Goal> {
    const updateData = this.mapFromGoal(updates);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService.getClient().from('goals').update(updateData).eq('id', goalId).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToGoal(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteGoal(goalId: string): Observable<void> {
    return from(this.supabaseService.getClient().from('goals').delete().eq('id', goalId)).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getGoalsByCategory(userId: string, category: string): Observable<Goal[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('target_date', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((goal: any) => this.mapToGoal(goal));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getCompletedGoals(userId: string): Observable<Goal[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('target_date', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((goal: any) => this.mapToGoal(goal));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private mapToGoal(data: any): Goal {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      category: data.category,
      targetDate: new Date(data.target_date),
      status: data.status,
      priority: data.priority,
      progress: data.progress,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapFromGoal(goal: Partial<Goal>): any {
    return {
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target_date: goal.targetDate?.toISOString(),
      status: goal.status,
      priority: goal.priority,
      progress: goal.progress,
    };
  }
}
