# ✅ Supabase Setup Checklist

Use this checklist to track your setup progress.

## Phase 1: Initial Setup (5-10 minutes)

- [ ] **Read this file and understand what needs to be done**
  
- [ ] **Install Node.js if not already installed**
  - Visit: https://nodejs.org (LTS version)
  - Verify: `node --version` and `npm --version`

- [ ] **Navigate to project directory**
  ```bash
  cd d:\Codingh\drug-free-angular
  ```

- [ ] **Install npm dependencies**
  ```bash
  npm install
  ```

## Phase 2: Supabase Project Setup (5 minutes)

- [ ] **Create Supabase Account**
  - Go to: https://supabase.com
  - Sign up or log in

- [ ] **Create New Project**
  - Click "New Project"
  - Enter project name (e.g., "drug-recovery-app")
  - Set database password
  - Choose region
  - Click "Create new project"

- [ ] **Wait for project to be created**
  - This may take 2-5 minutes
  - Watch for completion notification

- [ ] **Get API Keys**
  - Go to Settings → API
  - Copy Project URL
  - Copy anon key
  - Keep service_role key secret!

## Phase 3: Environment Configuration (5 minutes)

- [ ] **Update environment.ts**
  - Open: `src/app/environment.ts`
  - Replace `YOUR_PROJECT_ID` with your project ID from URL
  - Replace `YOUR_ANON_KEY` with your anon key
  - Save file

- [ ] **Update environment.prod.ts**
  - Open: `src/app/environment.prod.ts`
  - Replace same values as above
  - Save file

- [ ] **Optional: Configure OAuth**
  - For Google: Set `YOUR_GOOGLE_CLIENT_ID`
  - For Facebook: Set `YOUR_FACEBOOK_APP_ID`
  - (Can skip for now, add later)

## Phase 4: Database Schema Deployment (5 minutes)

- [ ] **Open Supabase SQL Editor**
  - In Supabase dashboard
  - Click "SQL Editor"
  - Click "New Query"

- [ ] **Copy schema.sql**
  - Open: `schema.sql` file in your project
  - Select all text (Ctrl+A)
  - Copy (Ctrl+C)

- [ ] **Paste into SQL Editor**
  - Paste schema into SQL Editor
  - Click "Run"
  - Wait for all queries to complete

- [ ] **Verify tables were created**
  - Go to "Table Editor"
  - Should see:
    - [ ] users
    - [ ] goals
    - [ ] health_history
    - [ ] progress
    - [ ] preferences
    - [ ] support_groups
    - [ ] support_group_members
    - [ ] achievements
    - [ ] awards

## Phase 5: Enable Authentication (5 minutes)

- [ ] **Enable Email Authentication**
  - Go to: Authentication → Providers
  - Find "Email"
  - Ensure it's enabled (should be by default)

- [ ] **Optional: Enable Google OAuth**
  - Click "Google"
  - Enable the provider
  - Enter your Google Client ID
  - Click "Save"

- [ ] **Optional: Enable Facebook OAuth**
  - Click "Facebook"
  - Enable the provider
  - Enter App ID and App Secret
  - Click "Save"

## Phase 6: Enable Row Level Security (5 minutes)

- [ ] **Verify RLS is enabled**
  - Go to: Authentication → Policies
  - Verify RLS is enabled for:
    - [ ] users
    - [ ] goals
    - [ ] health_history
    - [ ] progress
    - [ ] preferences
    - [ ] support_groups
    - [ ] support_group_members
    - [ ] awards
  - (Should be already done by schema.sql)

## Phase 7: Testing (5 minutes)

- [ ] **Start development server**
  ```bash
  npm start
  ```

- [ ] **Wait for server to start**
  - Should automatically open: http://localhost:4200
  - If not, manually navigate there

- [ ] **Test User Registration**
  - Create a test account
  - Use valid email
  - Use strong password
  - Submit form

- [ ] **Verify user was created**
  - Go to Supabase Dashboard
  - Click Authentication
  - Should see your test user in "Users" list

- [ ] **Test User Login**
  - Logout (if auto-logged in)
  - Try logging in with test account
  - Verify successful login

- [ ] **Check Network Requests**
  - Open DevTools (F12)
  - Go to Network tab
  - Verify requests to Supabase succeed (200 status)
  - Check for any 401/403 errors

## Phase 8: Documentation Review (10 minutes)

- [ ] **Read QUICK_REFERENCE.md**
  - Quick start guide and common tasks
  - Keep this handy while developing

- [ ] **Read SUPABASE_SETUP.md**
  - Complete setup details
  - Troubleshooting section
  - Advanced configuration

- [ ] **Read AUTH_IMPLEMENTATION.md**
  - Usage examples
  - Best practices
  - Code patterns

- [ ] **Bookmark API_REFERENCE.md**
  - Complete service documentation
  - Available methods for each service
  - Model definitions

## Phase 9: Integration in Components (10-20 minutes)

- [ ] **Import AuthService in components**
  ```typescript
  import { AuthService } from './auth.service';
  ```

- [ ] **Inject service into component**
  ```typescript
  constructor(private authService: AuthService) {}
  ```

- [ ] **Use authentication in templates**
  ```html
  <div *ngIf="(authService.isAuthenticated$ | async)">
    Welcome!
  </div>
  ```

- [ ] **Add auth guard to routes**
  - Edit app-routing.module.ts
  - Add `canActivate: [AuthGuard]` to protected routes

- [ ] **Inject other services as needed**
  - GoalsService for goals
  - UserService for user data
  - ProgressService for tracking
  - PreferencesService for settings
  - etc.

## Phase 10: Google OAuth Setup (Optional - 15 minutes)

- [ ] **Go to Google Cloud Console**
  - Visit: https://console.cloud.google.com
  - Create new project or select existing

- [ ] **Enable Google+ API**
  - Search for "Google+ API"
  - Click "Enable"

- [ ] **Create OAuth Credentials**
  - Go to: Credentials
  - Create new → OAuth 2.0 Client ID
  - Choose: Web application

- [ ] **Add Authorized Redirect URIs**
  - Add: `http://localhost:4200/auth/callback`
  - Add: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
  - Save

- [ ] **Copy Client ID**
  - Copy the Client ID
  - Paste into environment.ts

- [ ] **Update Supabase with Google ID**
  - Go to: Supabase Dashboard
  - Authentication → Providers → Google
  - Paste Client ID
  - Save

## Phase 11: Facebook OAuth Setup (Optional - 15 minutes)

- [ ] **Go to Facebook Developers**
  - Visit: https://developers.facebook.com
  - Create or select app

- [ ] **Get App ID and Secret**
  - Go to: Settings → Basic
  - Copy App ID and App Secret

- [ ] **Add App Domains**
  - Add: `localhost`
  - Add: `YOUR_PROJECT_ID.supabase.co`

- [ ] **Configure OAuth Redirect**
  - Go to: Facebook Login → Settings
  - Add URIs:
    - `http://localhost:4200/auth/callback`
    - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

- [ ] **Update Supabase**
  - Go to: Supabase Dashboard
  - Authentication → Providers → Facebook
  - Paste App ID and Secret
  - Save

## Phase 12: Build for Production (5-10 minutes)

- [ ] **Build the project**
  ```bash
  npm run build
  ```

- [ ] **Verify build succeeds**
  - Check for errors
  - Output should be in dist/ folder

- [ ] **Update environment.prod.ts**
  - Ensure production credentials are set

- [ ] **Test production build locally**
  ```bash
  npm install -g serve
  serve -s dist/drug-free-angular
  ```

## Phase 13: Deployment (Optional - 10-20 minutes)

- [ ] **Choose hosting provider**
  - [ ] Netlify (easiest)
  - [ ] Vercel
  - [ ] Firebase Hosting
  - [ ] AWS S3 + CloudFront
  - [ ] Your own server

- [ ] **Follow provider's deployment guide**

- [ ] **Verify production deployment works**

- [ ] **Test authentication in production**

- [ ] **Set CORS policy in Supabase**
  - Settings → CORS
  - Add your production domain

## Phase 14: Advanced Setup (Optional - variable time)

- [ ] **Configure Email Templates**
  - Authentication → Email Templates
  - Customize email messages

- [ ] **Set Up Custom Email**
  - Settings → Email
  - Configure SMTP settings (if desired)

- [ ] **Enable Backups**
  - Settings → Backups
  - Enable automatic daily backups

- [ ] **Configure Password Policy**
  - Authentication → Password Policy
  - Set minimum length
  - Require special characters (optional)

- [ ] **Set Up API Rate Limiting**
  - Settings → Rate Limiting
  - Configure limits as needed

- [ ] **Enable Audit Logs**
  - Settings → Audit Logs
  - Monitor user activity

## Final Verification Checklist

- [ ] ✅ npm install completed successfully
- [ ] ✅ Supabase project created
- [ ] ✅ API keys obtained
- [ ] ✅ environment.ts configured
- [ ] ✅ environment.prod.ts configured
- [ ] ✅ schema.sql executed
- [ ] ✅ All tables created
- [ ] ✅ Email authentication enabled
- [ ] ✅ RLS policies active
- [ ] ✅ npm start works
- [ ] ✅ Registration form works
- [ ] ✅ User appears in Supabase
- [ ] ✅ Login works
- [ ] ✅ No 401/403 errors
- [ ] ✅ Documentation reviewed
- [ ] ✅ Components can inject services
- [ ] ✅ Build succeeds

## Common Gotchas to Avoid

- ❌ Don't forget trailing slashes in environment URLs
- ❌ Don't commit real API keys to git
- ❌ Don't use service_role key in frontend
- ❌ Don't skip RLS policy setup
- ❌ Don't forget to run npm install
- ❌ Don't ignore CORS errors
- ❌ Don't test with wrong environment variables

## Quick Debug Tips

**Issue: CORS Error**
→ Add domain to Supabase CORS settings

**Issue: 401 Unauthorized**
→ Check API key in environment.ts
→ Verify token is being sent

**Issue: User not found**
→ Check user exists in Supabase Authentication
→ Verify email is correct

**Issue: Connection refused**
→ Check Supabase URL is correct
→ Verify project is active

**Issue: Module not found**
→ Run `npm install` again
→ Delete node_modules and reinstall

## You're Done! 🎉

Once you've completed all steps:

1. **Start Building**
   - Add authentication to your components
   - Implement features using provided services
   - Refer to AUTH_IMPLEMENTATION.md for examples

2. **Keep References Handy**
   - QUICK_REFERENCE.md for quick lookups
   - API_REFERENCE.md for method signatures
   - AUTH_IMPLEMENTATION.md for usage examples

3. **Test Thoroughly**
   - Test all authentication flows
   - Test data persistence
   - Test error handling
   - Test on different browsers

4. **Monitor in Production**
   - Check Supabase logs regularly
   - Monitor API usage
   - Set up alerts for errors
   - Rotate API keys periodically

---

## Tracking Progress

**Date Started:** _______________

**Date Completed Phase 1:** _______________

**Date Completed Phase 7 (Testing):** _______________

**Date Ready for Development:** _______________

**Date Deployed to Production:** _______________

---

**Need Help?**
- Check SUPABASE_SETUP.md troubleshooting section
- Review official Supabase docs: https://supabase.com/docs
- Visit Supabase Discord: https://discord.supabase.com
- Check Angular docs: https://angular.io/docs

**Happy coding! 🚀**


<br><br>