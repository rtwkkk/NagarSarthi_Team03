# Firebase Integration Documentation

## Overview

The Nagar Alert Hub now has a complete Firebase backend integration with the following features:

✅ Firebase Authentication (Email/Password + optional Google Sign-In)  
✅ Firestore Database for all data storage  
✅ Firebase Storage for image uploads  
✅ Real-time data synchronization  
✅ Comprehensive security rules  
✅ Custom React hooks for easy data access  

---

## 📁 File Structure

```
/
├── src/
│   ├── firebase/
│   │   ├── config.ts          # Firebase initialization
│   │   ├── services.ts        # Firestore CRUD operations
│   │   └── hooks.ts           # Custom React hooks
│   └── app/
│       └── contexts/
│           └── auth-context.tsx   # Updated with Firebase Auth
├── firestore.rules            # Firestore security rules
├── storage.rules              # Storage security rules
├── FIREBASE_SETUP.md          # Setup guide
└── FIREBASE_INTEGRATION.md    # This file
```

---

## 🚀 Quick Start

### 1. Install Firebase (Already Done)
```bash
npm install firebase
```

### 2. Set Up Firebase Project
Follow the detailed instructions in **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

### 3. Update Configuration
Edit `/src/firebase/config.ts` with your Firebase credentials

---

## 🔑 Authentication

The auth system has been completely migrated to Firebase Authentication.

### Features

- ✅ Email/Password authentication
- ✅ Google Sign-In (optional)
- ✅ Automatic session management
- ✅ User profile synced with Firestore
- ✅ Role-based access control

### Usage in Components

```typescript
import { useAuth } from './contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, loading, signIn, signUp, signOut } = useAuth();

  // Sign in
  const handleSignIn = async () => {
    const success = await signIn('email@example.com', 'password123');
    if (success) {
      // Navigate to dashboard
    }
  };

  // Sign up
  const handleSignUp = async () => {
    const success = await signUp(
      'John Doe',
      'email@example.com',
      'password123',
      'Jamshedpur'
    );
  };

  // Sign out
  const handleSignOut = () => {
    signOut();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

---

## 📊 Firestore Database

### Collections

#### **users/** - User Profiles
```typescript
{
  displayName: string;
  email: string;
  role: "Super Administrator" | "Administrator" | "Viewer";
  region: string;
  phone?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;
}
```

#### **incidents/** - Public Incident Reports
```typescript
{
  title: string;
  location: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  status: "pending" | "verified" | "rejected" | "assigned" | "resolved";
  reportedBy: string;
  phone: string;
  description: string;
  region: string;
  userId: string;
  assignedTeam?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
}
```

#### **notificationPreferences/** - User Notification Settings
```typescript
{
  userId: string;
  solvedIssues: boolean;
  regionalUpdates: boolean;
  includeMetadata: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  updatedAt: Timestamp;
}
```

---

## 🪝 Custom Hooks

### useIncidents()

Real-time incident data with CRUD operations.

```typescript
import { useIncidents } from '../firebase/hooks';

function IncidentList() {
  const { incidents, loading, error, addIncident, updateIncident, removeIncident } = 
    useIncidents('Jamshedpur'); // Optional region filter

  // Add incident
  const handleAdd = async () => {
    await addIncident({
      title: 'Water Pipe Burst',
      location: 'Kadma',
      severity: 'high',
      type: 'Water',
      status: 'pending',
      reportedBy: 'John Doe',
      phone: '+91 9876543210',
      region: 'Jamshedpur',
      description: 'Major water leak',
    });
  };

  // Update incident
  const handleUpdate = async (id: string) => {
    await updateIncident(id, {
      status: 'verified',
      assignedTeam: 'Team Alpha',
    });
  };

  // Delete incident
  const handleDelete = async (id: string) => {
    await removeIncident(id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {incidents.map(incident => (
        <div key={incident.id}>
          <h3>{incident.title}</h3>
          <button onClick={() => handleUpdate(incident.id!)}>Verify</button>
          <button onClick={() => handleDelete(incident.id!)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### useIncidentStats()

Get aggregate statistics for incidents.

```typescript
import { useIncidentStats } from '../firebase/hooks';

function Dashboard() {
  const { stats, loading } = useIncidentStats('Jamshedpur');

  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Pending: {stats.pending}</p>
      <p>Resolved: {stats.resolved}</p>
      <p>Critical: {stats.critical}</p>
      <p>Resolved Rate: {stats.resolvedRate}%</p>
    </div>
  );
}
```

### useNotificationPreferences()

Manage user notification settings.

```typescript
import { useNotificationPreferences } from '../firebase/hooks';

function NotificationSettings() {
  const { preferences, loading, updatePreferences } = useNotificationPreferences();

  const toggleSetting = async (key: string, value: boolean) => {
    await updatePreferences({ [key]: value });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preferences?.solvedIssues}
          onChange={(e) => toggleSetting('solvedIssues', e.target.checked)}
        />
        Notify on solved issues
      </label>
    </div>
  );
}
```

### useImageUpload()

Upload images to Firebase Storage.

```typescript
import { useImageUpload } from '../firebase/hooks';

function ImageUploader() {
  const { uploadImage, uploading, progress } = useImageUpload();

  const handleUpload = async (file: File) => {
    const url = await uploadImage(
      file,
      `incidents/${Date.now()}_${file.name}`
    );
    console.log('Uploaded to:', url);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
      />
      {uploading && <p>Uploading: {progress.toFixed(0)}%</p>}
    </div>
  );
}
```

---

## 🔐 Security

### Firestore Rules

Security rules are defined in `/firestore.rules`:

- **Users**: Can read all, update own profile, admins can update any
- **Incidents**: All can read/create, only admins can update/delete
- **Notifications**: Users can only access their own preferences

### Storage Rules

Security rules are defined in `/storage.rules`:

- **Incident images**: 5MB max, image types only
- **Profile images**: 2MB max, user's own only
- **Reports**: Admins only, 10MB max

### Role-Based Access

Three user roles with different permissions:

1. **Super Administrator**: Full access, can delete users/incidents
2. **Administrator**: Can verify, assign, and resolve incidents
3. **Viewer**: Read-only access

---

## 📈 Real-Time Updates

All data uses real-time listeners by default:

```typescript
// Automatic real-time updates
const { incidents } = useIncidents();

// When another user updates an incident,
// your component automatically re-renders with new data!
```

To disable real-time and use one-time fetch:

```typescript
import { getIncidents } from '../firebase/services';

const fetchOnce = async () => {
  const incidents = await getIncidents('Jamshedpur');
  // One-time fetch, no live updates
};
```

---

## 🎨 Example: Updating Dynamic Alerts Feed

Here's how to integrate Firebase with the existing alerts component:

```typescript
// In dynamic-alerts-feed.tsx
import { useIncidents } from '../firebase/hooks';

export function DynamicAlertsFeed() {
  const { incidents, loading, updateIncident } = useIncidents();

  const handleVerify = async (id: string) => {
    await updateIncident(id, { status: 'verified' });
  };

  const handleReject = async (id: string) => {
    await updateIncident(id, { status: 'rejected' });
  };

  const handleAssign = async (id: string, team: string) => {
    await updateIncident(id, {
      status: 'assigned',
      assignedTeam: team,
    });
  };

  if (loading) return <div>Loading incidents...</div>;

  return (
    <div>
      {incidents.map(incident => (
        <div key={incident.id}>
          {/* Your existing UI */}
          <button onClick={() => handleVerify(incident.id!)}>Verify</button>
          <button onClick={() => handleReject(incident.id!)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Migration Checklist

### ✅ Completed
- [x] Firebase SDK installed
- [x] Configuration files created
- [x] Authentication context updated
- [x] Firestore services created
- [x] Custom React hooks
- [x] Security rules defined
- [x] Setup documentation

### 🚧 To Do (Next Steps)
- [ ] Update components to use Firebase hooks
- [ ] Implement image upload in incident creation
- [ ] Add real-time dashboard statistics
- [ ] Create admin panel for user management
- [ ] Implement notification system
- [ ] Add data export functionality
- [ ] Set up Firebase Cloud Functions (optional)
- [ ] Deploy to production

---

## 📚 Additional Resources

- **Services API**: Check `/src/firebase/services.ts` for all available functions
- **Hooks API**: Check `/src/firebase/hooks.ts` for all custom hooks
- **Setup Guide**: See `/FIREBASE_SETUP.md` for deployment instructions

---

## 💡 Best Practices

1. **Always check auth state before operations**
   ```typescript
   const { user, isAuthenticated } = useAuth();
   if (!isAuthenticated) return;
   ```

2. **Handle loading states**
   ```typescript
   if (loading) return <LoadingSpinner />;
   ```

3. **Handle errors gracefully**
   ```typescript
   if (error) return <ErrorMessage message={error} />;
   ```

4. **Use TypeScript types**
   ```typescript
   import { Incident } from '../firebase/services';
   const incident: Incident = { ... };
   ```

5. **Unsubscribe from listeners**
   ```typescript
   // Hooks handle this automatically!
   // But if using services directly:
   useEffect(() => {
     const unsubscribe = subscribeToIncidents(callback);
     return () => unsubscribe();
   }, []);
   ```

---

## 🐛 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Update `/src/firebase/config.ts` with your actual credentials

### "Missing or insufficient permissions"
- Deploy Firestore security rules
- Check user role in Firestore console

### Real-time updates not working
- Verify internet connection
- Check browser console for errors
- Ensure Firestore rules allow read access

### Image upload fails
- Check file size (max 5MB for incidents)
- Verify file type is image
- Deploy Storage security rules

---

## 📞 Need Help?

- Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for setup steps
- Check [Firebase Documentation](https://firebase.google.com/docs)
- Inspect browser console for error messages
- Verify Firebase project configuration

---

**Happy Coding! 🚀**
