'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/lib/settings-context';

/**
 * Component that dynamically updates the favicon from settings
 */
export function FaviconProvider() {
  const { settings, getSetting } = useSettings();
  const [lastFaviconUrl, setLastFaviconUrl] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Only run after component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Don't run if not mounted yet
    if (!isMounted) {
      return;
    }

    const faviconUrl = getSetting('favicon_url');

    console.log('🎨 FaviconProvider: Checking favicon...', {
      faviconUrl,
      lastFaviconUrl,
      hasSettings: Object.keys(settings).length > 0,
      isMounted
    });

    // Skip if no URL or same as last one
    if (!faviconUrl) {
      console.log('⚠️ FaviconProvider: No favicon URL found in settings');
      return; // Early return to prevent removal attempts
    }

    // Skip if same as last one (no need to update)
    if (faviconUrl === lastFaviconUrl) {
      console.log('✓ FaviconProvider: Favicon already up to date');
      return;
    }

    // Remove ALL existing favicon links with proper error handling
    const selectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel*="icon"]'
    ];

    selectors.forEach(selector => {
      try {
        const existingLinks = document.querySelectorAll(selector);
        existingLinks.forEach(link => {
          try {
            if (link && link.parentNode) {
              const linkElement = link as HTMLLinkElement;
              console.log('🗑️ FaviconProvider: Removing', linkElement.rel, linkElement.href);
              link.parentNode.removeChild(link);
            }
          } catch (innerError) {
            console.warn('⚠️ FaviconProvider: Could not remove individual link:', innerError);
          }
        });
      } catch (error) {
        console.error('⚠️ FaviconProvider: Error removing favicon links:', error);
      }
    });

    // Add cache-busting parameter
    const timestamp = new Date().getTime();
    const faviconUrlWithCache = faviconUrl.includes('?')
      ? `${faviconUrl}&_t=${timestamp}`
      : `${faviconUrl}?_t=${timestamp}`;

    try {
      // Create and add new favicon (primary)
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = faviconUrlWithCache;

      if (document.head) {
        document.head.appendChild(link);
        console.log('✅ FaviconProvider: Successfully added new favicon', faviconUrlWithCache);
        setLastFaviconUrl(faviconUrl);
      } else {
        console.error('⚠️ FaviconProvider: document.head not available');
      }

      // Add shortcut icon (for older browsers)
      const shortcutIcon = document.createElement('link');
      shortcutIcon.rel = 'shortcut icon';
      shortcutIcon.type = 'image/x-icon';
      shortcutIcon.href = faviconUrlWithCache;

      if (document.head) {
        document.head.appendChild(shortcutIcon);
      }

      // Add apple-touch-icon (for iOS)
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = faviconUrlWithCache;

      if (document.head) {
        document.head.appendChild(appleTouchIcon);
      }

    } catch (error) {
      console.error('❌ FaviconProvider: Error adding favicon:', error);
    }

  }, [settings, getSetting, lastFaviconUrl, isMounted]); // Re-run when settings change

  return null;
}
