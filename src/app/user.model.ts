export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserProfile extends User {
  recoveryStartDate?: Date;
  recoveryGoal?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
}
