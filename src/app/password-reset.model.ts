export interface PasswordReset {
  id: string;
  userId?: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  email?: string;
}
