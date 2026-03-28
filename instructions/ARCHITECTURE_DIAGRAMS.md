# Architecture & Data Flow Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Angular)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Login Component → OTP Component → Dashboard Component  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Forgot Password Component ← Password Reset Component   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Google Login Component ← OAuth Profile Component       │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────────────────────┘
                   │ HTTP Requests
                   ├─ /api/auth/otp/*
                   ├─ /api/auth/reset-password
                   ├─ /api/auth/google/*
                   │
┌──────────────────▼───────────────────────────────────────────────┐
│               BACKEND (Optional - Your Server)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express / Firebase Functions / Custom Backend          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │  Endpoints:                                        │ │   │
│  │  │  - POST /api/auth/reset-password                  │ │   │
│  │  │  - POST /api/auth/otp/* (optional)               │ │   │
│  │  │  - POST /api/auth/google/* (optional)            │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │  Dependencies:                                     │ │   │
│  │  │  - Supabase Admin SDK                             │ │   │
│  │  │  - Email Service (SendGrid/Mailgun/AWS SES)       │ │   │
│  │  │  - Rate Limiting Middleware                       │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────────┘
                   │ SQL / Authentication
                   │
┌──────────────────▼───────────────────────────────────────────────┐
│           SUPABASE (PostgreSQL + Auth)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Authentication Tables:                                 │   │
│  │  ├─ auth.users (Supabase managed)                       │   │
│  │  └─ auth.sessions (Supabase managed)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Application Tables (RLS Protected):                    │   │
│  │  ├─ users (User profiles)                              │   │
│  │  ├─ goals, health_history, progress, etc.             │   │
│  │  └─ [NEW] oauth_codes (OTP for 2FA)                   │   │
│  │  └─ [NEW] password_reset_tokens                        │   │
│  │  └─ [NEW] google_auth_tokens                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## OTP Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User Requests OTP                                               │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ Frontend Component  │
        │ requestOTP(email)   │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ AuthService.requestOTP()        │
        │ ├─ OTPService.generateAndSendOTP()
        │ └─ Returns: { success, expiresIn }
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ OTPService (Client-side)        │
        │ ├─ Generate 6-digit code        │
        │ ├─ Create expiry time (10 min)  │
        │ └─ Call email service TODO      │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Supabase Database               │
        │ ├─ INSERT into otp_codes        │
        │ │  - code: "123456"             │
        │ │  - email: "user@email.com"   │
        │ │  - expires_at: NOW() + 10min  │
        │ │  - verified: false            │
        │ │  - attempts: 0                │
        │ └─ Response: { success: true }  │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Email Service (TODO)            │
        │ ├─ Send email to user           │
        │ └─ Contains: OTP code, expiry   │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ User Receives Email             │
        │ Gets OTP code: 123456           │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ verifyOTP(email, code)          │
        │ Sends: { email, code: "123456" }│
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ AuthService.verifyOTP()         │
        │ Calls OTPService.verifyOTP()    │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ OTPService (Database Validation)        │
        │ ├─ SELECT * FROM otp_codes              │
        │ │  WHERE email = ? AND verified = false │
        │ ├─ Check if code matches                │
        │ ├─ Check if not expired                 │
        │ ├─ Check if attempts < 5                │
        │ └─ UPDATE verified = true               │
        └──────────┬──────────────────────────────┘
                   │
              ┌────┴────┐
              │          │
        ┌─────▼──┐  ┌────▼──────┐
        │ Success│  │ Fail      │
        │ Code   │  │ Increment │
        │Verified│  │ Attempts  │
        └────────┘  └───────────┘
```

---

## Password Reset Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User Clicks "Forgot Password"                                   │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ forgotPassword(email)           │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ AuthService.forgotPassword()    │
        │ ├─ PasswordResetService         │
        │ │  .requestPasswordReset()      │
        │ └─ Returns: { success, email }  │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ PasswordResetService            │
        │ ├─ Generate 32-char token       │
        │ ├─ Create expiry (1 hour)       │
        │ └─ Store in database            │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Supabase Database               │
        │ ├─ INSERT password_reset_tokens │
        │ │  - token: "abcd...xyz"       │
        │ │  - email: "user@email.com"  │
        │ │  - expires_at: NOW() + 1h    │
        │ │  - used: false               │
        │ └─ Response: success            │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Email Service (TODO)            │
        │ ├─ Build reset link with token  │
        │ ├─ Send to user email           │
        │ └─ Link: /reset-password?token= │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ User Receives Email             │
        │ Clicks reset link               │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ validateResetToken(token)       │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────────┐
        │ PasswordResetService                │
        │ ├─ Fetch token from database        │
        │ ├─ Verify token validity            │
        │ ├─ Check expiry                     │
        │ └─ Return token details             │
        └──────────┬──────────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ Shows password reset form        │
        │ User enters new password        │
        │ Sends: { token, email, newPass }│
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ AuthService.resetPassword()     │
        │ ├─ PasswordResetService         │
        │ │  .confirmPasswordReset()      │
        │ └─ Returns: { success }         │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ BACKEND ENDPOINT (TODO)         │
        │ ├─ POST /api/auth/reset-password│
        │ ├─ Validate token               │
        │ ├─ Update password with Admin   │
        │ └─ Return success/error         │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Backend Server                  │
        │ ├─ Verify reset token           │
        │ ├─ Call Supabase Admin API      │
        │ │  supabase.auth.admin          │
        │ │  .updateUserById(id, {        │
        │ │    password: newPassword      │
        │ │  })                           │
        │ └─ Mark token as used           │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Supabase Auth (Admin)           │
        │ ├─ Update user password         │
        │ ├─ Invalidate old sessions      │
        │ └─ Return success               │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Database Update                 │
        │ ├─ UPDATE password_reset_tokens │
        │ │  SET used = true              │
        │ └─ Success response             │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ Shows: "Password reset success" │
        │ Redirects: Login page           │
        └─────────────────────────────────┘
```

---

## Google OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User Clicks "Login with Google"                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ Triggers Google Sign-In         │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Browser                         │
        │ Redirects to Google OAuth       │
        │ https://accounts.google.com/... │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Google OAuth Consent Screen     │
        │ User grants permissions         │
        │ Authorizes app                  │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Browser Redirect                │
        │ Returns to:                     │
        │ /auth/callback?code=CODE        │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ Gets authorization code         │
        │ Calls handleGoogleAuth()        │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ AuthService.loginWithGoogle()   │
        │ ├─ Use Supabase OAuth flow      │
        │ └─ Gets access_token            │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ Supabase OAuth Handler                  │
        │ ├─ Exchange code for token              │
        │ ├─ Returns: access_token, user          │
        │ └─ Creates/links user in auth.users     │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ Received: access_token, user    │
        │ Calls fetchGoogleProfile()      │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ GoogleOAuthService                      │
        │ ├─ fetchGoogleUserProfile()             │
        │ ├─ GET /oauth2/v2/userinfo              │
        │ │  Authorization: Bearer access_token   │
        │ └─ Returns: Google profile data         │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Google API                      │
        │ Returns User Profile:           │
        │ ├─ id: "google_user_id"        │
        │ ├─ email: "user@gmail.com"     │
        │ ├─ name: "John Doe"            │
        │ ├─ picture: "https://..."      │
        │ └─ locale: "en"                │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ ├─ Update app user profile      │
        │ │  with Google data             │
        │ └─ Call storeGoogleToken()      │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ GoogleOAuthService              │
        │ ├─ storeGoogleAuthToken()       │
        │ └─ Save token to database       │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Supabase Database               │
        │ ├─ INSERT google_auth_tokens    │
        │ │  - user_id: UUID              │
        │ │  - google_id: "google_id"     │
        │ │  - access_token: "token"      │
        │ │  - refresh_token: "refresh"   │
        │ │  - token_expiry: NOW() + 1h   │
        │ │  - email: "user@gmail.com"    │
        │ │  - scope: "openid profile email"
        │ └─ Response: success            │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Component              │
        │ ├─ User logged in               │
        │ ├─ JWT token obtained           │
        │ └─ Redirect to dashboard        │
        └─────────────────────────────────┘
```

---

## Database Schema Relationships

```
┌───────────────────┐
│   auth.users      │  (Managed by Supabase)
│ ┌───────────────┐ │
│ │ id (UUID)     │ │
│ │ email         │ │
│ │ password_hash │ │
│ │ created_at    │ │
│ └───────────────┘ │
└────────┬──────────┘
         │
         ├──────────┬──────────────┬─────────────────┐
         │          │              │                 │
         │          │              │                 │
┌────────▼──┐  ┌────▼─────┐  ┌────▼──────┐  ┌──────▼────────┐
│   users   │  │goals     │  │progress  │  │health_history│
│ ┌───────┐ │  │ ┌──────┐ │  │┌───────┐ │  │┌────────────┐│
│ │id(FK) │ │  │ │id    │ │  ││id     │ │  ││id         ││
│ │email  │ │  │ │user_ │ │  ││user_id│ │  ││user_id(FK)││
│ │profile│ │  │ │id(FK)│ │  ││date   │ │  ││record_date││
│ │       │ │  │ │title │ │  ││sober_ │ │  ││substance  ││
│ └───────┘ │  │ │status│ │  ││days   │ │  ││           ││
└───────────┘  │ └──────┘ │  │└───────┘ │  │└────────────┘│
               └──────────┘  └──────────┘  └───────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   otp_codes      │  │password_reset_   │  │google_auth_      │
│  [NEW - NoSQL]   │  │tokens [NEW-RDBMS]│  │tokens [NEW-RDBMS]│
│ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │
│ │id            │ │  │ │id            │ │  │ │id            │ │
│ │user_id(FK)   │ │  │ │user_id(FK)   │ │  │ │user_id(FK)   │ │
│ │email         │ │  │ │email         │ │  │ │google_id     │ │
│ │code(6-digit) │ │  │ │token(32-char)│ │  │ │access_token  │ │
│ │expires_at    │ │  │ │expires_at    │ │  │ │refresh_token │ │
│ │verified      │ │  │ │used          │ │  │ │token_expiry  │ │
│ │attempts      │ │  │ │created_at    │ │  │ │email         │ │
│ │created_at    │ │  │ │updated_at    │ │  │ │scope         │ │
│ └──────────────┘ │  │ └──────────────┘ │  │ │created_at    │ │
└──────────────────┘  └──────────────────┘  │ │updated_at    │ │
                                             │ └──────────────┘ │
                                             └──────────────────┘
```

---

## Authentication Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ENTRY POINTS                        │
├──────────────┬──────────────────────┬──────────────────────┤
│  Email/Pass  │  Reset Password      │  Google/Facebook     │
│              │                      │                      │
└────┬─────────┴──────────┬───────────┴──────────┬───────────┘
     │                    │                      │
     │                    │                      │
┌────▼─────────┐  ┌──────▼──────────┐  ┌───────▼──────────┐
│ Normal Login │  │ Forgot Password  │  │  Social Login    │
│              │  │                  │  │                  │
│ 1. Email     │  │ 1. Email         │  │ 1. OAuth consent │
│ 2. Password  │  │ 2. Reset email   │  │ 2. Profile fetch │
│ 3. Verify    │  │ 3. Click link    │  │ 3. User creation │
│ 4. Login     │  │ 4. New password  │  │ 4. Token store   │
│              │  │ 5. Login         │  │ 5. Login         │
└────┬─────────┘  └──────┬──────────┘  └───────┬──────────┘
     │                   │                     │
     └─────────┬─────────┴─────────┬───────────┘
               │                   │
         ┌─────▼───────────────────▼─────┐
         │  AUTHENTICATION SUCCESS        │
         │  ├─ JWT Token issued           │
         │  ├─ User session created       │
         │  ├─ RLS policies activated     │
         │  └─ Access to user data        │
         └──────────┬────────────────────┘
                    │
         ┌──────────▼─────────────┐
         │  DASHBOARD / APP       │
         │  Can now access:       │
         │  ├─ User profile       │
         │  ├─ Goals & progress   │
         │  ├─ Health history     │
         │  └─ Support groups     │
         └───────────────────────┘
```

---

## Data Security Model

```
┌──────────────────────────────────────────────────────────┐
│                 SECURITY LAYERS                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: HTTPS/TLS                                     │
│  ├─ All traffic encrypted in transit                    │
│  ├─ Certificates from trusted authorities               │
│  └─ HSTS enabled in production                          │
│                                                          │
│  Layer 2: AUTHENTICATION                                │
│  ├─ Supabase Auth handles password hashing              │
│  ├─ JWT tokens for session management                   │
│  ├─ OAuth 2.0 for social login                          │
│  └─ Refresh token rotation                              │
│                                                          │
│  Layer 3: ROW-LEVEL SECURITY (RLS)                      │
│  ├─ otp_codes: Users see only their own                │
│  ├─ password_reset_tokens: Users see only their own    │
│  ├─ google_auth_tokens: Users see only their own       │
│  ├─ users: Users see only their own profile             │
│  └─ Database-enforced, cannot be bypassed               │
│                                                          │
│  Layer 4: INPUT VALIDATION                              │
│  ├─ Frontend: Type checking, form validation            │
│  ├─ Backend: Constraint validation                      │
│  └─ Database: Constraints and triggers                  │
│                                                          │
│  Layer 5: RATE LIMITING                                 │
│  ├─ OTP: Max requests per email per hour                │
│  ├─ Password reset: Max requests per email per hour     │
│  ├─ Failed attempts: Max 5 per OTP session              │
│  └─ Prevents brute force attacks                        │
│                                                          │
│  Layer 6: AUDIT LOGGING (TODO)                          │
│  ├─ All auth events logged                              │
│  ├─ Failed attempts tracked                             │
│  ├─ Suspicious activity alerted                         │
│  └─ Compliance and forensics                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Multiple authentication options
- ✅ Secure token management
- ✅ Database-level security
- ✅ Scalable design
- ✅ Production-ready implementation


<br><br>