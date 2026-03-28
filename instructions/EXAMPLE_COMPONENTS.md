# Example Components - Using OTP, Password Reset & Google OAuth

## 1. OTP Verification Component

```typescript
// src/app/components/otp-verification/otp-verification.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OTPVerificationComponent implements OnInit {
  otpForm!: FormGroup;
  email: string = '';
  loading = false;
  error = '';
  success = false;
  otpSent = false;
  expiresIn = 0;
  remainingTime = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Get email from navigation state or session
    this.email = localStorage.getItem('pendingOtpEmail') || '';
  }

  initializeForm(): void {
    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  requestOTP(): void {
    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.requestOTP(this.email).subscribe(
      (response) => {
        this.loading = false;
        this.otpSent = true;
        this.expiresIn = response.expiresIn;
        this.startTimer();
        console.log('OTP sent successfully');
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Failed to send OTP';
      }
    );
  }

  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.error = 'Please enter a valid 6-digit OTP code';
      return;
    }

    const code = this.otpForm.get('code')?.value;
    this.loading = true;
    this.error = '';

    this.authService.verifyOTP(this.email, code).subscribe(
      (response) => {
        this.loading = false;
        this.success = true;
        // Proceed to next step (login or password reset)
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Invalid or expired OTP';
        // Clear the input for retry
        this.otpForm.reset();
      }
    );
  }

  resendOTP(): void {
    this.loading = true;
    this.error = '';

    this.authService.resendOTP(this.email).subscribe(
      (response) => {
        this.loading = false;
        this.expiresIn = response.expiresIn;
        this.startTimer();
        console.log('OTP resent successfully');
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Failed to resend OTP';
      }
    );
  }

  private startTimer(): void {
    this.remainingTime = this.expiresIn;
    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
```

```html
<!-- src/app/components/otp-verification/otp-verification.component.html -->

<div class="otp-container">
  <h2>Verify Your Email</h2>
  
  <div *ngIf="!otpSent" class="email-input">
    <input 
      type="email" 
      [(ngModel)]="email" 
      placeholder="Enter your email"
      class="input-field"
    />
    <button 
      (click)="requestOTP()" 
      [disabled]="loading"
      class="btn btn-primary"
    >
      {{ loading ? 'Sending...' : 'Send OTP' }}
    </button>
  </div>

  <div *ngIf="otpSent" class="otp-input">
    <form [formGroup]="otpForm">
      <div class="form-group">
        <label for="code">Enter 6-digit OTP Code</label>
        <input 
          id="code"
          type="text" 
          formControlName="code" 
          placeholder="000000"
          maxlength="6"
          class="input-field"
          [class.error]="otpForm.get('code')?.invalid && otpForm.get('code')?.touched"
        />
        <small class="time-left">Expires in: {{ formattedTime }}</small>
      </div>

      <button 
        (click)="verifyOTP()" 
        [disabled]="loading || otpForm.invalid"
        class="btn btn-primary"
      >
        {{ loading ? 'Verifying...' : 'Verify OTP' }}
      </button>
    </form>

    <button 
      (click)="resendOTP()" 
      [disabled]="loading || remainingTime > 0"
      class="btn btn-link"
    >
      Didn't receive code? Resend
    </button>
  </div>

  <div *ngIf="error" class="alert alert-error">
    {{ error }}
  </div>

  <div *ngIf="success" class="alert alert-success">
    OTP verified successfully!
  </div>
</div>
```

---

## 2. Forgot Password Component

```typescript
// src/app/components/forgot-password/forgot-password.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  step: 'request' | 'reset' | 'success' = 'request';
  requestForm!: FormGroup;
  resetForm!: FormGroup;
  loading = false;
  error = '';
  email = '';
  resetToken = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForms();
  }

  initializeForms(): void {
    // Step 1: Request password reset
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Step 2: Reset password
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  requestPasswordReset(): void {
    if (this.requestForm.invalid) {
      this.error = 'Please enter a valid email';
      return;
    }

    this.email = this.requestForm.get('email')?.value;
    this.loading = true;
    this.error = '';

    this.authService.forgotPassword(this.email).subscribe(
      (response) => {
        this.loading = false;
        console.log('Password reset email sent');
        // User should check email for reset link
        // In development, you can show the token in console
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Failed to send reset email';
      }
    );
  }

  validateResetToken(): void {
    if (!this.resetToken) {
      this.error = 'Please enter the reset token from email';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.validateResetToken(this.resetToken).subscribe(
      (token) => {
        this.loading = false;
        if (token) {
          this.step = 'reset';
        } else {
          this.error = 'Invalid or expired reset token';
        }
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Invalid reset token';
      }
    );
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.error = 'Please check your password inputs';
      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;
    this.loading = true;
    this.error = '';

    this.authService.resetPassword(this.resetToken, newPassword, this.email).subscribe(
      (response) => {
        this.loading = false;
        this.step = 'success';
        // Redirect to login after 2 seconds
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Failed to reset password';
      }
    );
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
}
```

```html
<!-- src/app/components/forgot-password/forgot-password.component.html -->

<div class="forgot-password-container">
  <!-- Step 1: Request Reset -->
  <div *ngIf="step === 'request'" class="step-1">
    <h2>Forgot Your Password?</h2>
    <p>Enter your email address and we'll send you a password reset link.</p>

    <form [formGroup]="requestForm">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input 
          id="email"
          type="email" 
          formControlName="email" 
          placeholder="your@email.com"
          class="input-field"
        />
      </div>

      <button 
        (click)="requestPasswordReset()" 
        [disabled]="loading || requestForm.invalid"
        class="btn btn-primary"
      >
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>

    <a href="/login" class="btn btn-link">Back to Login</a>
  </div>

  <!-- Step 2: Enter Token & New Password -->
  <div *ngIf="step === 'reset'" class="step-2">
    <h2>Reset Your Password</h2>

    <div class="form-group">
      <label for="token">Reset Token</label>
      <input 
        id="token"
        type="text" 
        [(ngModel)]="resetToken" 
        placeholder="Paste token from email"
        class="input-field"
      />
      <button 
        (click)="validateResetToken()" 
        [disabled]="loading"
        class="btn btn-secondary"
      >
        {{ loading ? 'Validating...' : 'Validate Token' }}
      </button>
    </div>

    <form *ngIf="step === 'reset'" [formGroup]="resetForm">
      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input 
          id="newPassword"
          type="password" 
          formControlName="newPassword" 
          placeholder="New password"
          class="input-field"
        />
        <small>At least 8 characters</small>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          id="confirmPassword"
          type="password" 
          formControlName="confirmPassword" 
          placeholder="Confirm password"
          class="input-field"
        />
      </div>

      <button 
        (click)="resetPassword()" 
        [disabled]="loading || resetForm.invalid"
        class="btn btn-primary"
      >
        {{ loading ? 'Resetting...' : 'Reset Password' }}
      </button>
    </form>
  </div>

  <!-- Step 3: Success -->
  <div *ngIf="step === 'success'" class="step-3 alert alert-success">
    <h2>Password Reset Successful!</h2>
    <p>Your password has been reset. Redirecting to login...</p>
  </div>

  <!-- Error Display -->
  <div *ngIf="error" class="alert alert-error">
    {{ error }}
  </div>
</div>
```

---

## 3. Google OAuth Login Component

```typescript
// src/app/components/google-login/google-login.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

declare var google: any; // Google Sign-In API

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {
  loading = false;
  error = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize Google Sign-In button
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    // Assuming you have Google API loaded
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // From environment.ts
        callback: this.handleCredentialResponse.bind(this)
      });
      
      google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  private handleCredentialResponse(response: any): void {
    // response.credential is the JWT token from Google
    const token = response.credential;
    
    // Decode JWT to get user info (or use Google API)
    this.loading = true;
    this.error = '';

    // Extract access token or call Google API
    this.authService.fetchGoogleProfile(token).subscribe(
      (profile) => {
        console.log('Google Profile:', profile);
        
        // Get current user ID (should be from auth context)
        const userId = 'user-uuid-here'; // Get from AuthService
        
        // Store the Google token for later use
        this.authService.storeGoogleToken(
          userId,
          profile.id,
          token,
          profile.email,
          'openid profile email'
        ).subscribe(
          (result) => {
            this.loading = false;
            console.log('Google token stored');
            // Update user profile with Google data
            this.updateUserProfile(profile);
            // Redirect to dashboard
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.loading = false;
            this.error = 'Failed to store Google credentials';
          }
        );
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Failed to authenticate with Google';
      }
    );
  }

  private updateUserProfile(profile: any): void {
    // Update user profile with Google data
    // You'll need a user service method for this
    console.log('Updating profile with Google data:', profile);
  }

  disconnectGoogle(): void {
    const userId = 'user-uuid-here'; // Get from AuthService
    
    this.authService.revokeGoogleAccess(userId).subscribe(
      (success) => {
        console.log('Google access revoked');
      },
      (error) => {
        this.error = 'Failed to revoke Google access';
      }
    );
  }
}
```

```html
<!-- src/app/components/google-login/google-login.component.html -->

<div class="google-login-container">
  <div id="googleSignInButton" class="google-signin-button"></div>
  
  <div *ngIf="error" class="alert alert-error">
    {{ error }}
  </div>

  <div *ngIf="loading" class="loading-spinner">
    <p>Authenticating with Google...</p>
  </div>

  <!-- Show disconnect button if already connected -->
  <button 
    (click)="disconnectGoogle()" 
    class="btn btn-secondary"
  >
    Disconnect Google Account
  </button>
</div>
```

---

## 4. Complete Login Component (Using All Three)

```typescript
// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  showForgotPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.error = 'Please enter valid email and password';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;
    this.error = '';

    this.authService.login(email, password).subscribe(
      (response) => {
        this.loading = false;
        // Save email for OTP verification if needed
        localStorage.setItem('pendingOtpEmail', email);
        
        // Optional: Request OTP for 2FA
        // this.authService.requestOTP(email).subscribe(...);
        
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.loading = false;
        this.error = error?.message || 'Login failed';
      }
    );
  }

  goToForgotPassword(): void {
    this.showForgotPassword = true;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
```

```html
<!-- src/app/components/login/login.component.html -->

<div class="login-container">
  <div class="login-card">
    <h1>Welcome Back</h1>
    
    <form [formGroup]="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email"
          type="email" 
          formControlName="email" 
          placeholder="your@email.com"
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          type="password" 
          formControlName="password" 
          placeholder="Your password"
          class="input-field"
        />
      </div>

      <button 
        (click)="login()" 
        [disabled]="loading || loginForm.invalid"
        class="btn btn-primary btn-full"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <!-- Divider -->
    <div class="divider">Or</div>

    <!-- Google Login -->
    <app-google-login></app-google-login>

    <!-- Error Display -->
    <div *ngIf="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Links -->
    <div class="links">
      <button (click)="goToForgotPassword()" class="btn btn-link">
        Forgot Password?
      </button>
      <span> | </span>
      <button (click)="goToRegister()" class="btn btn-link">
        Create Account
      </button>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div *ngIf="showForgotPassword" class="modal">
    <div class="modal-content">
      <app-forgot-password></app-forgot-password>
    </div>
  </div>
</div>
```

---

## Usage Instructions

### 1. Import in App Module
```typescript
import { OTPVerificationComponent } from './components/otp-verification/otp-verification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    OTPVerificationComponent,
    ForgotPasswordComponent,
    GoogleLoginComponent,
    LoginComponent
  ]
})
export class AppModule { }
```

### 2. Update Routes
```typescript
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'verify-otp', component: OTPVerificationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
];
```

### 3. Add Styles
```css
.otp-container, .forgot-password-container, .google-login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.alert {
  padding: 12px;
  margin: 10px 0;
  border-radius: 4px;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
```

---

All components are ready to use! Customize styles and behavior based on your needs. 🚀


<br><br>