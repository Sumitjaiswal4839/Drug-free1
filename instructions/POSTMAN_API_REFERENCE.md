# Postman API Reference - Drug Recovery Angular App

## Base URL
- **Development**: `http://localhost:4200`
- **Production**: `https://your-domain.com`

## Authentication

All endpoints that require authentication should include the Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the JWT token from Supabase authentication response after login.

---

## Authentication Endpoints

### 1. Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-03-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

### 2. Login with Email/Password
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

### 3. Login with Google
```
GET /api/auth/google
Headers:
  Authorization: Bearer (optional)

Response (200):
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}

// After user authorizes on Google, they'll be redirected to:
GET /auth/callback?code=CODE&state=STATE
```

### 4. Logout
```
POST /api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "message": "Logged out successfully"
}
```

---

## OTP (One-Time Password) - Two-Factor Authentication

### 1. Request OTP
**Use Case**: Generate and send OTP code to user's email for verification
```
POST /api/auth/otp/request
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to your email",
  "expiresIn": 600
}

Error Response (400):
{
  "success": false,
  "message": "Failed to send OTP. Please try again."
}
```

### 2. Verify OTP
**Use Case**: Verify the OTP code provided by user
```
POST /api/auth/otp/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}

Response (200):
{
  "success": true,
  "message": "OTP verified successfully",
  "expiresIn": 0
}

Error Response (400):
{
  "success": false,
  "message": "Invalid or expired OTP. Please try again."
}
```

### 3. Resend OTP
**Use Case**: Request a new OTP code (rate-limited to prevent abuse)
```
POST /api/auth/otp/resend
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to your email",
  "expiresIn": 600
}
```

---

## Password Reset - Forgot Password Flow

### 1. Request Password Reset
**Use Case**: User forgot password, request reset link
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset link sent to your email",
  "email": "user@example.com"
}

Response (404):
{
  "success": false,
  "message": "Email not found"
}
```

### 2. Validate Reset Token
**Use Case**: Verify reset token before showing new password form
```
GET /api/auth/reset-password/validate?token=RESET_TOKEN

Response (200):
{
  "success": true,
  "message": "Token is valid",
  "email": "user@example.com",
  "expiresAt": "2024-03-01T01:00:00Z"
}

Response (400):
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

### 3. Confirm Password Reset
**Use Case**: Set new password using reset token
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "RESET_TOKEN",
  "email": "user@example.com",
  "newPassword": "NewSecurePassword123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully",
  "email": "user@example.com"
}

Response (400):
{
  "success": false,
  "message": "Failed to reset password. Token may be invalid or expired."
}
```

---

## Google OAuth - Fetch User Data

### 1. Get Google User Profile
**Use Case**: Fetch authenticated user's profile from Google
```
POST /api/auth/google/profile
Headers:
  Authorization: Bearer GOOGLE_ACCESS_TOKEN

Response (200):
{
  "id": "google_user_id",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://...",
  "locale": "en"
}

Response (401):
{
  "success": false,
  "message": "Invalid or expired Google access token"
}
```

### 2. Store Google Auth Token
**Use Case**: Save Google OAuth token for future API access
```
POST /api/auth/google/store-token
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "googleId": "google_user_id",
  "accessToken": "GOOGLE_ACCESS_TOKEN",
  "refreshToken": "GOOGLE_REFRESH_TOKEN",
  "email": "user@gmail.com",
  "scope": "openid profile email"
}

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "googleId": "google_user_id",
  "email": "user@gmail.com",
  "scope": "openid profile email",
  "createdAt": "2024-03-01T00:00:00Z",
  "updatedAt": "2024-03-01T00:00:00Z"
}
```

### 3. Get Stored Google Token
**Use Case**: Retrieve previously stored Google OAuth token
```
GET /api/auth/google/token
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "googleId": "google_user_id",
  "email": "user@gmail.com",
  "tokenExpiry": "2024-03-01T01:00:00Z",
  "scope": "openid profile email",
  "createdAt": "2024-03-01T00:00:00Z",
  "updatedAt": "2024-03-01T00:00:00Z"
}

Response (404):
{
  "message": "No Google token found"
}
```

### 4. Revoke Google Access
**Use Case**: Remove Google OAuth connection from user account
```
DELETE /api/auth/google/revoke
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "success": true,
  "message": "Google OAuth access revoked successfully"
}
```

---

## Database Tables Reference

### otp_codes (NoSQL - For temporary data)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User reference (nullable) |
| email | VARCHAR(255) | Email address for OTP |
| code | VARCHAR(6) | 6-digit OTP code |
| expires_at | TIMESTAMP | When OTP expires |
| verified | BOOLEAN | Whether OTP was verified |
| attempts | INTEGER | Failed attempt count |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes**: email, user_id, expires_at
**RLS Policies**: Users can only see their own OTP codes

### password_reset_tokens (RDBMS - Transactional)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User reference (nullable) |
| email | VARCHAR(255) | User email |
| token | VARCHAR(255) | Unique reset token |
| expires_at | TIMESTAMP | When token expires |
| used | BOOLEAN | Whether already used |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes**: email, token, expires_at
**RLS Policies**: Users can only see their own tokens

### google_auth_tokens (RDBMS - Secure storage)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User reference |
| google_id | VARCHAR(255) | Google user ID |
| access_token | TEXT | Google OAuth access token |
| refresh_token | TEXT | Google refresh token |
| token_expiry | TIMESTAMP | When token expires |
| email | VARCHAR(255) | Google email |
| scope | TEXT | OAuth scopes granted |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes**: user_id, google_id
**RLS Policies**: Users can only manage their own tokens

---

## Error Codes

| Code | Message | Action |
|------|---------|--------|
| 400 | Invalid input | Check your request format |
| 401 | Unauthorized | Provide valid JWT token |
| 404 | Not found | Resource doesn't exist |
| 409 | Conflict | Email already registered |
| 429 | Too many requests | Rate limit exceeded, retry later |
| 500 | Server error | Contact support |

---

## Implementation Notes

### OTP Flow
1. User requests OTP → Email sent (expires in 10 minutes)
2. User receives 6-digit code in email
3. User enters code → System verifies (max 5 attempts)
4. After verification, OTP is marked as used
5. Can resend OTP if not received

### Password Reset Flow
1. User requests password reset → Email sent (expires in 1 hour)
2. Email contains reset link with token
3. User clicks link → Token validated on frontend
4. User enters new password → Sent with token to backend
5. Backend verifies token, updates password, marks token as used
6. User can now login with new password

### Google OAuth Flow
1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. After authorization, redirected back with code
4. Backend exchanges code for access_token
5. Access token used to fetch user profile
6. Profile data merged with app user account
7. Access/refresh tokens stored for future use
8. User can revoke access anytime

---

## Testing with Postman

### Setup
1. Import this collection into Postman
2. Create environment variables:
   - `base_url`: http://localhost:4200
   - `jwt_token`: (obtained after login)
   - `otp_code`: (obtained from email)
   - `reset_token`: (obtained from reset email)

### Test Sequence
1. Register a new user
2. Login to get JWT token
3. Request OTP
4. Verify OTP
5. Request password reset
6. Validate reset token
7. Confirm password reset
8. Login with Google
9. Fetch Google profile
10. Logout

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Never log sensitive data** (passwords, tokens)
3. **Validate input** on both client and server
4. **Rate limit** OTP and password reset requests
5. **Expire tokens** after reasonable time
6. **Implement CSRF protection** for state-changing operations
7. **Use secure cookies** with HttpOnly and SameSite flags
8. **Monitor failed attempts** and implement account lockout
9. **Encrypt sensitive data** at rest
10. **Rotate keys regularly** in production


<br><br>