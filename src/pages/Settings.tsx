import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  ShieldCheckIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    orderUpdates: boolean;
    marketing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
  };
  privacy: {
    shareData: boolean;
    cookiePreference: 'essential' | 'all' | 'none';
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      orderUpdates: true,
      marketing: false,
    },
    appearance: {
      theme: 'system',
    },
    privacy: {
      shareData: true,
      cookiePreference: 'essential',
    },
  });

  const handleNotificationChange = (key: keyof Settings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
    toast.success('Notification preference updated');
  };

  const handleThemeChange = (theme: Settings['appearance']['theme']) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme,
      },
    }));
    toast.success('Theme updated');
  };

  const handlePrivacyChange = (key: keyof Settings['privacy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
    toast.success('Privacy setting updated');
  };

  const Switch = ({ checked }: { checked: boolean }) => (
    <div 
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
        checked ? 'bg-primary-600' : 'bg-surface-200'
      }`}
    >
      <div 
        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 left-0.5 transition-transform duration-200 ${
          checked ? 'transform translate-x-5' : ''
        }`} 
      />
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-surface-900">Settings</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BellIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-surface-900 font-medium">Email</h3>
                <p className="text-surface-500 text-sm">Receive email notifications</p>
              </div>
              <button onClick={() => handleNotificationChange('email')}>
                <Switch checked={settings.notifications.email} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-surface-900 font-medium">Push</h3>
                <p className="text-surface-500 text-sm">Receive push notifications</p>
              </div>
              <button onClick={() => handleNotificationChange('push')}>
                <Switch checked={settings.notifications.push} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-surface-900 font-medium">Order Updates</h3>
                <p className="text-surface-500 text-sm">Receive order updates notifications</p>
              </div>
              <button onClick={() => handleNotificationChange('orderUpdates')}>
                <Switch checked={settings.notifications.orderUpdates} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-surface-900 font-medium">Marketing</h3>
                <p className="text-surface-500 text-sm">Receive marketing notifications</p>
              </div>
              <button onClick={() => handleNotificationChange('marketing')}>
                <Switch checked={settings.notifications.marketing} />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <SwatchIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>

          <div>
            <h3 className="text-surface-900 font-medium mb-3">Theme</h3>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    settings.appearance.theme === theme
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-surface-200 text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Privacy</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-surface-900 font-medium">Share Usage Data</h3>
                <p className="text-surface-500 text-sm">Help us improve by sharing anonymous usage data</p>
              </div>
              <button onClick={() => handlePrivacyChange('shareData', !settings.privacy.shareData)}>
                <Switch checked={settings.privacy.shareData} />
              </button>
            </div>

            <div>
              <h3 className="text-surface-900 font-medium mb-3">Cookie Preference</h3>
              <div className="flex gap-2">
                {(['essential', 'all', 'none'] as const).map((pref) => (
                  <button
                    key={pref}
                    onClick={() => handlePrivacyChange('cookiePreference', pref)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      settings.privacy.cookiePreference === pref
                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                        : 'border-surface-200 text-surface-700 hover:bg-surface-50'
                    }`}
                  >
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
