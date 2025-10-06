'use client';

import { useState, useEffect } from 'react';
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
import { updateSettingSchema, type UpdateSettingInput } from '@/lib/validations';
import { Setting } from '@/lib/types';
import { Save, RefreshCw, Shield, User, Globe, Mail, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update setting
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

  // Get setting value
  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || '';
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

  // Handle switch change
  const handleSwitchChange = (key: string, checked: boolean) => {
    updateSetting(key, checked.toString());
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
                        value={getSettingValue('site_name')}
                        onChange={(e) => updateSetting('site_name', e.target.value)}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default_currency">Default Currency</Label>
                      <Input
                        id="default_currency"
                        value={getSettingValue('default_currency')}
                        onChange={(e) => updateSetting('default_currency', e.target.value)}
                        placeholder="e.g., IDR, USD, EUR"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={getSettingValue('site_description')}
                      onChange={(e) => updateSetting('site_description', e.target.value)}
                      placeholder="Enter site description"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenance_mode"
                      checked={getSettingValue('maintenance_mode') === 'true'}
                      onCheckedChange={(checked) => handleSwitchChange('maintenance_mode', checked)}
                    />
                    <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
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
                        value={getSettingValue('default_theme')}
                        onChange={(e) => updateSetting('default_theme', e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        title="Select default theme"
                        aria-label="Default Theme Selection"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo_url">Logo URL</Label>
                      <Input
                        id="logo_url"
                        value={getSettingValue('logo_url')}
                        onChange={(e) => updateSetting('logo_url', e.target.value)}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon_url">Favicon URL</Label>
                    <Input
                      id="favicon_url"
                      value={getSettingValue('favicon_url')}
                      onChange={(e) => updateSetting('favicon_url', e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                    />
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
                        value={getSettingValue('session_timeout')}
                        onChange={(e) => updateSetting('session_timeout', e.target.value)}
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                      <Input
                        id="max_login_attempts"
                        type="number"
                        value={getSettingValue('max_login_attempts')}
                        onChange={(e) => updateSetting('max_login_attempts', e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_2fa"
                      checked={getSettingValue('require_2fa') === 'true'}
                      onCheckedChange={(checked) => handleSwitchChange('require_2fa', checked)}
                    />
                    <Label htmlFor="require_2fa">Require Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="password_policy"
                      checked={getSettingValue('password_policy') === 'true'}
                      onCheckedChange={(checked) => handleSwitchChange('password_policy', checked)}
                    />
                    <Label htmlFor="password_policy">Enforce Password Policy</Label>
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
                        value={getSettingValue('api_rate_limit')}
                        onChange={(e) => updateSetting('api_rate_limit', e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cache_ttl">Cache TTL (seconds)</Label>
                      <Input
                        id="cache_ttl"
                        type="number"
                        value={getSettingValue('cache_ttl')}
                        onChange={(e) => updateSetting('cache_ttl', e.target.value)}
                        placeholder="3600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <select
                      id="backup_frequency"
                      value={getSettingValue('backup_frequency')}
                      onChange={(e) => updateSetting('backup_frequency', e.target.value)}
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
                      checked={getSettingValue('debug_mode') === 'true'}
                      onCheckedChange={(checked) => handleSwitchChange('debug_mode', checked)}
                    />
                    <Label htmlFor="debug_mode">Debug Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="analytics_enabled"
                      checked={getSettingValue('analytics_enabled') === 'true'}
                      onCheckedChange={(checked) => handleSwitchChange('analytics_enabled', checked)}
                    />
                    <Label htmlFor="analytics_enabled">Enable Analytics</Label>
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

