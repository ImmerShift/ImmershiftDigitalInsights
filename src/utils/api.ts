// Use backend proxy instead of GAS directly to avoid CORS in iframe
const PROXY_URL = '/api/proxy';

/**
 * Fetches platform-specific marketing data from our Google Apps Script middleware,
 * or handles a direct API call if preferred.
 * 
 * @param platform The marketing platform to fetch data for.
 * @param dateRange The date range object
 * @param accessToken Real access token retrieved from user's Firestore connectors
 * @returns Parsed JSON data from the middleware.
 */
export async function fetchPlatformData(
  platform: 'ga4' | 'gsc' | 'youtube' | 'meta' | 'tiktok' | 'email' | 'executive',
  dateRange?: { startDate: string; endDate: string },
  accessToken?: string
) {
  try {
    if (platform === 'executive') {
       // Return a simple empty object to satisfy the frontend safely, 
       // or throw a silent error that the catch block knows not to log.
       throw new Error("SILENT_EXECUTIVE_BYPASS");
    }
    
    // Map platforms to safe IDs to avoid adblocker network interception
    const platformMap: Record<string, string> = {
      ga4: 'p1',
      gsc: 'p2',
      youtube: 'p3',
      meta: 'p4',
      tiktok: 'p5',
      email: 'p6'
    };
    
    const safePlatform = platformMap[platform] || platform;
    
    // Construct the URL with the platform query parameter for the backend proxy
    let url = `${PROXY_URL}/${safePlatform}?`;
    
    if (dateRange) {
      url += `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&`;
    }

    if (accessToken && accessToken !== 'NO_TOKEN' && !accessToken.startsWith('MOCK')) {
       // Passing token to the server natively
       url += `auth_token=${encodeURIComponent(accessToken)}&`;
    }
    
    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
       throw new Error(`Data Proxy returned error: ${data.error}`);
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error.message === "SILENT_EXECUTIVE_BYPASS") {
      throw error;
    }
    throw error;
  }
}
