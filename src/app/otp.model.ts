export interface OTP {
  id: string;
  userId: string;
  code: string;
  email: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPCreate {
  email: string;
}

export interface OTPVerify {
  email: string;
  code: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresIn: number;
}
