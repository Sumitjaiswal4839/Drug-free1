import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

export interface GoogleUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  locale: string;
  phoneNumber?: string;
}

export interface GoogleAuthToken {
  id: string;
  userId: string;
  googleId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: Date;
  email: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleOAuthService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Fetch Google user profile from Google API
   * Requires valid Google access token
   */
  public fetchGoogleUserProfile(accessToken: string): Observable<GoogleUserProfile> {
    return from(this.getGoogleProfile(accessToken)).pipe(
      catchError((error) => {
        console.error('Error fetching Google profile:', error);
        return throwError(() => ({
          message: 'Failed to fetch Google profile',
          error,
        }));
      })
    );
  }

  /**
   * Store Google OAuth token for later use
   * Used for accessing Google services on behalf of user
   */
  public storeGoogleAuthToken(
    userId: string,
    googleId: string,
    accessToken: string,
    email: string,
    scope: string,
    refreshToken?: string
  ): Observable<GoogleAuthToken> {
    return from(
      this.saveGoogleToken(
        userId,
        googleId,
        accessToken,
        email,
        scope,
        refreshToken
      )
    ).pipe(
      catchError((error) => {
        console.error('Error storing Google token:', error);
        return throwError(() => ({
          message: 'Failed to store Google authentication token',
          error,
        }));
      })
    );
  }

  /**
   * Get stored Google token for a user
   */
  public getStoredGoogleToken(userId: string): Observable<GoogleAuthToken | null> {
    return from(this.fetchStoredGoogleToken(userId)).pipe(
      catchError((error) => {
        console.error('Error fetching stored Google token:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh Google access token using refresh token
   */
  public refreshGoogleAccessToken(
    refreshToken: string
  ): Observable<{ accessToken: string; expiresIn: number }> {
    return from(this.refreshToken(refreshToken)).pipe(
      catchError((error) => {
        console.error('Error refreshing Google token:', error);
        return throwError(() => ({
          message: 'Failed to refresh Google token',
          error,
        }));
      })
    );
  }

  /**
   * Revoke Google OAuth access
   */
  public revokeGoogleAccess(userId: string): Observable<boolean> {
    return from(this.revokeGoogleToken(userId)).pipe(
      catchError((error) => {
        console.error('Error revoking Google access:', error);
        return throwError(() => ({
          message: 'Failed to revoke Google access',
          error,
        }));
      })
    );
  }

  private async getGoogleProfile(accessToken: string): Promise<GoogleUserProfile> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Google profile');
      }

      const data = await response.json();

      return {
        id: data.id,
        email: data.email,
        firstName: data.given_name || '',
        lastName: data.family_name || '',
        picture: data.picture || '',
        locale: data.locale || 'en',
        phoneNumber: data.phone_number,
      };
    } catch (error) {
      throw error;
    }
  }

  private async saveGoogleToken(
    userId: string,
    googleId: string,
    accessToken: string,
    email: string,
    scope: string,
    refreshToken?: string
  ): Promise<GoogleAuthToken> {
    const client = this.supabaseService.getClient();

    try {
      // Check if token already exists for this user
      const { data: existingToken } = await client
        .from('google_auth_tokens')
        .select('id')
        .eq('user_id', userId)
        .single();

      const tokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry

      if (existingToken) {
        // Update existing token
        const { data, error } = await client
          .from('google_auth_tokens')
          .update({
            google_id: googleId,
            access_token: accessToken,
            refresh_token: refreshToken || null,
            token_expiry: tokenExpiry.toISOString(),
            scope,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingToken.id)
          .select()
          .single();

        if (error) throw error;

        return this.mapGoogleAuthToken(data);
      } else {
        // Create new token entry
        const { data, error } = await client
          .from('google_auth_tokens')
          .insert([
            {
              user_id: userId,
              google_id: googleId,
              access_token: accessToken,
              refresh_token: refreshToken || null,
              token_expiry: tokenExpiry.toISOString(),
              email,
              scope,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        return this.mapGoogleAuthToken(data);
      }
    } catch (error) {
      throw error;
    }
  }

  private async fetchStoredGoogleToken(userId: string): Promise<GoogleAuthToken | null> {
    const client = this.supabaseService.getClient();

    try {
      const { data, error } = await client
        .from('google_auth_tokens')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapGoogleAuthToken(data);
    } catch (error) {
      console.error('Error fetching stored Google token:', error);
      return null;
    }
  }

  private async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      // This requires your Google OAuth credentials (client_id and client_secret)
      // Should be handled by backend for security
      // For frontend, use a backend endpoint instead
      throw new Error(
        'Token refresh should be handled by backend. Use POST /api/auth/refresh-google-token'
      );
    } catch (error) {
      throw error;
    }
  }

  private async revokeGoogleToken(userId: string): Promise<boolean> {
    const client = this.supabaseService.getClient();

    try {
      const { error } = await client
        .from('google_auth_tokens')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  private mapGoogleAuthToken(data: any): GoogleAuthToken {
    return {
      id: data.id,
      userId: data.user_id,
      googleId: data.google_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenExpiry: new Date(data.token_expiry),
      email: data.email,
      scope: data.scope,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
