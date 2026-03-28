export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'daily' | 'weekly' | 'monthly';
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalCreate {
  title: string;
  description?: string;
  category: 'daily' | 'weekly' | 'monthly';
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
}
