/**
 * Currency formatting utilities
 */

// Map of common currencies to their locale codes
const CURRENCY_LOCALES: Record<string, string> = {
  IDR: 'id-ID',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  SGD: 'en-SG',
  MYR: 'ms-MY',
};

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'IDR', 'USD', 'EUR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string = 'IDR'): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).formatToParts(0).find(part => part.type === 'currency')?.value || currency;
}
