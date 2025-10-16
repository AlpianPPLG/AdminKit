'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Setting } from './types';

interface SettingsContextType {
  settings: Record<string, string>;
  isLoading: boolean;
  getSetting: (key: string, defaultValue?: string) => string;
  updateSetting: (key: string, value: string) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const settingsMap: Record<string, string> = {};
        result.data.forEach((setting: Setting) => {
          settingsMap[setting.setting_key] = setting.setting_value;
        });
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings[key] || defaultValue;
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting_key: key,
          setting_value: value,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local settings state immediately
        setSettings(prev => ({
          ...prev,
          [key]: value
        }));
        console.log('✅ Setting updated:', key, '=', value);
      } else {
        throw new Error(result.message || 'Failed to update setting');
      }
    } catch (error) {
      console.error('❌ Failed to update setting:', error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    setIsLoading(true);
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        getSetting,
        updateSetting,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
