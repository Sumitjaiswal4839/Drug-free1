# Supabase Setup Guide for Drug Recovery Angular App

This guide will walk you through setting up Supabase for the drug recovery tracking application.

## Prerequisites

- A Supabase account (free tier available at https://supabase.com)
- Node.js and npm installed
- Angular CLI installed

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Enter a project name (e.g., "drug-recovery-app")
5. Set a strong database password
6. Select a region closest to your users
7. Click "Create new project"

Wait for the project to be created (this may take a few minutes).

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (the Supabase URL)
   - **anon key** (the public key)
   - **service_role key** (keep this secret!)

## Step 3: Set Up Environment Variables

1. Update `environment.ts` in your Angular project:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_PROJECT_URL',
    key: 'YOUR_ANON_KEY',
  },
  // ... rest of config
};
```

2. Update `environment.prod.ts` for production:

```typescript
export const environment = {
  production: true,
  supabase: {
    url: 'YOUR_PROJECT_URL',
    key: 'YOUR_ANON_KEY',
  },
  // ... rest of config
};
```

Replace `YOUR_PROJECT_URL` and `YOUR_ANON_KEY` with your actual values from Step 2.

## Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `schema.sql`
4. Paste it into the SQL Editor
5. Click **Run**

Wait for all tables, indexes, and RLS policies to be created.

## Step 5: Configure Google OAuth (Optional)

### On Google Cloud Console:

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:4200/auth/callback`
   - `https://YOUR_SUPABASE_URL/auth/v1/callback`
7. Copy the Client ID

### In Supabase Dashboard:

1. Go to **Authentication** → **Providers** → **Google**
2. Enable the provider
3. Paste your Google Client ID
4. Click **Save**

## Step 6: Configure Facebook OAuth (Optional)

### On Facebook Developer Portal:

1. Go to [https://developers.facebook.com](https://developers.facebook.com)
2. Create a new app or select existing
3. Go to **Settings** → **Basic**
4. Copy your App ID and App Secret
5. Add App Domains:
   - `localhost`
   - `YOUR_SUPABASE_URL` (without https://)
6. Go to **Facebook Login** → **Settings**
7. Add Valid OAuth Redirect URIs:
   - `http://localhost:4200/auth/callback`
   - `https://YOUR_SUPABASE_URL/auth/v1/callback`

### In Supabase Dashboard:

1. Go to **Authentication** → **Providers** → **Facebook**
2. Enable the provider
3. Paste your Facebook App ID and App Secret
4. Click **Save**

## Step 7: Enable Email Authentication

1. Go to **Authentication** → **Providers** → **Email**
2. Make sure it's enabled (it should be by default)
3. Optionally enable:
   - **Confirm email** to require email verification
   - **Secure email change** for email update confirmations

## Step 8: Install Dependencies

```bash
npm install
```

Supabase library will be installed along with other dependencies.

## Step 9: Verify Setup

To verify everything is working:

1. Start the development server:
```bash
npm start
```

2. Navigate to `http://localhost:4200`
3. Try to register a new account
4. Check the Supabase dashboard **Authentication** section to see the new user

## Step 10: Enable Row Level Security (RLS)

To ensure data security:

1. Go to **Authentication** → **Policies**
2. For each table, verify that RLS policies are set up:
   - **users**: Users can only see/edit their own data
   - **goals**: Users can only see/edit their own goals
   - **health_history**: Users can only see/edit their own health records
   - **progress**: Users can only see/edit their own progress
   - **preferences**: Users can only see/edit their own preferences
   - **support_groups**: Public read, authenticated write
   - **support_group_members**: Users can only manage their own memberships
   - **awards**: Users can only see their own awards

All policies should already be created from the schema.sql, but verify they're in place.

## Step 11: Configure Storage (Optional)

If you want to allow profile picture uploads:

1. Go to **Storage** in the dashboard
2. Create a new bucket called `avatars`
3. Go to **Policies** for this bucket
4. Add a policy to allow authenticated users to upload and delete their own files

## Troubleshooting

### "CORS Error" when making requests
- Go to **Settings** → **CORS**
- Add your frontend URL to the list of allowed origins

### "Invalid JWT" error
- Verify your anon key is correct in `environment.ts`
- Check that the Supabase URL doesn't have a trailing slash

### "User not found" on login
- Ensure email authentication is enabled
- Check user exists in **Authentication** section

### Email not being sent
- If using custom SMTP, configure it in **Settings** → **Email**
- For development, use Supabase's default email service

## Next Steps

1. **Customize User Profiles**: Add additional fields to the users table as needed
2. **Set Up Recovery Functions**: Create PostgreSQL functions for automated recovery checks
3. **Enable Backups**: Go to **Settings** → **Backups** and enable automatic daily backups
4. **Monitor Usage**: Check **Settings** → **Usage** to track database queries and API calls

## Security Best Practices

1. **Never commit credentials**: Use environment variables for sensitive data
2. **Use RLS policies**: Ensure all policies are properly configured (done by schema.sql)
3. **Validate input**: Always validate user input on the backend
4. **Use HTTPS**: Always use HTTPS in production
5. **Rotate keys regularly**: Periodically regenerate API keys
6. **Enable 2FA**: Enable two-factor authentication for your Supabase account

## API Rate Limits

Supabase free tier includes:
- 500,000 monthly active users
- 2 GB database size
- 5 GB file storage
- 50 MB file upload size

For production applications with higher requirements, consider upgrading to a paid plan.

## Support

For additional help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase)


<br><br>