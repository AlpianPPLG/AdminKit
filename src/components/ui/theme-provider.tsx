'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Settings-aware ThemeProvider wrapper
export function SettingsThemeProvider({ 
  children, 
  defaultTheme,
  ...props 
}: ThemeProviderProps & { defaultTheme?: string }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NextThemesProvider {...props} defaultTheme={defaultTheme || 'light'}>{children}</NextThemesProvider>;
  }

  return (
    <NextThemesProvider {...props} defaultTheme={defaultTheme || 'light'}>
      {children}
    </NextThemesProvider>
  );
}

// Theme synchronization component - should be placed inside SettingsProvider
export function ThemeSync() {
  return null; // Placeholder for now
}

