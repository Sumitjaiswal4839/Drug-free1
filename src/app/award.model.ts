export interface Award {
  id: string;
  userId: string;
  name: string;
  description?: string;
  badge?: string;
  category: string;
  awardedAt: Date;
  milestone?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  requirements: string;
}
