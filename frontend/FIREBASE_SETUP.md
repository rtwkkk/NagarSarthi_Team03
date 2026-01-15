# Firebase Setup Guide for Nagar Alert Hub

This guide will help you set up Firebase backend for the Nagar Alert Hub municipal dashboard.

## Prerequisites

- Node.js and npm installed
- A Google account for Firebase
- Firebase CLI (optional but recommended)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `nagar-alert-hub` (or your preferred name)
4. Disable Google Analytics (optional for development)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the Web icon (</>)
2. Register app with nickname: "Nagar Alert Hub Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration** - you'll need this next!

## Step 3: Update Firebase Configuration

1. Open `/src/firebase/config.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** → **Get Started**
2. Enable **Email/Password** sign-in method:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### Optional: Enable Google Sign-In

1. Click on "Google" provider
2. Toggle "Enable"
3. Select support email
4. Click "Save"

## Step 5: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** (we'll deploy security rules)
3. Select your closest region (e.g., `asia-south1` for India)
4. Click "Enable"

### Deploy Firestore Security Rules

**Option A: Using Firebase Console**
1. Go to **Firestore Database** → **Rules** tab
2. Copy content from `/firestore.rules`
3. Paste into the editor
4. Click "Publish"

**Option B: Using Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

## Step 6: Set Up Firebase Storage

1. Go to **Storage** → **Get Started**
2. Choose **Production mode**
3. Select the same region as Firestore
4. Click "Done"

### Deploy Storage Security Rules

**Option A: Using Firebase Console**
1. Go to **Storage** → **Rules** tab
2. Copy content from `/storage.rules`
3. Paste into the editor
4. Click "Publish"

**Option B: Using Firebase CLI**
```bash
firebase deploy --only storage
```

## Step 7: Create Firestore Collections

Firebase will auto-create collections when you add the first document. However, you can manually create them:

1. Go to **Firestore Database** → **Data** tab
2. Click "Start collection"
3. Create these collections:
   - `users`
   - `incidents`
   - `notificationPreferences`
   - `analytics` (optional)
   - `reports` (optional)

### Firestore Data Structure

```
firestore/
├── users/
│   └── {userId}/
│       ├── displayName: string
│       ├── email: string
│       ├── role: "Super Administrator" | "Administrator" | "Viewer"
│       ├── region: string
│       ├── phone: string (optional)
│       ├── photoURL: string (optional)
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       └── lastLogin: timestamp
│
├── incidents/
│   └── {incidentId}/
│       ├── title: string
│       ├── location: string
│       ├── severity: "critical" | "high" | "medium" | "low"
│       ├── type: string
│       ├── status: "pending" | "verified" | "rejected" | "assigned" | "resolved"
│       ├── reportedBy: string
│       ├── phone: string
│       ├── description: string
│       ├── region: string
│       ├── userId: string
│       ├── assignedTeam: string (optional)
│       ├── imageUrl: string (optional)
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       └── resolvedAt: timestamp (optional)
│
├── notificationPreferences/
│   └── {userId}/
│       ├── solvedIssues: boolean
│       ├── regionalUpdates: boolean
│       ├── includeMetadata: boolean
│       ├── emailNotifications: boolean
│       ├── smsNotifications: boolean
│       └── updatedAt: timestamp
│
└── analytics/ (optional)
    └── {documentId}/
        └── [custom analytics data]
```

## Step 8: Create Indexes (Important!)

Firestore requires composite indexes for complex queries. Firebase will show you index creation links in the browser console when you run queries that need them.

**Manually create indexes:**
1. Go to **Firestore Database** → **Indexes** tab
2. Click "Create Index"
3. Recommended indexes:
   - Collection: `incidents`
     - Fields: `region` (Ascending), `createdAt` (Descending)
     - Fields: `status` (Ascending), `createdAt` (Descending)
     - Fields: `region` (Ascending), `status` (Ascending), `createdAt` (Descending)

## Step 9: Set Up Admin User

After deployment, create your first admin user:

1. Go to your app and sign up with an email/password
2. Note the User ID from Firebase Console → Authentication
3. Go to Firestore Database → `users` → find your user document
4. Edit the `role` field to: `"Super Administrator"`

## Step 10: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Sign up with a new account
   - Sign in with existing account
   - Verify user profile is created in Firestore

3. Test incidents (after implementing UI integration):
   - Create a new incident
   - Verify it appears in Firestore
   - Update incident status
   - Test real-time updates

## Environment Variables (Optional)

For better security in production, use environment variables:

1. Create `.env.local` in project root:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. Update `config.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

## Firebase Quotas (Free Tier)

Be aware of Firebase free tier limits:

- **Firestore:**
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage

- **Authentication:**
  - Unlimited (for most providers)

- **Storage:**
  - 5 GB storage
  - 1 GB download/day

## Next Steps

1. Integrate real-time incident updates in dashboard
2. Implement incident image uploads with Firebase Storage
3. Add notification system
4. Set up analytics tracking
5. Configure Cloud Functions for automated tasks (optional)

## Troubleshooting

### "Permission Denied" Errors
- Check Firestore security rules are deployed
- Verify user is authenticated
- Ensure user role is set correctly in Firestore

### Authentication Errors
- Verify Email/Password is enabled in Firebase Console
- Check Firebase configuration in `config.ts`
- Clear browser cache and try again

### Real-time Updates Not Working
- Ensure Firestore rules allow read access
- Check browser console for errors
- Verify internet connection

## Support

For more help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Important Security Notes:**
- Never commit your actual Firebase config with real credentials to public repositories
- Use environment variables for sensitive data
- Regularly review and test security rules
- Enable Firebase App Check for production to prevent abuse
- Set up billing alerts to monitor usage
