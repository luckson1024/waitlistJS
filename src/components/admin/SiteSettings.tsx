import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Globe, 
  Mail, 
  Shield, 
  Palette, 
  Eye,
  EyeOff,
  AlertTriangle,
  Share2,
  BarChart3,
  Bell,
  Wrench,
  FileText,
  Smartphone,
  Plus,
  Trash2
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { SiteSettings } from '../../types/settings';

export default function AdminSiteSettings() {
  const { settings, updateSettings, exportSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKeys, setShowApiKeys] = useState(false);

  const handleInputChange = (field: keyof SiteSettings | string, value: unknown) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setLocalSettings(prev => ({ ...prev, [field]: value }));
    } else if (keys.length === 2) {
      setLocalSettings(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof SiteSettings] as object),
          [keys[1]]: value
        }
      }));
    } else if (keys.length === 3) {
      setLocalSettings(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof SiteSettings] as object),
          [keys[1]]: {
            ...((prev[keys[0] as keyof SiteSettings] as Record<string, unknown>)[keys[1]] as Record<string, unknown>),
            [keys[2]]: value
          }
        }
      }));
    }
    setHasChanges(true);
  };

  const handleArrayChange = (field: keyof SiteSettings, value: string[]) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCustomLinksChange = (links: Array<{label: string; url: string; openInNewTab: boolean}>) => {
    setLocalSettings(prev => ({
      ...prev,
      footerSettings: {
        ...prev.footerSettings,
        customLinks: links
      }
    }));
    setHasChanges(true);
  };

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      // For demo purposes, we'll create a local URL
      const url = URL.createObjectURL(file);
      handleInputChange(field, url);
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };


  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setLocalSettings(importedSettings);
          setHasChanges(true);
        } catch {
          alert('Invalid settings file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'seo', label: 'SEO & Meta', icon: BarChart3 },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'waitlist', label: 'Waitlist', icon: Smartphone },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'footer', label: 'Footer', icon: FileText },
    { id: 'features', label: 'Features', icon: Wrench },
    { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
    { id: 'legal', label: 'Legal', icon: FileText }
  ];

  const renderInput = (
    label: string,
    field: string,
    type: 'text' | 'email' | 'url' | 'number' | 'password' | 'tel' | 'datetime-local' = 'text',
    placeholder?: string,
    description?: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={field.includes('.') ? 
          (() => {
            const result = field.split('.').reduce((obj: unknown, key: string) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined), localSettings);
            return (typeof result === 'string' || typeof result === 'number') ? result : '';
          })() :
          (localSettings[field as keyof SiteSettings] as string) || ''
        }
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  const renderFileUpload = (
    label: string,
    field: string,
    accept: string = 'image/*',
    description?: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={field.includes('.') ? 
            (() => {
              const result = field.split('.').reduce((obj: unknown, key: string) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined), localSettings);
              return (typeof result === 'string' || typeof result === 'number') ? result : '';
            })() :
            (localSettings[field as keyof SiteSettings] as string) || ''
          }
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder="Enter URL or upload file"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
          <Upload className="h-4 w-4" />
          Upload
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileUpload(field, e)}
            className="hidden"
          />
        </label>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  const renderTextarea = (
    label: string,
    field: string,
    placeholder?: string,
    rows: number = 3
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={(localSettings[field as keyof SiteSettings] as string) || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );

  const renderCheckbox = (
    label: string,
    field: string,
    description?: string
  ) => (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={field}
        checked={field.includes('.') ? 
          (() => {
            const result = field.split('.').reduce((obj: unknown, key: string) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined), localSettings);
            return typeof result === 'boolean' ? result : false;
          })() :
          (localSettings[field as keyof SiteSettings] as boolean) || false
        }
        onChange={(e) => handleInputChange(field, e.target.checked)}
        className="mt-1 w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
      />
      <div className="flex-1">
        <label htmlFor={field} className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );

  const renderSelect = (
    label: string,
    field: string,
    options: { value: string; label: string }[],
    description?: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={(localSettings[field as keyof SiteSettings] as string) || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  const renderArrayInput = (label: string, field: keyof SiteSettings) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {(localSettings[field] as string[]).map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newArray = [...(localSettings[field] as string[])];
              newArray[index] = e.target.value;
              handleArrayChange(field, newArray);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            onClick={() => {
              const newArray = (localSettings[field] as string[]).filter((_, i) => i !== index);
              handleArrayChange(field, newArray);
            }}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => handleArrayChange(field, [...(localSettings[field] as string[]), ''])}
        className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-200"
      >
        <Plus className="h-4 w-4" />
        Add Item
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput('Site Name', 'siteName', 'text', 'MYZUWA')}
              {renderInput('Site URL', 'siteUrl', 'url', 'https://myzuwa.com')}
              {renderFileUpload('Logo URL', 'logoUrl', 'image/*', 'Upload your site logo')}
              {renderFileUpload('Favicon URL', 'faviconUrl', 'image/x-icon,image/png', 'Upload your site favicon')}
            </div>
            {renderTextarea('Site Description', 'siteDescription', 'Brief description of your site')}
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Footer Settings</h3>
            <div className="space-y-4">
              {renderCheckbox('Show Footer', 'footerSettings.showFooter', 'Display footer on all pages')}
              {renderInput('Company Address', 'footerSettings.companyAddress', 'text', '123 Main St, City, Country')}
              {renderInput('Company Phone', 'footerSettings.companyPhone', 'tel', '+1 (555) 123-4567')}
              {renderInput('Footer Text', 'footerSettings.footerText', 'text', 'Made with ❤️ for creators')}
              {renderCheckbox('Show Social Links', 'footerSettings.showSocialLinks', 'Display social media links in footer')}
              {renderCheckbox('Show Legal Links', 'footerSettings.showLegalLinks', 'Display privacy policy, terms, etc.')}
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Custom Footer Links</h4>
                {localSettings.footerSettings.customLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      placeholder="Link Label"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...localSettings.footerSettings.customLinks];
                        newLinks[index] = { ...link, label: e.target.value };
                        handleCustomLinksChange(newLinks);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...localSettings.footerSettings.customLinks];
                        newLinks[index] = { ...link, url: e.target.value };
                        handleCustomLinksChange(newLinks);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`newTab-${index}`}
                        checked={link.openInNewTab}
                        onChange={(e) => {
                          const newLinks = [...localSettings.footerSettings.customLinks];
                          newLinks[index] = { ...link, openInNewTab: e.target.checked };
                          handleCustomLinksChange(newLinks);
                        }}
                        className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <label htmlFor={`newTab-${index}`} className="text-sm text-gray-700">New Tab</label>
                      <button
                        onClick={() => {
                          const newLinks = localSettings.footerSettings.customLinks.filter((_, i) => i !== index);
                          handleCustomLinksChange(newLinks);
                        }}
                        className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newLinks = [...localSettings.footerSettings.customLinks, { label: '', url: '', openInNewTab: false }];
                    handleCustomLinksChange(newLinks);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Link
                </button>
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">SEO & Meta Tags</h3>
            <div className="space-y-4">
              {renderInput('Meta Title', 'metaTitle', 'text', 'Myzuwa - Join the Waitlist')}
              {renderTextarea('Meta Description', 'metaDescription', 'SEO description for search engines')}
              {renderArrayInput('Meta Keywords', 'metaKeywords')}
              {renderFileUpload('Open Graph Image', 'ogImage', 'image/*', 'Social media preview image')}
              {renderInput('Twitter Handle', 'twitterHandle', 'text', '@myzuwa')}
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Configuration</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput('Admin Email', 'adminEmail', 'email', 'admin@myzuwa.com')}
              {renderInput('Support Email', 'supportEmail', 'email', 'support@myzuwa.com')}
              {renderInput('Notification Email', 'notificationEmail', 'email', 'notifications@myzuwa.com')}
              {renderInput('Email From Name', 'emailFromName', 'text', 'Myzuwa Team')}
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput('Facebook', 'socialMedia.facebook', 'url', 'https://facebook.com/myzuwa')}
              {renderInput('Twitter', 'socialMedia.twitter', 'url', 'https://twitter.com/myzuwa')}
              {renderInput('Instagram', 'socialMedia.instagram', 'url', 'https://instagram.com/myzuwa')}
              {renderInput('LinkedIn', 'socialMedia.linkedin', 'url', 'https://linkedin.com/company/myzuwa')}
              {renderInput('YouTube', 'socialMedia.youtube', 'url', 'https://youtube.com/@myzuwa')}
              {renderInput('TikTok', 'socialMedia.tiktok', 'url', 'https://tiktok.com/@myzuwa')}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Analytics & Tracking</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Show API Keys</span>
                <button
                  onClick={() => setShowApiKeys(!showApiKeys)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                >
                  {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showApiKeys ? 'Hide' : 'Show'}
                </button>
              </div>
              {renderInput('Google Analytics ID', 'googleAnalyticsId', showApiKeys ? 'text' : 'password', 'GA-XXXXXXXXX')}
              {renderInput('Facebook Pixel ID', 'facebookPixelId', showApiKeys ? 'text' : 'password', '1234567890')}
              {renderInput('Hotjar ID', 'hotjarId', showApiKeys ? 'text' : 'password', '1234567')}
            </div>
          </div>
        );

      case 'waitlist':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Waitlist Configuration</h3>
            <div className="space-y-4">
              {renderCheckbox('Enable Waitlist', 'waitlistEnabled', 'Allow users to join the waitlist')}
              {renderInput('Max Waitlist Entries', 'maxWaitlistEntries', 'number', '50000')}
              {renderCheckbox('Require Phone Number', 'requirePhoneNumber', 'Make phone number mandatory')}
              {renderCheckbox('Enable Tutorial Book', 'enableTutorialBook', 'Show tutorial book option')}
              {renderCheckbox('Auto Email Confirmation', 'autoEmailConfirmation', 'Send confirmation emails automatically')}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
            <div className="space-y-4">
              {renderCheckbox('New Signup Notifications', 'emailNotifications.newSignup', 'Get notified when someone joins the waitlist')}
              {renderCheckbox('Daily Reports', 'emailNotifications.dailyReport', 'Receive daily summary reports')}
              {renderCheckbox('Weekly Reports', 'emailNotifications.weeklyReport', 'Receive weekly summary reports')}
              {renderCheckbox('Export Reminders', 'emailNotifications.exportReminder', 'Get reminded to export data regularly')}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            <div className="space-y-4">
              {renderCheckbox('Enable CAPTCHA', 'enableCaptcha', 'Add CAPTCHA to forms for bot protection')}
              {renderCheckbox('Rate Limiting', 'rateLimitEnabled', 'Limit form submissions per hour')}
              {renderInput('Max Attempts Per Hour', 'maxAttemptsPerHour', 'number', '10')}
              {renderInput('Session Timeout (minutes)', 'sessionTimeout', 'number', '30')}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
            <div className="space-y-4">
              {renderSelect('Theme', 'theme', [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto (System)' }
              ])}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localSettings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localSettings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Feature Flags</h3>
            <div className="space-y-4">
              {renderCheckbox('Admin Dashboard', 'features.adminDashboard', 'Enable the admin dashboard')}
              {renderCheckbox('Content Editor', 'features.contentEditor', 'Allow content editing')}
              {renderCheckbox('CSV Export', 'features.csvExport', 'Enable data export functionality')}
              {renderCheckbox('Real-time Stats', 'features.realTimeStats', 'Show live statistics')}
              {renderCheckbox('Advanced Filters', 'features.advancedFilters', 'Enable advanced filtering options')}
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Maintenance Mode</span>
                </div>
                <p className="text-sm text-yellow-700">
                  When enabled, visitors will see a maintenance message instead of the normal site.
                </p>
              </div>
              {renderCheckbox('Enable Maintenance Mode', 'maintenanceMode', 'Show maintenance page to visitors')}
              {renderTextarea('Maintenance Message', 'maintenanceMessage', 'Message to show during maintenance')}
              {renderInput('Maintenance End Time', 'maintenanceEndTime', 'datetime-local', '', 'When maintenance is expected to end')}
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Legal & Compliance</h3>
            <div className="space-y-4">
              {renderInput('Privacy Policy URL', 'privacyPolicyUrl', 'url', '/privacy')}
              {renderInput('Terms of Service URL', 'termsOfServiceUrl', 'url', '/terms')}
              {renderInput('Cookie Policy URL', 'cookiePolicyUrl', 'url', '/cookies')}
              {renderCheckbox('GDPR Compliant', 'gdprCompliant', 'Enable GDPR compliance features')}
              {renderInput('Data Retention (days)', 'dataRetentionDays', 'number', '365')}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-gray-600">Configure your site settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
            id="import-settings"
          />
          <label
            htmlFor="import-settings"
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Import
          </label>
          
          <button
            onClick={exportSettings}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          {hasChanges && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Save Indicator */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-orange-100 border border-orange-200 rounded-lg p-4 shadow-lg">
          <p className="text-orange-800 font-medium">You have unsaved changes</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-orange-600 border border-orange-200 rounded text-sm hover:bg-orange-50"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}