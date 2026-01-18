// Firebase Service Functions for Nagar Sarthi
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// Types
// Types moved to single definition below

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'admin' | 'user' | 'authority';
  photoURL?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface NotificationPreferences {
  userId?: string;
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  categories: string[];
  updatedAt?: any;
}

export interface Incident {
  id?: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  location: any; // GeoPoint
  locationName: string;
  images: string[];
  reportedBy: string;
  reporterName: string;
  isAnonymous: boolean;
  upvotes: number;
  viewCount: number;
  reportCount: number;
  credibility: number;
  verified: boolean;
  createdAt: Timestamp | any;
  updatedAt: Timestamp | any;
  status: 'pending' | 'verified' | 'rejected' | 'dismissed' | 'resolved' | 'investigating' | 'in-progress' | 'assigned';
  assignedAt?: Timestamp | any | null;
  resolvedAt?: Timestamp | any | null;
  resolvedBy?: string | null;
  resolutionNote?: string | null;
}

// ============= INCIDENT SERVICES =============

/**
 * Listen to incident updates in real-time
 */
export function subscribeToIncidents(
  callback: (incidents: Incident[]) => void
): () => void {
  const q = query(
    collection(db, 'incidents'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const incidents = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Incident));
    callback(incidents);
  });

  return unsubscribe;
}


// ============= INCIDENT SERVICES =============

/**
 * Create a new incident
 */
export async function createIncident(incident: Incident): Promise<string> {
  const incidentData = {
    ...incident,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'incidents'), incidentData);
  return docRef.id;
}

/**
 * Get all incidents with optional filtering
 */
export async function getIncidents(
  region?: string,
  status?: string,
  limitCount: number = 50
): Promise<Incident[]> {
  let q = query(
    collection(db, 'incidents'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  // Add filters if provided
  if (region) {
    q = query(q, where('region', '==', region));
  }
  if (status) {
    q = query(q, where('status', '==', status));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Incident));
}

/**
 * Get a single incident by ID
 */
export async function getIncident(incidentId: string): Promise<Incident | null> {
  const docRef = doc(db, 'incidents', incidentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Incident;
  }
  return null;
}

/**
 * Update an incident
 */
export async function updateIncident(
  incidentId: string,
  updates: Partial<Incident>
): Promise<void> {
  const docRef = doc(db, 'incidents', incidentId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an incident
 */
export async function deleteIncident(incidentId: string): Promise<void> {
  await deleteDoc(doc(db, 'incidents', incidentId));
}

// Consolidated Incident interface and service are at the top of the file.

// ============= USER PROFILE SERVICES =============

/**
 * Create or update user profile in Firestore
 */
export async function createUserProfile(userId: string, profile: UserProfile): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...profile,
    updatedAt: serverTimestamp(),
  }).catch(async () => {
    // If document doesn't exist, create it
    const profileData = {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'users'), profileData);
  });
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ============= NOTIFICATION PREFERENCES SERVICES =============

/**
 * Save notification preferences
 */
export async function saveNotificationPreferences(
  userId: string,
  preferences: NotificationPreferences
): Promise<void> {
  const prefRef = doc(db, 'notificationPreferences', userId);
  await updateDoc(prefRef, {
    ...preferences,
    updatedAt: serverTimestamp(),
  }).catch(async () => {
    // If document doesn't exist, create it
    const prefData = {
      ...preferences,
      userId,
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'notificationPreferences'), prefData);
  });
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences | null> {
  const docRef = doc(db, 'notificationPreferences', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as NotificationPreferences;
  }
  return null;
}

// ============= ANALYTICS SERVICES =============

/**
 * Get incident statistics
 */
export async function getIncidentStats(region?: string) {
  let q = query(collection(db, 'incidents'));

  if (region) {
    q = query(q, where('region', '==', region));
  }

  const snapshot = await getDocs(q);
  const incidents = snapshot.docs.map(doc => doc.data() as Incident);

  // Calculate statistics
  const total = incidents.length;
  const pending = incidents.filter(i => i.status === 'pending').length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;
  const critical = incidents.filter(i => i.severity === 'critical').length;

  return {
    total,
    pending,
    resolved,
    critical,
    resolvedRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : '0',
  };
}
