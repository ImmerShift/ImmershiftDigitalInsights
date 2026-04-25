export type BusinessIndustry = 'ecommerce' | 'b2b' | 'saas' | 'hospitality' | 'general';
export type BusinessPersona = 'aggressive' | 'conservative' | 'analytical';

export interface BusinessTheme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  fontFamily?: string;
}

export interface BusinessProfile {
  name: string;
  industry: BusinessIndustry;
  primaryGoal: string;
  persona: BusinessPersona;
  theme?: BusinessTheme;
}

export interface KpiConfig {
  key: string;
  label: string;
  format: 'currency' | 'number' | 'ratio' | 'percentage';
  icon: string;
}
