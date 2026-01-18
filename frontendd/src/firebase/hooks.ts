// Custom React Hooks for Firebase Operations
import { useState, useEffect } from 'react';
import {
  subscribeToIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentStats,
  getNotificationPreferences,
  saveNotificationPreferences,
  Incident,
  NotificationPreferences,
} from './services';
import { useAuth } from '../app/contexts/auth-context';

/**
 * Hook to fetch and subscribe to real-time incidents
 */
export function useIncidents(region?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToIncidents(
      (updatedIncidents) => {
        setIncidents(updatedIncidents);
        setLoading(false);
      },
      region
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [region]);

  const addIncident = async (incident: Incident) => {
    try {
      const id = await createIncident(incident);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateIncidentData = async (id: string, updates: Partial<Incident>) => {
    try {
      await updateIncident(id, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeIncident = async (id: string) => {
    try {
      await deleteIncident(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    incidents,
    loading,
    error,
    addIncident,
    updateIncident: updateIncidentData,
    removeIncident,
  };
}

/**
 * Hook to fetch incident statistics
 */
export function useIncidentStats(region?: string) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    critical: 0,
    resolvedRate: '0',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getIncidentStats(region);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [region]);

  return { stats, loading, error };
}

/**
 * Hook to manage notification preferences
 */
export function useNotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const prefs = await getNotificationPreferences(user.id);

        // Set default preferences if none exist
        if (!prefs) {
          const defaultPrefs: NotificationPreferences = {
            userId: user.id,
            solvedIssues: true,
            regionalUpdates: true,
            includeMetadata: true,
            emailNotifications: true,
            smsNotifications: false,
          };
          setPreferences(defaultPrefs);
        } else {
          setPreferences(prefs);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;

    try {
      const newPrefs = { ...preferences, ...updates };
      await saveNotificationPreferences(user.id, newPrefs);
      setPreferences(newPrefs);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
  };
}

/**
 * Hook to upload images to Firebase Storage
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    path: string
  ): Promise<string> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('./config');

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            setError(error.message);
            setUploading(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              setProgress(100);
              resolve(downloadURL);
            } catch (err: any) {
              setError(err.message);
              setUploading(false);
              reject(err);
            }
          }
        );
      });
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  return {
    uploadImage,
    uploading,
    progress,
    error,
  };
}

/**
 * Hook for real-time listener to a single incident
 */
export function useIncident(incidentId: string | null) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!incidentId) {
      setIncident(null);
      setLoading(false);
      return;
    }

    const setupListener = async () => {
      try {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('./config');

        const docRef = doc(db, 'incidents', incidentId);

        const unsubscribe = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setIncident({ id: docSnap.id, ...docSnap.data() } as Incident);
            } else {
              setIncident(null);
            }
            setLoading(false);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    const unsubscribePromise = setupListener();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe?.());
    };
  }, [incidentId]);

  return { incident, loading, error };
}
