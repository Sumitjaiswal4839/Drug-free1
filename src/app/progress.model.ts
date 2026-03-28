export interface Progress {
  id: string;
  userId: string;
  date: Date;
  soberDays: number;
  moodRating: number;
  energyLevel: number;
  notes?: string;
  milestones?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressCreate {
  date: Date;
  soberDays: number;
  moodRating: number;
  energyLevel: number;
  notes?: string;
  milestones?: string[];
}

export interface ProgressStatistics {
  totalSoberDays: number;
  averageMood: number;
  weeklyTrend: ProgressTrendData[];
  monthlyTrend: ProgressTrendData[];
}

export interface ProgressTrendData {
  date: Date;
  value: number;
}
