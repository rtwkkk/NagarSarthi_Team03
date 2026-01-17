import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Settings,
  User,
  Shield,
  Palette,
  Mail,
  Smartphone,
  Globe,
  Save,
  Moon,
  Sun,
  Users,
  Eye,
  Sliders,
  LogOut
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { SecurityPrivacySettings } from './security-privacy-settings';
import { useAuth } from '../contexts/auth-context';
import { useDarkMode } from '../contexts/dark-mode-context';
import { useLanguage } from '../contexts/language-context';

// Settings View Component - Enhanced with Dark Mode Support
export function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, signOut, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { language, setLanguage } = useLanguage();

  // Local state for profile form
  const [profileData, setProfileData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '+91 98765 43210', // Default placeholder
    authorityId: 'JMP-ADMIN-2024-001' // Default placeholder
  });

  const handleSignOut = async () => {
    await signOut();
  };


  const handleSaveAll = async () => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    if (!fullName) {
      alert('Name cannot be empty.');
      return;
    }

    const success = await updateProfile({
      name: fullName,
      // Note: We're not updating email here as it requires re-authentication usually
    });

    if (success) {
      alert('All configuration changes have been securely saved to the system.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile Management', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { id: 'system', label: 'System Configuration', icon: Settings, color: 'from-purple-500 to-pink-500' },
    { id: 'users', label: 'User Roles', icon: Users, color: 'from-indigo-500 to-blue-500' },
    { id: 'signout', label: 'Check Out', icon: LogOut, color: 'from-red-500 to-rose-500', isDestructive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95"
        >
          <Save className="w-4 h-4" />
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className={`space-y-2 p-4 rounded-xl transition-colors ${darkMode
          ? 'bg-slate-800/50 border border-slate-700/50'
          : 'bg-gray-50/50'
          }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isDestructive = tab.isDestructive;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-all duration-200 ${darkMode
                  ? isDestructive
                    ? activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-900/80 to-rose-900/80 shadow-lg shadow-red-900/30 scale-[1.02] border border-red-700/50'
                      : 'bg-slate-700/50 shadow-md hover:shadow-xl hover:shadow-red-900/20 hover:scale-[1.01] hover:bg-red-900/30 border border-slate-600/50 hover:border-red-700/50'
                    : activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-900/80 to-cyan-900/80 shadow-lg shadow-blue-900/30 scale-[1.02] border border-blue-700/50'
                      : 'bg-slate-700/50 shadow-md hover:shadow-xl hover:shadow-blue-900/20 hover:scale-[1.01] hover:bg-blue-900/30 border border-slate-600/50 hover:border-blue-700/50'
                  : isDestructive
                    ? activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 shadow-lg scale-[1.02]'
                      : 'bg-white shadow-md hover:shadow-xl hover:scale-[1.01] hover:bg-red-50/50'
                    : activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg scale-[1.02]'
                      : 'bg-white shadow-md hover:shadow-xl hover:scale-[1.01]'
                  }`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${tab.color} rounded-lg flex items-center justify-center shadow-md ${darkMode && activeTab === tab.id ? 'ring-2 ring-white/30' : ''
                  }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`font-semibold text-sm ${darkMode
                  ? isDestructive
                    ? activeTab === tab.id
                      ? 'text-red-200'
                      : 'text-red-300'
                    : activeTab === tab.id
                      ? 'text-blue-100'
                      : 'text-slate-200'
                  : isDestructive
                    ? activeTab === tab.id
                      ? 'text-red-900'
                      : 'text-red-600'
                    : activeTab === tab.id
                      ? 'text-blue-900'
                      : 'text-gray-700'
                  }`}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className={`ml-auto w-2 h-2 rounded-full ${darkMode
                    ? isDestructive ? 'bg-red-400 shadow-lg shadow-red-400/50' : 'bg-blue-400 shadow-lg shadow-blue-400/50'
                    : isDestructive ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Management */}
          {activeTab === 'profile' && (
            <>
              <Card className={`shadow-lg transition-colors border-2 ${darkMode
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'border-gray-200'
                }`}>
                <CardHeader className={`border-b-2 shadow-lg transition-colors ${darkMode
                  ? 'border-blue-700/50 bg-gradient-to-r from-blue-800 via-cyan-800 to-blue-700'
                  : 'border-blue-200 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-white/30 rounded-lg flex items-center justify-center shadow-xl">
                      <User className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white drop-shadow-md">
                        Profile Information
                      </CardTitle>
                      <p className="text-sm text-white/90 drop-shadow-sm mt-0.5">
                        Manage your account details and credentials
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className={`flex items-center gap-6 mb-6 p-4 rounded-xl border-2 transition-colors ${darkMode
                    ? 'bg-gradient-to-br from-slate-700/40 to-slate-800/40 border-slate-600/50'
                    : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50'
                    }`}>
                    <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg ${darkMode ? 'ring-4 ring-blue-900/30' : ''
                      }`}>
                      <User className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{user?.name || 'Admin User'}</h3>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'
                        }`}>Municipal</p>
                      <Badge className={`mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md ${darkMode ? 'shadow-blue-900/30' : ''
                        }`}>{user?.role || 'Super Admin'}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                        }`}>
                        First Name
                      </label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                        className={`transition-colors ${darkMode
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20'
                          : 'border-gray-300'
                          }`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                        }`}>
                        Last Name
                      </label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                        className={`transition-colors ${darkMode
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20'
                          : 'border-gray-300'
                          }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-200' : 'text-gray-700'
                      }`}>
                      <Mail className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      Email Address (Read Only)
                    </label>
                    <Input
                      value={profileData.email}
                      readOnly
                      type="email"
                      className={`transition-colors opacity-70 cursor-not-allowed ${darkMode
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400'
                        : 'border-gray-300 bg-gray-50'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-200' : 'text-gray-700'
                      }`}>
                      <Smartphone className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'
                        }`} />
                      Phone Number
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      type="tel"
                      className={`transition-colors ${darkMode
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20'
                        : 'border-gray-300'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-200' : 'text-gray-700'
                      }`}>
                      <Shield className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'
                        }`} />
                      Municipal Authority Credentials
                    </label>
                    <Input
                      value={profileData.authorityId}
                      onChange={(e) => handleInputChange('authorityId', e.target.value)}
                      placeholder="Authority ID"
                      className={`transition-colors font-mono ${darkMode
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20'
                        : 'border-gray-300'
                        }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <SecurityPrivacySettings />
          )}

          {/* System Configuration */}
          {activeTab === 'system' && (
            <>
              <Card className={`shadow-lg transition-colors ${darkMode
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'border-gray-200'
                }`}>
                <CardHeader className={`border-b transition-colors ${darkMode
                  ? 'border-slate-700/50 bg-gradient-to-r from-purple-900/40 to-pink-900/40'
                  : 'border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50'
                  }`}>
                  <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-purple-100' : 'text-blue-900'
                    }`}>
                    <Settings className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Appearance */}
                  <div>
                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                      <Palette className="w-4 h-4" />
                      Appearance
                    </h4>
                    <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${darkMode
                      ? 'bg-slate-700/30 border-slate-600/50'
                      : 'bg-gray-50 border-gray-200'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-yellow-100/10' : 'bg-blue-100'}`}>
                          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>Dark Mode</p>
                          <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'
                            }`}>{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`p-2.5 rounded-full border transition-all duration-200 ${darkMode
                          ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-yellow-500'
                          : 'bg-white hover:bg-gray-50 border-gray-200 text-blue-600'
                          }`}
                      >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Regional Settings */}
                  <div>
                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                      <Globe className="w-4 h-4" />
                      Regional Settings
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                          }`}>
                          Language
                        </label>
                        <Select
                          value={language}
                          onValueChange={(val: any) => setLanguage(val)}
                        >
                          <SelectTrigger className={`${darkMode
                            ? 'bg-slate-700/50 border-slate-600/50 text-white'
                            : 'border-gray-300'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                          }`}>
                          Time Zone
                        </label>
                        <Select defaultValue="ist">
                          <SelectTrigger className={`${darkMode
                            ? 'bg-slate-700/50 border-slate-600/50 text-white'
                            : 'border-gray-300'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                          }`}>
                          Date Format
                        </label>
                        <Select defaultValue="dd-mm-yyyy">
                          <SelectTrigger className={`${darkMode
                            ? 'bg-slate-700/50 border-slate-600/50 text-white'
                            : 'border-gray-300'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                            <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                            <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* System Parameters */}
                  <div>
                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                      <Sliders className="w-4 h-4" />
                      Advanced Parameters
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                          }`}>
                          Map Refresh Interval (seconds)
                        </label>
                        <Select defaultValue="30">
                          <SelectTrigger className={`${darkMode
                            ? 'bg-slate-700/50 border-slate-600/50 text-white'
                            : 'border-gray-300'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">60 seconds</SelectItem>
                            <SelectItem value="120">2 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-700'
                          }`}>
                          Auto-assign Teams
                        </label>
                        <Select defaultValue="manual">
                          <SelectTrigger className={`${darkMode
                            ? 'bg-slate-700/50 border-slate-600/50 text-white'
                            : 'border-gray-300'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Assignment Only</SelectItem>
                            <SelectItem value="auto-critical">Auto-assign Critical Only</SelectItem>
                            <SelectItem value="auto-all">Auto-assign All Incidents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* User Roles */}
          {activeTab === 'users' && (
            <Card className={`shadow-lg transition-colors ${darkMode
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'border-gray-200'
              }`}>
              <CardHeader className={`border-b transition-colors ${darkMode
                ? 'border-slate-700/50 bg-gradient-to-r from-indigo-900/40 to-blue-900/40'
                : 'border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50'
                }`}>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-blue-100' : 'text-blue-900'
                  }`}>
                  <Users className="w-5 h-5" />
                  User Role Management
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      name: 'Ward Officers',
                      count: 24,
                      access: 'View & Report',
                      color: 'blue',
                      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
                      badgeBg: 'bg-blue-500',
                      permissions: ['View Dashboard', 'Report Incidents', 'View Analytics']
                    },
                    {
                      name: 'Field Teams',
                      count: 18,
                      access: 'Mobile App Only',
                      color: 'green',
                      bgGradient: 'bg-gradient-to-br from-green-500 to-green-600',
                      badgeBg: 'bg-green-500',
                      permissions: ['Update Status', 'Upload Photos', 'Mark Resolved']
                    },
                    {
                      name: 'Supervisors',
                      count: 6,
                      access: 'Assign & Monitor',
                      color: 'purple',
                      bgGradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
                      badgeBg: 'bg-purple-500',
                      permissions: ['All Ward Officer', 'Assign Teams', 'View Reports']
                    },
                    {
                      name: 'Super Admins',
                      count: 2,
                      access: 'Full Control',
                      color: 'red',
                      bgGradient: 'bg-gradient-to-br from-red-500 to-red-600',
                      badgeBg: 'bg-red-500',
                      permissions: ['All Permissions', 'User Management', 'System Config']
                    },
                  ].map((role, index) => (
                    <div
                      key={index}
                      className={`p-5 rounded-lg border-2 transition-all ${darkMode
                        ? 'border-slate-700/50 bg-slate-700/30 hover:bg-slate-700/50 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/20'
                        : 'border-gray-200 bg-white hover:shadow-lg'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${role.bgGradient} rounded-lg flex items-center justify-center shadow-md ${darkMode ? 'ring-2 ring-slate-600/50' : ''
                            }`}>
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className={`font-bold ${darkMode ? 'text-slate-100' : 'text-gray-900'
                              }`}>{role.name}</h4>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'
                              }`}>{role.access}</p>
                          </div>
                        </div>
                        <Badge className={`${role.badgeBg} text-white border-0`}>
                          {role.count} users
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="outline" className={`text-xs ${darkMode
                            ? 'bg-slate-800/50 border-slate-600/50 text-slate-300'
                            : 'bg-gray-50'
                            }`}>
                            {perm}
                          </Badge>
                        ))}
                      </div>

                      <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${darkMode ? 'border-slate-600/50' : 'border-gray-200'
                        }`}>
                        <Button variant="outline" size="sm" className={`flex-1 ${darkMode
                          ? 'border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/50 text-slate-200 hover:text-slate-100'
                          : ''
                          }`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Users
                        </Button>
                        <Button variant="outline" size="sm" className={`flex-1 ${darkMode
                          ? 'border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/50 text-slate-200 hover:text-slate-100'
                          : ''
                          }`}>
                          <Settings className="w-4 h-4 mr-1" />
                          Edit Permissions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sign Out */}
          {activeTab === 'signout' && (
            <Card className={`shadow-lg transition-colors border-[3px] ${darkMode
              ? 'bg-slate-800/50 border-red-800'
              : 'border-red-300'
              }`}>
              <CardHeader className={`border-b-2 shadow-lg transition-colors ${darkMode
                ? 'border-red-700/50 bg-gradient-to-r from-red-800 via-rose-800 to-orange-700'
                : 'border-red-200 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-white/30 rounded-lg flex items-center justify-center shadow-xl`}>
                    <LogOut className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white drop-shadow-md">
                      Check Out
                    </CardTitle>
                    <p className="text-sm text-white/90 drop-shadow-sm mt-0.5">
                      End your current session
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
                  <div className={`w-24 h-24 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg ${darkMode ? 'ring-4 ring-red-900/30' : ''
                    }`}>
                    <LogOut className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Check Out of Your Account</h3>
                    <p className={`max-w-md ${darkMode ? 'text-slate-200' : 'text-gray-600'
                      }`}>
                      You are about to check out of the Nagar Sarthi Admin Dashboard. \
                      You will be redirected to the login page.
                    </p>
                  </div>

                  <div className="w-full max-w-md space-y-3 pt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white gap-2 py-6 text-base font-semibold shadow-lg"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-5 h-5" />
                      Confirm Check Out
                    </Button>

                    <Button
                      variant="outline"
                      className={`w-full py-6 text-base ${darkMode
                        ? 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 text-white hover:text-white'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className={`pt-6 border-t w-full max-w-md ${darkMode ? 'border-slate-600/50' : 'border-gray-200'
                    }`}>
                    <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-500'
                      }`}>
                      Your current session will be terminated and you will need to log in again \
                      to access the dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
