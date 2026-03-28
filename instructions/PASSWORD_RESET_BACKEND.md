# Backend Password Reset Implementation Guide

## Issue

Supabase client-side JavaScript SDK cannot directly update user passwords for security reasons. The `auth.updateUser()` method only works when the user is currently authenticated.

## Solution

You need to create a **backend API endpoint** that handles password resets securely using Supabase Admin API.

## Implementation Steps

### Option 1: Node.js/Express Backend

```javascript
// backend/routes/auth.js

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase Admin client (with service_role key - NEVER expose to frontend)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/auth/reset-password
 * Body: { token, email, newPassword }
 * Returns: { success: boolean, message: string }
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    // Validate input
    if (!token || !email || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate token in database
    const { data: resetToken, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('used', false)
      .single();

    if (tokenError || !resetToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    // Check if token has expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired' 
      });
    }

    // Get user ID from email
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError || !users) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error finding user' 
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update password using Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update password: ' + updateError.message 
      });
    }

    // Mark token as used
    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used: true, updated_at: new Date().toISOString() })
      .eq('id', resetToken.id);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
```

### Option 2: Supabase Edge Functions

Create a Supabase Function that handles password reset:

```typescript
// supabase/functions/reset-password/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 }
    );
  }

  const { token, email, newPassword } = await req.json();

  // Validate input
  if (!token || !email || !newPassword) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400 }
    );
  }

  // Initialize Supabase Admin client
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Validate token in database
    const { data: resetToken, error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("email", email)
      .eq("used", false)
      .single();

    if (tokenError || !resetToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid or expired reset token" 
        }),
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Reset token has expired" 
        }),
        { status: 400 }
      );
    }

    // Get user by email
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError || !users) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Error finding user" 
        }),
        { status: 500 }
      );
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "User not found" 
        }),
        { status: 404 }
      );
    }

    // Update password using Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to update password" 
        }),
        { status: 500 }
      );
    }

    // Mark token as used
    await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used: true, updated_at: new Date().toISOString() })
      .eq("id", resetToken.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password reset successfully"
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Server error" 
      }),
      { status: 500 }
    );
  }
});
```

### Option 3: Firebase Functions

```typescript
// functions/src/resetPassword.ts

import * as functions from 'firebase-functions';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const resetPassword = functions.https.onRequest(async (req, res) => {
  // CORS handling
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { token, email, newPassword } = req.body;

  // Validation...
  // Token verification...
  // Password update...
  // Token marking as used...
  
  res.json({ success: true, message: 'Password reset successfully' });
});
```

## Frontend Usage

Once the backend endpoint is ready, update the PasswordResetService:

```typescript
private async resetPasswordWithToken(
  token: string,
  newPassword: string,
  email: string
): Promise<PasswordResetResponse> {
  try {
    // Call backend endpoint instead of updating directly
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, email })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to reset password');
    }

    return {
      success: true,
      message: result.message,
      email
    };
  } catch (error) {
    throw error;
  }
}
```

## Security Best Practices

1. **Never expose SERVICE_ROLE_KEY in frontend** - Only on secure backend
2. **Validate token** before updating password
3. **Use HTTPS** in production
4. **Rate limit** password reset requests
5. **Log** password reset attempts for audit trail
6. **Invalidate token** after first use
7. **Check token expiry** before updating
8. **Hash passwords** (handled by Supabase Auth)
9. **Email verification** (token sent to email)
10. **CSRF protection** if using cookies

## Testing

```bash
# 1. Request password reset
curl -X POST http://localhost:4200/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# 2. Check email for reset token

# 3. Validate token
curl http://localhost:4200/api/auth/reset-password/validate?token=TOKEN

# 4. Reset password
curl -X POST http://localhost:4200/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN",
    "email": "user@example.com",
    "newPassword": "NewPassword123!"
  }'

# 5. Login with new password
```

## Environment Variables

```bash
# .env (backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**IMPORTANT**: Service Role Key should NEVER be committed to git or exposed in frontend!

## Support

Refer to:
- Supabase Docs: https://supabase.com/docs/reference/javascript/admin-updateuserbyid
- Password Reset Flow Diagram in POSTMAN_API_REFERENCE.md


<br><br>