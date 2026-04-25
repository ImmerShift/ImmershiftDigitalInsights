import { useEffect, useMemo } from 'react';
import { BusinessProfile } from '../types/business';

export function useTheme(business: BusinessProfile) {
  const theme = useMemo(() => business.theme || {
    primaryColor: '#7A2B20',
    secondaryColor: '#DDA77B',
    logoUrl: '',
    fontFamily: 'Inter'
  }, [business.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-brand', theme.primaryColor);
    root.style.setProperty('--secondary-brand', theme.secondaryColor);
    // Note: In Tailwind 4 / Vite we can also inject this into a style tag or data attribute
    // for easier use in utility classes if needed.
  }, [theme]);

  return theme;
}
