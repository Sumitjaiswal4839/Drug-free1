import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HealthHistory, HealthHistoryCreate } from './health-history.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class HealthHistoryService {
  constructor(private supabaseService: SupabaseService) {}

  public getHistoryByUser(userId: string): Observable<HealthHistory[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('health_history')
        .select('*')
        .eq('user_id', userId)
        .order('record_date', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((record: any) => this.mapToHealthHistory(record));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getHistoryById(recordId: string): Observable<HealthHistory> {
    return from(
      this.supabaseService
        .getClient()
        .from('health_history')
        .select('*')
        .eq('id', recordId)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToHealthHistory(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createRecord(userId: string, record: HealthHistoryCreate): Observable<HealthHistory> {
    const recordData = {
      user_id: userId,
      record_date: record.recordDate.toISOString(),
      substance_type: record.substanceType,
      use_frequency: record.useFrequency,
      duration: record.duration,
      symptoms: record.symptoms,
      medical_treatment: record.medicalTreatment,
      doctor_name: record.doctorName,
      notes: record.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService.getClient().from('health_history').insert([recordData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToHealthHistory(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateRecord(recordId: string, updates: Partial<HealthHistory>): Observable<HealthHistory> {
    const updateData = this.mapFromHealthHistory(updates);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService
        .getClient()
        .from('health_history')
        .update(updateData)
        .eq('id', recordId)
        .select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToHealthHistory(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteRecord(recordId: string): Observable<void> {
    return from(
      this.supabaseService.getClient().from('health_history').delete().eq('id', recordId)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getRecentHistory(userId: string, days: number = 30): Observable<HealthHistory[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return from(
      this.supabaseService
        .getClient()
        .from('health_history')
        .select('*')
        .eq('user_id', userId)
        .gte('record_date', startDate.toISOString())
        .order('record_date', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((record: any) => this.mapToHealthHistory(record));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private mapToHealthHistory(data: any): HealthHistory {
    return {
      id: data.id,
      userId: data.user_id,
      recordDate: new Date(data.record_date),
      substanceType: data.substance_type,
      useFrequency: data.use_frequency,
      duration: data.duration,
      symptoms: data.symptoms,
      medicalTreatment: data.medical_treatment,
      doctorName: data.doctor_name,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapFromHealthHistory(history: Partial<HealthHistory>): any {
    return {
      record_date: history.recordDate?.toISOString(),
      substance_type: history.substanceType,
      use_frequency: history.useFrequency,
      duration: history.duration,
      symptoms: history.symptoms,
      medical_treatment: history.medicalTreatment,
      doctor_name: history.doctorName,
      notes: history.notes,
    };
  }
}
