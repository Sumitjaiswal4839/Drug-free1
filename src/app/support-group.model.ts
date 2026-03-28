export interface SupportGroup {
  id: string;
  name: string;
  description?: string;
  category: string;
  meetingDay: string;
  meetingTime: string;
  location?: string;
  meetingLink?: string;
  facilitator?: string;
  maxMembers?: number;
  currentMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportGroupMember {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: Date;
  role: 'member' | 'moderator' | 'facilitator';
}
