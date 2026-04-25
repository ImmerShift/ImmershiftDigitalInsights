const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzz2UV_EPrpFUKlxIyQ71KaVlKihSxXrgAOPbnGPLhn__0LPDier3lEH4z0KoAtiqLnog/exec';

/**
 * Fetches platform-specific marketing data from our Google Apps Script middleware.
 * 
 * @param platform The marketing platform to fetch data for.
 * @returns Parsed JSON data from the Google Apps Script.
 */
export async function fetchPlatformData(
  platform: 'ga4' | 'gsc' | 'youtube' | 'meta' | 'tiktok' | 'email' | 'executive',
  dateRange?: { startDate: string; endDate: string }
) {
  try {
    // Construct the URL with the platform query parameter for the Apps Script routing
    let url = `${GAS_WEB_APP_URL}?platform=${platform}`;
    
    if (dateRange) {
      url += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
    }
    
    // Google Apps Script requires following redirects to handle CORS properly.
    // Using a simple GET request avoids preflight OPTIONS requests which GAS often fails on.
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow' // Crucial for GAS Web Apps which redirect to script.googleusercontent.com
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Log the error for debugging but throw it so the caller (our hook) can handle the fallback
    console.error(`🚨 Failed to fetch live data for platform: ${platform}`, error);
    throw error;
  }
}
