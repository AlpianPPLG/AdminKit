'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSettings } from '@/lib/settings-context';

export function ThemeSyncComponent() {
  const { theme, setTheme } = useTheme();
  const { getSetting } = useSettings();

  useEffect(() => {
    const savedTheme = getSetting('default_theme', 'light');

    // Apply theme class to html element for proper styling
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement;

      if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }

    // Also set the theme in next-themes for consistency
    if (savedTheme && savedTheme !== 'system' && setTheme) {
      setTheme(savedTheme);
    }
  }, [getSetting, setTheme]);

  return null;
}
