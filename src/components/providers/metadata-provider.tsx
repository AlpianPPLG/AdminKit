'use client';

import { useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';

/**
 * Component that dynamically updates page title and meta description from settings
 */
export function MetadataProvider() {
  const { getSetting } = useSettings();

  useEffect(() => {
    const siteName = getSetting('site_name', 'AdminKit Pro');
    const siteDescription = getSetting('site_description', 'A comprehensive admin dashboard');
    
    // Update document title
    if (siteName) {
      document.title = `${siteName} - Dashboard`;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (siteDescription) {
      metaDescription.setAttribute('content', siteDescription);
    }

    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    if (siteName) {
      ogTitle.setAttribute('content', siteName);
    }

    // Update og:description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    if (siteDescription) {
      ogDescription.setAttribute('content', siteDescription);
    }
    
  }, [getSetting]);

  return null;
}
