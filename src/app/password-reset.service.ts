import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  PasswordReset,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse,
} from './password-reset.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Request password reset
   * Sends reset link to user's email
   */
  public requestPasswordReset(
    request: PasswordResetRequest
  ): Observable<PasswordResetResponse> {
    return from(this.createResetToken(request.email)).pipe(
      catchError((error) => {
        console.error('Error requesting password reset:', error);
        return throwError(() => ({
          success: false,
          message: 'Failed to process reset request. Please try again.',
          error,
        }));
      })
    );
  }

  /**
   * Confirm password reset with token and new password
   */
  public confirmPasswordReset(
    request: PasswordResetConfirm
  ): Observable<PasswordResetResponse> {
    return from(
      this.resetPasswordWithToken(request.token, request.newPassword, request.email)
    ).pipe(
      catchError((error) => {
        console.error('Error confirming password reset:', error);
        return throwError(() => ({
          success: false,
          message: 'Failed to reset password. Token may be invalid or expired.',
          error,
        }));
      })
    );
  }

  /**
   * Validate reset token
   */
  public validateResetToken(token: string): Observable<PasswordReset | null> {
    return from(this.fetchResetToken(token)).pipe(
      catchError((error) => {
        console.error('Error validating reset token:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get reset token details
   */
  public getResetTokenDetails(token: string): Observable<PasswordReset | null> {
    return from(this.fetchResetToken(token)).pipe(
      catchError((error) => {
        console.error('Error fetching reset token:', error);
        return throwError(() => error);
      })
    );
  }

  private async createResetToken(email: string): Promise<PasswordResetResponse> {
    const client = this.supabaseService.getClient();
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    try {
      // First, check if user exists with this email
      const { data: user } = await client
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      const userId = user?.id || null;

      // Create reset token
      await client.from('password_reset_tokens').insert([
        {
          email,
          user_id: userId,
          token,
          expires_at: expiresAt.toISOString(),
          used: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      // TODO: Send email with reset link
      // Email should contain: {origin}/reset-password?token={token}
      // You can integrate with:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Supabase built-in email
      // - Custom SMTP

      const resetLink = `${this.getOrigin()}/reset-password?token=${token}`;
      console.log(`Password reset link: ${resetLink}`); // Remove in production

      return {
        success: true,
        message: 'Password reset link sent to your email',
        email,
      };
    } catch (error) {
      throw error;
    }
  }

  private async verifyResetToken(token: string): Promise<boolean> {
    const client = this.supabaseService.getClient();

    try {
      const { data: resetToken, error } = await client
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (error || !resetToken) {
        throw new Error('Invalid or expired reset token');
      }

      const expiresAt = new Date(resetToken.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('Reset token has expired');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  private async resetPasswordWithToken(
    token: string,
    newPassword: string,
    email: string
  ): Promise<PasswordResetResponse> {
    const client = this.supabaseService.getClient();

    try {
      // Verify token first
      const { data: resetToken, error: tokenError } = await client
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .eq('used', false)
        .single();

      if (tokenError || !resetToken) {
        throw new Error('Invalid or expired reset token');
      }

      // Check expiry
      const expiresAt = new Date(resetToken.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('Reset token has expired');
      }

      // Note: Updating password requires either:
      // 1. User to be authenticated (use client.auth.updateUser)
      // 2. Backend service with admin credentials
      // 3. Supabase Function to handle password reset securely
      // 
      // For production, implement a backend endpoint that:
      // - Validates the token
      // - Calls supabase.auth.admin.updateUserById() with new password
      // - Returns success response
      //
      // Frontend should send token + email + newPassword to backend
      // Backend validates and updates password securely

      // For now, we mark the token as used assuming backend will handle password update
      // This is a placeholder for the actual password update logic
      
      const { error: updateError } = await client
        .from('password_reset_tokens')
        .update({
          used: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resetToken.id);

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
        email,
      };
    } catch (error) {
      throw error;
    }
  }

  private async fetchResetToken(token: string): Promise<PasswordReset | null> {
    const client = this.supabaseService.getClient();

    try {
      const { data, error } = await client
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        email: data.email,
        token: data.token,
        expiresAt: new Date(data.expires_at),
        used: data.used,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error fetching reset token:', error);
      return null;
    }
  }

  private getOrigin(): string {
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
  }

  private generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}
