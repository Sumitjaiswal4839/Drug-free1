import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
<div class="page-background">
  <div class="glass-orb orb-1"></div>
  <div class="glass-orb orb-2"></div>
  <div class="glass-orb orb-3"></div>

  <div class="auth-container">
    <div class="brand-panel">
      <div class="brand-content">
        <div class="logo-box">
          <i class="fas fa-heart-pulse"></i>
        </div>
        <h1>Welcome Back</h1>
        <p>Reconnect with your journey to a balanced and healthy life.</p>
        <div class="feature-pills">
          <div class="pill"><i class="fas fa-shield-alt"></i> Secure</div>
          <div class="pill"><i class="fas fa-user-check"></i> Private</div>
          <div class="pill"><i class="fas fa-leaf"></i> Growth</div>
        </div>
      </div>
    </div>

    <div class="form-panel">
      <div class="form-wrapper">
        <div class="header-text">
          <h2>Sign In</h2>
          <p class="subtitle">Enter your details to access your dashboard</p>
        </div>

        <div *ngIf="error" class="alert-box error">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Google Login Container -->
        <div id="googleBtnContainer" class="google-container"></div>

        <div class="divider">
          <span>or sign in with email</span>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="login()" class="auth-form">
          <div class="input-group">
            <label for="email">Email Address</label>
            <div class="input-field" [class.focused]="isEmailFocused">
              <i class="fas fa-envelope icon"></i>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="hello@example.com"
                (focus)="isEmailFocused = true"
                (blur)="isEmailFocused = false"
              />
            </div>
            <span class="error-text" *ngIf="email?.invalid && email?.touched">
              Valid email is required
            </span>
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <div class="input-field" [class.focused]="isPasswordFocused">
              <i class="fas fa-lock icon"></i>
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                (focus)="isPasswordFocused = true"
                (blur)="isPasswordFocused = false"
              />
              <button type="button" class="toggle-pwd" (click)="togglePasswordVisibility()">
                <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <label class="custom-checkbox">
              <input type="checkbox" />
              <span class="checkmark"></span>
              Remember me
            </label>
            <a class="text-link" (click)="goToForgotPassword()">Forgot password?</a>
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading || loginForm.invalid">
            <span *ngIf="!loading">Sign In</span>
            <div class="spinner" *ngIf="loading"></div>
          </button>
        </form>

        <p class="switch-mode">
          Don't have an account? <a (click)="goToRegister()">Sign up now</a>
        </p>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    :host {
      --primary: #4F46E5;
      --primary-hover: #4338CA;
      --bg-color: #0F172A;
      --surface: rgba(30, 41, 59, 0.7);
      --surface-border: rgba(255, 255, 255, 0.1);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --input-bg: rgba(15, 23, 42, 0.6);
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .page-background {
      min-height: 100vh;
      background-color: var(--bg-color);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    /* Abstract shapes */
    .glass-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.5;
    }
    .orb-1 {
      top: -10%; right: -5%; width: 500px; height: 500px; background: #4F46E5;
      animation: float 10s ease-in-out infinite alternate;
    }
    .orb-2 {
      bottom: -10%; left: -10%; width: 600px; height: 600px; background: #06B6D4;
      animation: float 12s ease-in-out infinite alternate-reverse;
    }
    .orb-3 {
      top: 40%; left: 30%; width: 300px; height: 300px; background: #8B5CF6;
      animation: float 8s ease-in-out infinite alternate;
    }

    @keyframes float {
      0% { transform: translateY(0px) scale(1); }
      100% { transform: translateY(-50px) scale(1.1); }
    }

    .auth-container {
      position: relative;
      z-index: 10;
      display: flex;
      width: 100%;
      max-width: 1000px;
      min-height: 600px;
      border-radius: 24px;
      overflow: hidden;
      background: var(--surface);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--surface-border);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .brand-panel {
      flex: 1;
      padding: 3rem;
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-right: 1px solid var(--surface-border);
    }

    .brand-content {
      max-width: 400px;
      color: var(--text);
    }

    .logo-box {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.5);
    }

    .brand-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .brand-content p {
      color: var(--text-muted);
      font-size: 1.1rem;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .feature-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .pill {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .form-panel {
      flex: 1;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: rgba(15, 23, 42, 0.4);
    }

    .form-wrapper {
      max-width: 400px;
      width: 100%;
      margin: 0 auto;
    }

    .header-text {
      margin-bottom: 2rem;
      text-align: center;
    }

    .header-text h2 {
      color: var(--text);
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: var(--text-muted);
      margin: 0;
    }

    .btn-social {
      width: 100%;
      padding: 0.875rem;
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text);
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-social:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .google-icon {
      width: 20px;
      height: 20px;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 2rem 0;
    }

    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--surface-border);
    }

    .divider span {
      padding: 0 1rem;
      color: var(--text-muted);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-group {
      margin-bottom: 1.5rem;
    }

    .input-group label {
      display: block;
      color: var(--text);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .input-field {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--input-bg);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .input-field.focused {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
    }

    .icon {
      padding: 0 1rem;
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .input-field input {
      flex: 1;
      width: 100%;
      background: transparent;
      border: none;
      padding: 0.875rem 0;
      color: var(--text);
      font-size: 1rem;
    }

    .input-field input:focus {
      outline: none;
    }

    .input-field input::placeholder {
      color: rgba(148, 163, 184, 0.5);
    }

    .toggle-pwd {
      background: none;
      border: none;
      padding: 0 1rem;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: color 0.3s ease;
    }

    .toggle-pwd:hover {
      color: var(--text);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      font-size: 0.875rem;
    }

    .custom-checkbox {
      display: flex;
      align-items: center;
      color: var(--text-muted);
      cursor: pointer;
      position: relative;
    }

    .custom-checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkmark {
      height: 18px;
      width: 18px;
      background-color: var(--input-bg);
      border: 1px solid var(--surface-border);
      border-radius: 4px;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .custom-checkbox input:checked ~ .checkmark {
      background-color: var(--primary);
      border-color: var(--primary);
    }

    .custom-checkbox input:checked ~ .checkmark:after {
      content: '\\f00c';
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      color: white;
      font-size: 10px;
    }

    .text-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .text-link:hover {
      color: #818CF8;
    }

    .btn-primary {
      width: 100%;
      background: linear-gradient(135deg, var(--primary) 0%, #3B82F6 100%);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .switch-mode {
      text-align: center;
      margin-top: 2rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .switch-mode a {
      color: var(--text);
      font-weight: 600;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .switch-mode a:hover {
      color: var(--primary);
    }

    .alert-box {
      padding: 1rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .alert-box.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #FCA5A5;
    }

    .error-text {
      color: #FCA5A5;
      font-size: 0.75rem;
      margin-top: 0.5rem;
      display: block;
    }

    @media (max-width: 768px) {
      .auth-container {
        flex-direction: column;
      }
      .brand-panel {
        padding: 2rem;
        display: none; /* Hide on mobile to focus on form */
      }
      .form-panel {
        padding: 2rem;
      }
      .auth-container {
        min-height: auto;
      }
    }
  `]
})
export class AuthLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  isEmailFocused = false;
  isPasswordFocused = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    setTimeout(() => {
      const container = document.getElementById('googleBtnContainer');
      if (container) {
        this.authService.renderGoogleButton(
          container,
          (user) => {
            this.router.navigate(['/dashboard']);
          },
          (err) => {
            this.error = 'Google login failed: ' + err;
          }
        );
      }
    }, 100);
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.error = 'Please review your input';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;
    this.error = '';

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = typeof err === 'string' ? err : (err?.message || 'Login failed. Invalid credentials.');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }
}
