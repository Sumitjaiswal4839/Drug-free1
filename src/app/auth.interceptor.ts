import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.getAccessToken().pipe(
      take(1),
      switchMap((token) => {
        if (token) {
          request = this.addToken(request, token);
        }
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return this.handle401Error(request, next);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.supabaseService.refreshSession()).pipe(
      switchMap((response) => {
        if (response.data?.session?.access_token) {
          const newToken = response.data.session.access_token;
          return next.handle(this.addToken(request, newToken));
        }
        this.authService.logout().subscribe();
        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError(() => {
        this.authService.logout().subscribe();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
}
