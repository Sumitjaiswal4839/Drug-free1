export interface HealthHistory {
  id: string;
  userId: string;
  recordDate: Date;
  substanceType: string;
  useFrequency: string;
  duration?: string;
  symptoms?: string[];
  medicalTreatment?: string;
  doctorName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthHistoryCreate {
  recordDate: Date;
  substanceType: string;
  useFrequency: string;
  duration?: string;
  symptoms?: string[];
  medicalTreatment?: string;
  doctorName?: string;
  notes?: string;
}
