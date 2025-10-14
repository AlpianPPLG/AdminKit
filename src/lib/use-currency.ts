'use client';

import { useSettings } from './settings-context';
import { formatCurrency as formatCurrencyUtil } from './currency';

/**
 * Hook to format currency based on the app settings
 */
export function useCurrency() {
  const { getSetting } = useSettings();
  
  const defaultCurrency = getSetting('default_currency', 'IDR');
  
  const formatCurrency = (amount: number, currency?: string): string => {
    return formatCurrencyUtil(amount, currency || defaultCurrency);
  };
  
  return {
    defaultCurrency,
    formatCurrency,
  };
}
