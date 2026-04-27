import { useState, useEffect } from 'react';
import { fetchPlatformData } from '../utils/api';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * A custom React hook to manage the data lifecycle for our dashboard components.
 * This abstracts away the fetch logic and implements a critical SaaS failsafe:
 * if the live API fails, it seamlessly falls back to provided mock data.
 * 
 * @param platform The platform ID to fetch data for.
 * @param mockFallbackData The typed mock data to use if the fetch fails.
 * @returns An object containing the current data, loading state, and any error message.
 */
export function useDashboardData<T>(
  platform: 'ga4' | 'gsc' | 'youtube' | 'meta' | 'tiktok' | 'email' | 'executive',
  mockFallbackData: T,
  dateRange?: { startDate: string; endDate: string }
) {
  // Use the generic type T to ensure our component UI stays strictly typed
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Reset states before fetching
      setIsLoading(true);
      setError(null);
      setIsLive(false);

      try {
        let accessToken: string | undefined;

        // Fetch real token from Firestore if user is authenticated
        if (auth.currentUser) {
           const platformMap: Record<string, string> = { ga4: 'ga4', gsc: 'search_console', youtube: 'youtube', meta: 'meta_ads', tiktok: 'tiktok_ads', email: 'klaviyo', executive: 'executive' };
           const dbPlatform = platformMap[platform] || platform;
           
           const q = query(
             collection(db, `users/${auth.currentUser.uid}/connectors`),
             where("platformId", "==", dbPlatform),
             where("status", "==", "active")
           );
           const snapshot = await getDocs(q);
           if (!snapshot.empty) {
              const doc = snapshot.docs[0];
              accessToken = doc.data().accessToken;
           }
        }

        // Attempt to fetch live data from the internal GAS bridge
        // Passing date parameters to the API utility
        const fetchedResult = await fetchPlatformData(platform, dateRange, accessToken);
        
        if (isMounted) {
          // If successful, cast and set the live data
          setData(fetchedResult as T);
          setIsLive(true);
        }
      } catch (err: any) {
        if (isMounted) {
          // CRITICAL SAAS FAILSAFE:
          // If the fetch fails (network error, Apps Script quota, CORS block),
          // we log the error, update the error state for optional UI hints,
          // and forcefully inject the 'mockFallbackData' so the executive dashboard
          // never shows a broken state or white screen.
          console.error(`⚠️ API Bridge Error for ${platform}. Falling back to mock data.`, err);
          setError(err.message || 'Failed to fetch live data');
          setData(mockFallbackData);
          setIsLive(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent setting state on unmounted components
    return () => {
      isMounted = false;
    };
  }, [platform, mockFallbackData, dateRange?.startDate, dateRange?.endDate]);

  return { data, isLoading, error, isLive };
}
