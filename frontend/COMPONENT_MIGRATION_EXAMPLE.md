# Component Migration Example: From Mock Data to Firebase

This guide shows you how to migrate an existing component from using mock/localStorage data to Firebase real-time data.

## Example: Migrating Dynamic Alerts Feed

### Before: Using Mock Data

```typescript
// dynamic-alerts-feed.tsx (OLD VERSION)
import { useState } from 'react';

const initialAlerts: Alert[] = [
  {
    id: 'INC-001',
    title: 'Major Traffic Jam - Bistupur Circle',
    location: 'Bistupur Circle, Main Road',
    // ... hardcoded mock data
  },
];

export function DynamicAlertsFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const updateAlertStatus = (id: string, newStatus: AlertStatus) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    ));
  };

  // Rest of component...
}
```

### After: Using Firebase

```typescript
// dynamic-alerts-feed.tsx (NEW VERSION)
import { useIncidents } from '../firebase/hooks';
import { useAuth } from '../contexts/auth-context';

export function DynamicAlertsFeed() {
  const { user } = useAuth();
  const { 
    incidents, 
    loading, 
    error, 
    updateIncident 
  } = useIncidents(user?.region); // Real-time data from Firebase

  // Update incident status in Firebase
  const updateAlertStatus = async (id: string, newStatus: string) => {
    try {
      await updateIncident(id, { status: newStatus });
      // No need to update local state - Firebase handles it automatically!
    } catch (error) {
      console.error('Failed to update incident:', error);
      alert('Failed to update incident status');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading incidents...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      {incidents.map(incident => (
        <div key={incident.id}>
          {/* Your existing UI */}
        </div>
      ))}
    </div>
  );
}
```

---

## Example: Migrating Notification Preferences

### Before: Using localStorage

```typescript
// notification-preferences.tsx (OLD VERSION)
const [preferences, setPreferences] = useState(() => {
  const saved = localStorage.getItem('notificationPreferences');
  return saved ? JSON.parse(saved) : defaultPreferences;
});

useEffect(() => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
}, [preferences]);

const handleSave = () => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  setSaved(true);
};
```

### After: Using Firebase

```typescript
// notification-preferences.tsx (NEW VERSION)
import { useNotificationPreferences } from '../firebase/hooks';

export function NotificationPreferences() {
  const { 
    preferences, 
    loading, 
    updatePreferences 
  } = useNotificationPreferences();

  const togglePreference = async (key: string) => {
    try {
      await updatePreferences({
        [key]: !preferences?.[key],
      });
      // Show success message
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  if (loading) return <div>Loading preferences...</div>;

  return (
    <div>
      {/* Your existing UI */}
    </div>
  );
}
```

---

## Example: Adding Image Upload to Incident Creation

### New: Incident Creation with Image

```typescript
import { useState } from 'react';
import { useIncidents } from '../firebase/hooks';
import { useImageUpload } from '../firebase/hooks';
import { useAuth } from '../contexts/auth-context';

export function CreateIncidentForm() {
  const { user } = useAuth();
  const { addIncident } = useIncidents();
  const { uploadImage, uploading, progress } = useImageUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    severity: 'medium',
    type: 'Traffic',
    description: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload image if selected
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(
          selectedImage,
          `incidents/${Date.now()}_${selectedImage.name}`
        );
      }

      // Create incident
      await addIncident({
        ...formData,
        imageUrl,
        reportedBy: user?.name || 'Anonymous',
        phone: user?.phone || 'N/A',
        region: user?.region || 'Unknown',
        userId: user?.id || '',
        status: 'pending',
      });

      // Reset form
      setFormData({
        title: '',
        location: '',
        severity: 'medium',
        type: 'Traffic',
        description: '',
      });
      setSelectedImage(null);
      
      alert('Incident reported successfully!');
    } catch (error) {
      console.error('Failed to create incident:', error);
      alert('Failed to report incident');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Incident Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />

      <select
        value={formData.severity}
        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
      />

      {uploading && (
        <div>
          <p>Uploading: {progress.toFixed(0)}%</p>
          <progress value={progress} max="100" />
        </div>
      )}

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Report Incident'}
      </button>
    </form>
  );
}
```

---

## Example: Real-Time Dashboard Statistics

### New: Live KPI Cards

```typescript
import { useIncidentStats } from '../firebase/hooks';
import { useAuth } from '../contexts/auth-context';

export function KpiCards() {
  const { user } = useAuth();
  const { stats, loading } = useIncidentStats(user?.region);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-orange-600">{stats.pending}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600">{stats.resolved}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.resolvedRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Migration Checklist for Each Component

When migrating a component, follow these steps:

### ✅ Step 1: Identify Data Source
- [ ] Find where the component gets its data (useState, localStorage, mock data)
- [ ] Identify what type of data it needs (incidents, users, preferences)

### ✅ Step 2: Import Firebase Hooks
```typescript
import { useIncidents } from '../firebase/hooks';
// or
import { useNotificationPreferences } from '../firebase/hooks';
// etc.
```

### ✅ Step 3: Replace State Management
```typescript
// OLD
const [data, setData] = useState(mockData);

// NEW
const { data, loading, error } = useIncidents();
```

### ✅ Step 4: Add Loading & Error States
```typescript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### ✅ Step 5: Update CRUD Operations
```typescript
// OLD
setData([...data, newItem]);

// NEW
await addIncident(newItem);
// Firebase auto-updates the UI!
```

### ✅ Step 6: Remove localStorage Logic
```typescript
// DELETE these:
localStorage.setItem('key', data);
const saved = localStorage.getItem('key');
```

### ✅ Step 7: Test
- [ ] Sign in with different users
- [ ] Create, update, delete data
- [ ] Verify real-time updates work
- [ ] Check error handling

---

## Common Patterns

### Pattern 1: List of Items with Actions

```typescript
function ItemList() {
  const { items, loading, updateItem, removeItem } = useItems();

  const handleUpdate = async (id: string, updates: Partial<Item>) => {
    try {
      await updateItem(id, updates);
      // Success feedback
    } catch (error) {
      // Error feedback
    }
  };

  return (
    <>
      {loading && <Spinner />}
      {items.map(item => (
        <ItemCard 
          key={item.id}
          item={item}
          onUpdate={handleUpdate}
          onDelete={removeItem}
        />
      ))}
    </>
  );
}
```

### Pattern 2: Form with Firebase Upload

```typescript
function FormWithUpload() {
  const { addItem } = useItems();
  const { uploadImage, uploading } = useImageUpload();

  const handleSubmit = async (data) => {
    const imageUrl = file ? await uploadImage(file, path) : '';
    await addItem({ ...data, imageUrl });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pattern 3: Settings Page

```typescript
function Settings() {
  const { preferences, updatePreferences } = useNotificationPreferences();

  const toggle = async (key: string) => {
    await updatePreferences({ [key]: !preferences[key] });
  };

  return <SettingsUI preferences={preferences} onToggle={toggle} />;
}
```

---

## Tips & Tricks

### 1. **Optimistic Updates**
For better UX, update UI immediately then save to Firebase:

```typescript
const handleToggle = async (id: string) => {
  // Optimistically update UI
  setLocalState(prev => ({ ...prev, [id]: !prev[id] }));
  
  try {
    // Save to Firebase
    await updateItem(id, { enabled: !prev[id] });
  } catch (error) {
    // Revert on error
    setLocalState(prev => ({ ...prev, [id]: !prev[id] }));
  }
};
```

### 2. **Debounce Searches**
When searching/filtering, debounce Firebase queries:

```typescript
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((term: string) => {
    // Search Firebase
  }, 500),
  []
);
```

### 3. **Pagination**
For large datasets, implement pagination:

```typescript
const { incidents } = useIncidents(region, 20); // Limit to 20
// Implement "Load More" button
```

### 4. **Offline Support**
Firebase automatically caches data:

```typescript
// Works offline automatically!
const { incidents } = useIncidents();
// Shows cached data when offline
```

---

## Next Components to Migrate

Recommended order:

1. ✅ Auth Context (Already done)
2. 🚧 Dynamic Alerts Feed (High priority)
3. 🚧 KPI Cards / Dashboard Stats
4. 🚧 Notification Preferences
5. 🚧 Profile Sidebar
6. 🚧 Security Settings
7. 🚧 Analytics View
8. 🚧 Reports View

---

**Ready to start migrating? Pick a component and follow the patterns above!**
