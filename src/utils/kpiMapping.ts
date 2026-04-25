import { BusinessIndustry, KpiConfig } from '../types/business';

export const getKpiMapping = (industry: BusinessIndustry): KpiConfig[] => {
  const commonIcons = {
    revenue: 'trending-up',
    spend: 'target',
    efficiency: 'activity',
    reach: 'globe'
  };

  switch (industry) {
    case 'ecommerce':
      return [
        { key: 'revenue', label: 'Total Revenue', format: 'currency', icon: commonIcons.revenue },
        { key: 'spend', label: 'Ad Spend', format: 'currency', icon: commonIcons.spend },
        { key: 'roas', label: 'ROAS', format: 'ratio', icon: commonIcons.efficiency },
        { key: 'orders', label: 'Total Orders', format: 'number', icon: commonIcons.reach }
      ];
    case 'b2b':
      return [
        { key: 'leads', label: 'Total Leads', format: 'number', icon: commonIcons.revenue },
        { key: 'spend', label: 'Marketing Spend', format: 'currency', icon: commonIcons.spend },
        { key: 'cpl', label: 'Cost Per Lead', format: 'currency', icon: commonIcons.efficiency },
        { key: 'pipeline', label: 'Pipeline Value', format: 'currency', icon: commonIcons.reach }
      ];
    case 'saas':
      return [
        { key: 'mrr', label: 'New MRR', format: 'currency', icon: commonIcons.revenue },
        { key: 'cac', label: 'Blended CAC', format: 'currency', icon: commonIcons.spend },
        { key: 'ltv_cac', label: 'LTV:CAC Ratio', format: 'ratio', icon: commonIcons.efficiency },
        { key: 'signups', label: 'Trial Signups', format: 'number', icon: commonIcons.reach }
      ];
    case 'hospitality':
      return [
        { key: 'revenue', label: 'Digital Revenue', format: 'currency', icon: commonIcons.revenue },
        { key: 'spend', label: 'Platform Spend', format: 'currency', icon: commonIcons.spend },
        { key: 'roas', label: 'Direct ROAS', format: 'ratio', icon: commonIcons.efficiency },
        { key: 'reach', label: 'Brand Reach', format: 'number', icon: commonIcons.reach }
      ];
    default:
      return [
        { key: 'revenue', label: 'Total Revenue', format: 'currency', icon: commonIcons.revenue },
        { key: 'spend', label: 'Ad Spend', format: 'currency', icon: commonIcons.spend },
        { key: 'efficiency', label: 'Efficiency', format: 'ratio', icon: commonIcons.efficiency },
        { key: 'reach', label: 'Total Reach', format: 'number', icon: commonIcons.reach }
      ];
  }
};
