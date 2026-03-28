import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { OTP, OTPCreate, OTPVerify, OTPResponse } from './otp.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class OTPService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Generate and send OTP to email
   * Uses email-based OTP for two-factor authentication
   */
  public generateAndSendOTP(request: OTPCreate): Observable<OTPResponse> {
    return from(this.sendOTP(request.email)).pipe(
      catchError((error) => {
        console.error('Error sending OTP:', error);
        return throwError(() => ({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error,
        }));
      })
    );
  }

  /**
   * Verify OTP code
   * Checks if the provided code matches and is within expiry time
   */
  public verifyOTP(request: OTPVerify): Observable<OTPResponse> {
    return from(this.verifyOTPCode(request.email, request.code)).pipe(
      catchError((error) => {
        console.error('Error verifying OTP:', error);
        return throwError(() => ({
          success: false,
          message: 'Invalid or expired OTP. Please try again.',
          error,
        }));
      })
    );
  }

  /**
   * Resend OTP to email (rate-limited)
   */
  public resendOTP(email: string): Observable<OTPResponse> {
    return from(this.sendOTP(email)).pipe(
      catchError((error) => {
        console.error('Error resending OTP:', error);
        return throwError(() => ({
          success: false,
          message: 'Failed to resend OTP. Please try again.',
          error,
        }));
      })
    );
  }

  /**
   * Get OTP details for a specific email (for verification flow)
   */
  public getOTPByEmail(email: string): Observable<OTP | null> {
    return from(this.fetchOTPByEmail(email)).pipe(
      catchError((error) => {
        console.error('Error fetching OTP:', error);
        return throwError(() => error);
      })
    );
  }

  private async sendOTP(email: string): Promise<OTPResponse> {
    const client = this.supabaseService.getClient();

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
      // Check if OTP already exists for this email
      const { data: existingOTP } = await client
        .from('otp_codes')
        .select('id')
        .eq('email', email)
        .eq('verified', false)
        .single();

      if (existingOTP) {
        // Update existing OTP
        await client
          .from('otp_codes')
          .update({
            code,
            expires_at: expiresAt.toISOString(),
            attempts: 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingOTP.id);
      } else {
        // Create new OTP
        await client.from('otp_codes').insert([
          {
            email,
            code,
            expires_at: expiresAt.toISOString(),
            verified: false,
            attempts: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      // TODO: Send email with OTP code using email service
      // For now, we're using Supabase's built-in email, but you can integrate:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Custom SMTP

      console.log(`OTP sent to ${email}: ${code}`); // Remove in production

      return {
        success: true,
        message: 'OTP sent to your email',
        expiresIn: 600, // 10 minutes in seconds
      };
    } catch (error) {
      throw error;
    }
  }

  private async verifyOTPCode(email: string, code: string): Promise<OTPResponse> {
    const client = this.supabaseService.getClient();

    try {
      const { data: otpRecord, error: fetchError } = await client
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .eq('verified', false)
        .single();

      if (fetchError || !otpRecord) {
        throw new Error('Invalid OTP code');
      }

      // Check if OTP has expired
      const expiresAt = new Date(otpRecord.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('OTP has expired');
      }

      // Check attempt limit (max 5 attempts)
      if (otpRecord.attempts >= 5) {
        throw new Error('Too many failed attempts. Please request a new OTP.');
      }

      // Mark OTP as verified
      const { error: updateError } = await client
        .from('otp_codes')
        .update({
          verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', otpRecord.id);

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        message: 'OTP verified successfully',
        expiresIn: 0,
      };
    } catch (error) {
      // Increment attempt counter on failure
      try {
        const { data: currentOTP } = await client
          .from('otp_codes')
          .select('attempts')
          .eq('email', email)
          .eq('code', code)
          .eq('verified', false)
          .single();

        if (currentOTP) {
          await client
            .from('otp_codes')
            .update({
              attempts: (currentOTP.attempts || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('email', email)
            .eq('code', code)
            .eq('verified', false);
        }
      } catch (e) {
        console.error('Error updating OTP attempts:', e);
      }

      throw error;
    }
  }

  private async fetchOTPByEmail(email: string): Promise<OTP | null> {
    const client = this.supabaseService.getClient();

    try {
      const { data, error } = await client
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('verified', false)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        code: data.code,
        email: data.email,
        expiresAt: new Date(data.expires_at),
        verified: data.verified,
        attempts: data.attempts,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error fetching OTP:', error);
      return null;
    }
  }
}
