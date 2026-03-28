import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupportGroup, SupportGroupMember } from './support-group.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupportGroupsService {
  constructor(private supabaseService: SupabaseService) {}

  public getAllGroups(): Observable<SupportGroup[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('support_groups')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((group: any) => this.mapToSupportGroup(group));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getGroupById(groupId: string): Observable<SupportGroup> {
    return from(
      this.supabaseService
        .getClient()
        .from('support_groups')
        .select('*')
        .eq('id', groupId)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToSupportGroup(response.data);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getGroupsByCategory(category: string): Observable<SupportGroup[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('support_groups')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((group: any) => this.mapToSupportGroup(group));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public createGroup(group: Partial<SupportGroup>): Observable<SupportGroup> {
    const groupData = {
      name: group.name,
      description: group.description,
      category: group.category,
      meeting_day: group.meetingDay,
      meeting_time: group.meetingTime,
      location: group.location,
      meeting_link: group.meetingLink,
      facilitator: group.facilitator,
      max_members: group.maxMembers,
      current_members: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService.getClient().from('support_groups').insert([groupData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToSupportGroup(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public updateGroup(groupId: string, updates: Partial<SupportGroup>): Observable<SupportGroup> {
    const updateData = this.mapFromSupportGroup(updates);
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabaseService
        .getClient()
        .from('support_groups')
        .update(updateData)
        .eq('id', groupId)
        .select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToSupportGroup(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteGroup(groupId: string): Observable<void> {
    return from(
      this.supabaseService.getClient().from('support_groups').delete().eq('id', groupId)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public joinGroup(groupId: string, userId: string): Observable<SupportGroupMember> {
    const memberData = {
      group_id: groupId,
      user_id: userId,
      joined_at: new Date().toISOString(),
      role: 'member',
    };

    return from(
      this.supabaseService.getClient().from('support_group_members').insert([memberData]).select()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return this.mapToMember(response.data[0]);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public leaveGroup(groupId: string, userId: string): Observable<void> {
    return from(
      this.supabaseService
        .getClient()
        .from('support_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getGroupMembers(groupId: string): Observable<SupportGroupMember[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('support_group_members')
        .select('*')
        .eq('group_id', groupId)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data.map((member: any) => this.mapToMember(member));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getUserGroups(userId: string): Observable<SupportGroup[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('support_group_members')
        .select('group_id, support_groups(*)')
        .eq('user_id', userId)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return response.data
          .map((member: any) => member.support_groups)
          .map((group: any) => this.mapToSupportGroup(group));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private mapToSupportGroup(data: any): SupportGroup {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      meetingDay: data.meeting_day,
      meetingTime: data.meeting_time,
      location: data.location,
      meetingLink: data.meeting_link,
      facilitator: data.facilitator,
      maxMembers: data.max_members,
      currentMembers: data.current_members,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapToMember(data: any): SupportGroupMember {
    return {
      id: data.id,
      groupId: data.group_id,
      userId: data.user_id,
      joinedAt: new Date(data.joined_at),
      role: data.role,
    };
  }

  private mapFromSupportGroup(group: Partial<SupportGroup>): any {
    return {
      name: group.name,
      description: group.description,
      category: group.category,
      meeting_day: group.meetingDay,
      meeting_time: group.meetingTime,
      location: group.location,
      meeting_link: group.meetingLink,
      facilitator: group.facilitator,
      max_members: group.maxMembers,
      current_members: group.currentMembers,
    };
  }
}
