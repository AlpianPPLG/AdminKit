/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSettingSchema } from '@/lib/validations';
import { Setting } from '@/lib/types';
import { RefreshCw, Shield, User, Globe, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { refreshSettings, getSetting } = useSettings();
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local form states for each tab
  const [generalForm, setGeneralForm] = useState({
    site_name: '',
    site_description: '',
    default_currency: '',
    maintenance_mode: false,
  });
  
  const [appearanceForm, setAppearanceForm] = useState({
    default_theme: '',
    logo_url: '',
    favicon_url: '',
  });
  
  const [securityForm, setSecurityForm] = useState({
    session_timeout: '',
    max_login_attempts: '',
    require_2fa: false,
    password_policy: false,
  });
  
  const [advancedForm, setAdvancedForm] = useState({
    api_rate_limit: '',
    cache_ttl: '',
    backup_frequency: '',
    debug_mode: false,
    analytics_enabled: false,
  });

  const form = useForm<{ setting_key: string; setting_value: string; }>({
    resolver: zodResolver(updateSettingSchema),
  });

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings');
      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
      } else {
        toast.error('Failed to fetch settings');
      }
    } catch (error) {
      toast.error('An error occurred while fetching settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Get setting value - use settings context for consistency
  const getSettingValue = useCallback((key: string) => {
    return getSetting(key, '');
  }, [getSetting]);

  useEffect(() => {
    fetchSettings();
  }, []);
  
  // Update local form states when settings are loaded
  useEffect(() => {
    if (settings.length > 0) {
      setGeneralForm({
        site_name: getSettingValue('site_name'),
        site_description: getSettingValue('site_description'),
        default_currency: getSettingValue('default_currency'),
        maintenance_mode: getSettingValue('maintenance_mode') === 'true',
      });
      
      setAppearanceForm({
        default_theme: getSettingValue('default_theme'),
        logo_url: getSettingValue('logo_url'),
        favicon_url: getSettingValue('favicon_url'),
      });
      
      setSecurityForm({
        session_timeout: getSettingValue('session_timeout'),
        max_login_attempts: getSettingValue('max_login_attempts'),
        require_2fa: getSettingValue('require_2fa') === 'true',
        password_policy: getSettingValue('password_policy') === 'true',
      });
      
      setAdvancedForm({
        api_rate_limit: getSettingValue('api_rate_limit'),
        cache_ttl: getSettingValue('cache_ttl'),
        backup_frequency: getSettingValue('backup_frequency'),
        debug_mode: getSettingValue('debug_mode') === 'true',
        analytics_enabled: getSettingValue('analytics_enabled') === 'true',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    fetchSettings();
  }, []);
  
  // Listen for theme changes from header toggle
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail.theme;
      if (newTheme && newTheme !== 'system') {
        setAppearanceForm(prev => ({
          ...prev,
          default_theme: newTheme
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('themeChanged', handleThemeChange as EventListener);

      return () => {
        window.removeEventListener('themeChanged', handleThemeChange as EventListener);
      };
    }
  }, []);
  
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
        toast.success('Setting updated successfully');
        fetchSettings();
      } else {
        toast.error(result.message || 'Failed to update setting');
      }
    } catch (error) {
      toast.error('An error occurred while updating setting');
    }
  };

  // Handle form submission
  const onSubmit = async (data: { setting_key: string; setting_value: string; }) => {
    setIsSaving(true);
    try {
      await updateSetting(data.setting_key, data.setting_value);
    } finally {
      setIsSaving(false);
    }
  };

  // Save multiple settings at once
  const saveSettings = async (settingsToUpdate: Record<string, string | boolean>) => {
    setIsSaving(true);
    try {
      const promises = Object.entries(settingsToUpdate).map(([key, value]) => 
        updateSetting(key, typeof value === 'boolean' ? value.toString() : value)
      );
      
      await Promise.all(promises);
      await refreshSettings(); // Refresh global settings context
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save some settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle general settings save
  const handleGeneralSave = async () => {
    await saveSettings({
      site_name: generalForm.site_name,
      site_description: generalForm.site_description,
      default_currency: generalForm.default_currency,
      maintenance_mode: generalForm.maintenance_mode,
    });
  };
  
  // Handle appearance settings save
  const handleAppearanceSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings({
        default_theme: appearanceForm.default_theme,
        logo_url: appearanceForm.logo_url,
        favicon_url: appearanceForm.favicon_url,
      });

      // Apply theme immediately after saving
      if (appearanceForm.default_theme && appearanceForm.default_theme !== 'system') {
        setTheme(appearanceForm.default_theme);

        // Also apply theme class to html element for immediate visual feedback
        if (typeof window !== 'undefined') {
          const htmlElement = document.documentElement;
          if (appearanceForm.default_theme === 'dark') {
            htmlElement.classList.add('dark');
          } else {
            htmlElement.classList.remove('dark');
          }

          // Emit custom event for theme change so other components can listen
          window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: appearanceForm.default_theme }
          }));
        }
      }

      toast.success('Appearance settings saved and theme applied');
    } catch (error) {
      toast.error('Failed to save appearance settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle security settings save
  const handleSecuritySave = async () => {
    await saveSettings({
      session_timeout: securityForm.session_timeout,
      max_login_attempts: securityForm.max_login_attempts,
      require_2fa: securityForm.require_2fa,
      password_policy: securityForm.password_policy,
    });
  };
  
  // Handle advanced settings save
  const handleAdvancedSave = async () => {
    await saveSettings({
      api_rate_limit: advancedForm.api_rate_limit,
      cache_ttl: advancedForm.cache_ttl,
      backup_frequency: advancedForm.backup_frequency,
      debug_mode: advancedForm.debug_mode,
      analytics_enabled: advancedForm.analytics_enabled,
    });
  };

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout
        title="Settings"
        description="Manage system settings and configuration"
      >
        <div className="space-y-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>General Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={generalForm.site_name}
                        onChange={(e) => setGeneralForm({...generalForm, site_name: e.target.value})}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default_currency">Default Currency</Label>
                      <Input
                        id="default_currency"
                        value={generalForm.default_currency}
                        onChange={(e) => setGeneralForm({...generalForm, default_currency: e.target.value})}
                        placeholder="e.g., IDR, USD, EUR"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={generalForm.site_description}
                      onChange={(e) => setGeneralForm({...generalForm, site_description: e.target.value})}
                      placeholder="Enter site description"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenance_mode"
                      checked={generalForm.maintenance_mode}
                      onCheckedChange={(checked) => setGeneralForm({...generalForm, maintenance_mode: checked})}
                    />
                    <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleGeneralSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save General Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Appearance Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Default Theme</Label>
                      <select
                        id="theme"
                        value={appearanceForm.default_theme}
                        onChange={(e) => setAppearanceForm({...appearanceForm, default_theme: e.target.value})}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        title="Select default theme"
                        aria-label="Default Theme Selection"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo_url">Logo URL</Label>
                      <Input
                        id="logo_url"
                        value={appearanceForm.logo_url}
                        onChange={(e) => setAppearanceForm({...appearanceForm, logo_url: e.target.value})}
                        placeholder="/logo.png or https://example.com/logo.png"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Upload logo ke folder /public dan gunakan path lokal seperti /logo.png
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon_url">Favicon URL</Label>
                    <Input
                      id="favicon_url"
                      value={appearanceForm.favicon_url}
                      onChange={(e) => setAppearanceForm({...appearanceForm, favicon_url: e.target.value})}
                      placeholder="/favicon.ico or https://example.com/favicon.ico"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Upload favicon ke folder /public dan gunakan path lokal seperti /favicon.ico
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleAppearanceSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Appearance Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={securityForm.session_timeout}
                        onChange={(e) => setSecurityForm({...securityForm, session_timeout: e.target.value})}
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                      <Input
                        id="max_login_attempts"
                        type="number"
                        value={securityForm.max_login_attempts}
                        onChange={(e) => setSecurityForm({...securityForm, max_login_attempts: e.target.value})}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_2fa"
                      checked={securityForm.require_2fa}
                      onCheckedChange={(checked) => setSecurityForm({...securityForm, require_2fa: checked})}
                    />
                    <Label htmlFor="require_2fa">Require Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="password_policy"
                      checked={securityForm.password_policy}
                      onCheckedChange={(checked) => setSecurityForm({...securityForm, password_policy: checked})}
                    />
                    <Label htmlFor="password_policy">Enforce Password Policy</Label>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSecuritySave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Security Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Advanced Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="api_rate_limit">API Rate Limit (requests per minute)</Label>
                      <Input
                        id="api_rate_limit"
                        type="number"
                        value={advancedForm.api_rate_limit}
                        onChange={(e) => setAdvancedForm({...advancedForm, api_rate_limit: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cache_ttl">Cache TTL (seconds)</Label>
                      <Input
                        id="cache_ttl"
                        type="number"
                        value={advancedForm.cache_ttl}
                        onChange={(e) => setAdvancedForm({...advancedForm, cache_ttl: e.target.value})}
                        placeholder="3600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <select
                      id="backup_frequency"
                      value={advancedForm.backup_frequency}
                      onChange={(e) => setAdvancedForm({...advancedForm, backup_frequency: e.target.value})}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      title="Select backup frequency"
                      aria-label="Backup Frequency Selection"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="debug_mode"
                      checked={advancedForm.debug_mode}
                      onCheckedChange={(checked) => setAdvancedForm({...advancedForm, debug_mode: checked})}
                    />
                    <Label htmlFor="debug_mode">Debug Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="analytics_enabled"
                      checked={advancedForm.analytics_enabled}
                      onCheckedChange={(checked) => setAdvancedForm({...advancedForm, analytics_enabled: checked})}
                    />
                    <Label htmlFor="analytics_enabled">Enable Analytics</Label>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleAdvancedSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Advanced Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Version:</span> 1.0.0</p>
                      <p><span className="font-medium">Environment:</span> Development</p>
                      <p><span className="font-medium">Database:</span> MySQL</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Last Backup:</span> Never</p>
                      <p><span className="font-medium">Uptime:</span> 2 days, 5 hours</p>
                      <p><span className="font-medium">Memory Usage:</span> 45%</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button size="sm" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

