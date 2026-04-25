export type BusinessIndustry = 'ecommerce' | 'b2b' | 'saas' | 'hospitality' | 'general';
export type BusinessPersona = 'aggressive' | 'conservative' | 'analytical';

export interface BusinessProfile {
  name: string;
  industry: BusinessIndustry;
  primaryGoal: string;
  persona: BusinessPersona;
}

export interface KpiConfig {
  key: string;
  label: string;
  format: 'currency' | 'number' | 'ratio' | 'percentage';
  icon: string;
}
