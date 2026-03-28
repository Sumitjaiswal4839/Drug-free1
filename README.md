# Drug Free - Angular SPA

This is an Angular Single Page Application (SPA) converted from the original HTML/CSS/JS webapp.

## Project Structure

```
drug-free-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/           # Navigation header with login/register modals
│   │   │   ├── footer/           # Footer with links and contact info
│   │   │   ├── home/             # Main home page with sliders and content
│   │   │   ├── profile/          # User profile page
│   │   │   ├── dashboard/        # User dashboard
│   │   │   ├── awards/           # Awards gallery
│   │   │   ├── faq/              # Frequently Asked Questions
│   │   │   ├── contact/          # Contact form
│   │   │   ├── book-appointment/ # Appointment booking
│   │   │   ├── drug-information/ # Drug information resources
│   │   │   ├── recommended-reading/ # Reading materials
│   │   │   └── change-password/  # Password change page
│   │   ├── app.module.ts         # Main application module
│   │   ├── app-routing.module.ts # Routing configuration
│   │   └── app.component.*       # Root component
│   ├── assets/
│   │   └── images/               # All images from original project
│   ├── styles.css                # Global styles (from style1.css)
│   └── index.html                # Main HTML file
├── angular.json                  # Angular configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Features

✅ **Converted to Angular SPA**
- All pages are now Angular components with routing
- No page reloads when navigating
- Clean URL structure without .html extensions

✅ **Preserved Original Functionality**
- All styles from style1.css maintained
- Original JavaScript functionality converted to TypeScript
- Image carousel and slider functionality
- Login/Register modals
- Mobile-responsive sidebar navigation
- Expert chat modal
- AI chatbot integration (Jotform)

✅ **Angular Best Practices**
- Component-based architecture
- Lazy loading ready
- TypeScript for type safety
- Reactive forms support
- Router integration

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

3. **Open in browser:**
   Navigate to `http://localhost:4200/`

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Available Routes

- `/` or `/home` - Home page
- `/profile` - User profile
- `/dashboard` - User dashboard
- `/awards` - Awards and achievements
- `/faq` - Frequently asked questions
- `/contact` - Contact form
- `/book-appointment` - Book appointments
- `/drug-information` - Drug information resources
- `/recommended-reading` - Recommended reading materials
- `/change-password` - Change password

## Key Components

### Header Component
- Responsive navigation with dropdowns
- Mobile sidebar menu
- Login/Register modals
- Search functionality

### Home Component
- Welcome section with typing animation
- Image carousel (auto-rotating)
- Drug information slider
- Services cards
- Events section
- Community contribution form
- Expert chat integration

### Footer Component
- Quick links
- Resources
- Contact information
- Social media links

## Styling

All original styles from `style1.css` are preserved in `src/styles.css`. The application uses:
- CSS Custom Properties (CSS Variables)
- Responsive design with media queries
- Font Awesome icons
- Smooth animations and transitions

## Third-Party Integrations

1. **Font Awesome** - For icons
   ```html
   <script src="https://kit.fontawesome.com/42d7a56209.js"></script>
   ```

2. **Jotform AI Chatbot** - AI Doctor chatbot in bottom-right corner
   ```javascript
   // Configured in home component
   ```

## Development Notes

### Converting from HTML to Angular

The conversion process involved:
1. Breaking down the monolithic HTML into Angular components
2. Converting vanilla JavaScript to TypeScript with Angular lifecycle hooks
3. Implementing Angular Router for navigation
4. Maintaining all original CSS without breaking changes
5. Preserving all images and assets in the assets folder

### Important Files

- **src/styles.css** - Contains all global styles from original style1.css
- **src/assets/images/** - All original images
- **src/app/app-routing.module.ts** - Route definitions
- **src/app/app.module.ts** - Module declarations

## Future Enhancements

Potential improvements for the future:
- Add backend API integration
- Implement authentication service
- Add state management (NgRx or Akita)
- Lazy load feature modules
- Add unit and integration tests
- Implement PWA features
- Add accessibility (a11y) improvements

## 🎉 Backend Implementation - March 2026

### Recently Added Features

✅ **OTP (One-Time Password) Service**
- Two-factor authentication
- 6-digit codes with 10-minute expiry
- Max 5 failed attempts
- Email verification

✅ **Password Reset Service**
- Secure password reset flow
- 32-character random tokens
- 1-hour expiry
- One-time use tokens
- Email verification

✅ **Google OAuth Service**
- Social login integration
- User profile fetching from Google
- Secure token storage
- Easy revocation

### Documentation

Complete documentation for the new backend features:

- **[README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md)** - Implementation summary
- **[POSTMAN_API_REFERENCE.md](./POSTMAN_API_REFERENCE.md)** - Complete API endpoints
- **[BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)** - Feature overview
- **[PASSWORD_RESET_BACKEND.md](./PASSWORD_RESET_BACKEND.md)** - Backend setup guide
- **[EXAMPLE_COMPONENTS.md](./EXAMPLE_COMPONENTS.md)** - Ready-to-use UI components
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Step-by-step setup guide

### Quick Start

1. **Deploy Database Schema**
   ```bash
   # Copy schema.sql to Supabase SQL Editor and run
   ```

2. **Update Environment**
   ```typescript
   // environment.ts
   supabase: {
     url: 'YOUR_SUPABASE_URL',
     key: 'YOUR_ANON_KEY'
   },
   oauth: {
     google: {
       clientId: 'YOUR_GOOGLE_CLIENT_ID'
     }
   }
   ```

3. **Setup Email Service**
   - Use SendGrid, Mailgun, or AWS SES
   - See PASSWORD_RESET_BACKEND.md for examples

4. **Create Backend Endpoint**
   - Implement POST /api/auth/reset-password
   - See PASSWORD_RESET_BACKEND.md for code examples

5. **Test with Postman**
   - Use POSTMAN_API_REFERENCE.md
   - Import collection and test all endpoints

### Files Added

```
src/app/
├── otp.service.ts
├── otp.model.ts
├── password-reset.service.ts
├── password-reset.model.ts
├── google-oauth.service.ts
└── auth.service.ts (enhanced)

schema.sql (updated)
environment.ts (ready to configure)
```

For complete implementation details, see **[README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md)**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

All rights reserved © 2025 Drug Free

## Contact

For questions or support:
- Email: info@drugfree.org
- Phone: +1 (555) 123-4567
- Address: 123 Wellness Blvd, Health City, DR 12345




<br><br>