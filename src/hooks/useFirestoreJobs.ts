import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, doc, query, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Job } from '../types/job';

export function useFirestoreJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Setup real-time listener to Firestore
  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Defensive check: if Firebase failed to initialize (e.g. missing API key), 
    // db will be undefined from our hardening in firebase.ts. 
    // We return early instead of crashing the whole browser bundle.
    if (!db) {
      console.warn("Firestore Database not available. Check your internet or configuration.");
      setLoading(false);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/jobs`));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedJobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        fetchedJobs.push(doc.data() as Job);
      });
      // Sort by date desc (newest first)
      fetchedJobs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setJobs(fetchedJobs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs from Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Migration Logic: Sync localStorage the first time they log in
  useEffect(() => {
    const migrateLocalData = async () => {
      if (!user || loading) return;

      const hasMigrated = window.localStorage.getItem('jobtrackr_synced');
      if (hasMigrated === 'true') return;

      const localJobsStr = window.localStorage.getItem('jobtrackr_jobs');
      if (!localJobsStr) {
        window.localStorage.setItem('jobtrackr_synced', 'true');
        return;
      }

      try {
        const localJobs: Job[] = JSON.parse(localJobsStr);
        if (localJobs.length > 0 && db) {
          // Upload local jobs to Firestore in one batch
          const batch = writeBatch(db);
          
          localJobs.forEach(job => {
            const cleanJob = Object.fromEntries(Object.entries(job).filter(([, v]) => v !== undefined));
            const jobRef = doc(db!, `users/${user.uid}/jobs`, job.id);
            batch.set(jobRef, cleanJob);
          });
          
          await batch.commit();
        }
        window.localStorage.setItem('jobtrackr_synced', 'true');
      } catch (error) {
        console.error("Migration failed:", error);
      }
    };

    migrateLocalData();
  }, [user, loading]);

  // Track latest jobs in a ref to avoid adding 'jobs' to the setFirestoreJobs dependency array.
  // This guarantees setFirestoreJobs maintains referential stability just like a native setState, 
  // preventing constant downstream re-renders in App.tsx!
  const jobsRef = useRef<Job[]>([]);
  useEffect(() => { jobsRef.current = jobs; }, [jobs]);

  // Hook-compatible functional updates
  // Replaces the setValue from useLocalStorage while mimicking its API to avoid massive refactoring in App.tsx
  const setFirestoreJobs = useCallback((action: Job[] | ((prev: Job[]) => Job[])) => {
    if (!user) return; // Prevent setting if not logged in

    const currentJobs = jobsRef.current;
    const nextJobs = typeof action === 'function' ? action(currentJobs) : action;
    if (!db) return;

    // Detect what changed by comparing arrays
    const batch = writeBatch(db);

    const currentMap = new Map(currentJobs.map(j => [j.id, j]));
    const nextMap = new Map(nextJobs.map(j => [j.id, j]));

    // Find Deletions
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        batch.delete(doc(db, `users/${user.uid}/jobs`, id));
      }
    }

    // Find Additions or Updates
    for (const [id, job] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(job)) {
           // Firestore throws an error if properties are undefined. Strip them out.
           const cleanJob = Object.fromEntries(Object.entries(job).filter(([, v]) => v !== undefined));
           batch.set(doc(db, `users/${user.uid}/jobs`, id), cleanJob);
      }
    }

    // Commit all changes dynamically!
    batch.commit().catch(e => console.error("Error committing to Firestore", e));
  }, [user]);

  return [jobs, setFirestoreJobs, loading] as const;
}
