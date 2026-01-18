import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Bell, MapPin, Users, Save } from 'lucide-react';

export function NotificationPreferences() {
  const { user } = useAuth();

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('notificationPreferences');
    return saved ? JSON.parse(saved) : {
      solvedIssues: true,
      regionalUpdates: true,
      includeMetadata: true,
      emailNotifications: true,
      smsNotifications: false,
    };
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleSave = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const togglePreference = (key: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-gray-300 shadow-lg dark:bg-[#2a2a3e] dark:border-[#f3f3f5]">
        <CardHeader className="border-b-2 border-gray-200 dark:border-[#f3f3f5]/20 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Notification Preferences
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Customize your alert settings
                </p>
              </div>
            </div>
            {user && (
              <Badge className="bg-blue-600 text-white">
                <MapPin className="w-3 h-3 mr-1" />
                {user.region}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Admin-Specific Notification Rules */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-500/30 rounded-lg p-4">
            <h3 className="text-sm font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Alert Configuration
            </h3>
            <p className="text-xs text-green-800 dark:text-green-400 mb-4">
              Regularly received notifications are limited to specific events to reduce alert fatigue.
            </p>

            {/* Solved Issues Toggle */}
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${preferences.solvedIssues
                ? 'bg-white dark:bg-[#2a2a3e] border-green-300 dark:border-green-500'
                : 'bg-gray-50 dark:bg-[#1a1a2e] border-gray-300 dark:border-[#f3f3f5]/20'
                }`}>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Solved Issues Only
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Receive notifications when incidents are marked as resolved
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('solvedIssues')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ml-4 ${preferences.solvedIssues ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${preferences.solvedIssues ? 'translate-x-7' : 'translate-x-0'
                      }`}
                  ></div>
                </button>
              </div>

              {/* Regional Updates Toggle */}
              <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${preferences.regionalUpdates
                ? 'bg-white dark:bg-[#2a2a3e] border-blue-300 dark:border-blue-500'
                : 'bg-gray-50 dark:bg-[#1a1a2e] border-gray-300 dark:border-[#f3f3f5]/20'
                }`}>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Regional Updates ({user?.region || 'All Regions'})
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Only show incidents specific to your assigned geographical area
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('regionalUpdates')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ml-4 ${preferences.regionalUpdates ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${preferences.regionalUpdates ? 'translate-x-7' : 'translate-x-0'
                      }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Metadata Configuration */}
          <div className="border-2 border-gray-200 dark:border-[#f3f3f5]/20 rounded-lg p-4 dark:bg-[#1a1a2e]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Notification Metadata
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Every "Solved" notification will automatically include:
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#2a2a3e] rounded-md border border-gray-200 dark:border-[#f3f3f5]/10">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Status Update: <strong className="text-green-600 dark:text-green-400">Solved/Resolved</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#2a2a3e] rounded-md border border-gray-200 dark:border-[#f3f3f5]/10">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Problem Region: <strong className="text-blue-600 dark:text-blue-400">Location Name</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#2a2a3e] rounded-md border border-gray-200 dark:border-[#f3f3f5]/10">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Resolved By: <strong className="text-purple-600 dark:text-purple-400">Team/Individual Name</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="border-2 border-gray-200 dark:border-[#f3f3f5]/20 rounded-lg p-4 dark:bg-[#1a1a2e]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Delivery Methods
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                <button
                  onClick={() => togglePreference('emailNotifications')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${preferences.emailNotifications ? 'translate-x-7' : 'translate-x-0'
                      }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                <button
                  onClick={() => togglePreference('smsNotifications')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${preferences.smsNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${preferences.smsNotifications ? 'translate-x-7' : 'translate-x-0'
                      }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Example Notification */}
          <div className="border-2 border-blue-200 dark:border-blue-500/30 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
              Example Notification
            </h3>
            <div className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <p><strong>Status:</strong> ✅ Solved</p>
              <p><strong>Region:</strong> {user?.region || 'Jamshedpur'} - Bistupur Market Area</p>
              <p><strong>Resolved By:</strong> Field Team Alpha (Rahul Kumar)</p>
              <p><strong>Issue:</strong> Road blockage cleared successfully</p>
              <p className="text-blue-600 dark:text-blue-300 mt-2">
                📧 Sent to: {user?.email || 'admin@nagarsarthi.gov.in'}
              </p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Preferences Saved!' : 'Save Preferences'}
          </Button>

          {saved && (
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                ✓ Your notification preferences have been updated successfully
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
