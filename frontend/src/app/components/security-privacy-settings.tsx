import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, Lock, Eye, EyeOff, Key } from 'lucide-react';

export function SecurityPrivacySettings() {
  useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords do not match or are too short (minimum 8 characters)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card className="border-2 border-gray-300 shadow-lg dark:bg-[#2a2a3e] dark:border-[#f3f3f5]">
        <CardHeader className="border-b-2 border-red-200 dark:border-red-700/50 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 dark:from-red-800 dark:via-rose-800 dark:to-orange-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-white/30 rounded-lg flex items-center justify-center shadow-xl">
                <Shield className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white drop-shadow-md">
                  Security & Privacy
                </CardTitle>
                <p className="text-sm text-white/90 drop-shadow-sm mt-0.5">
                  Manage your account security settings
                </p>
              </div>
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white shadow-lg">
              <Lock className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Password Change */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-green-600 dark:text-green-400" />
              Change Password
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-lg text-sm border-2 dark:bg-[#2a2a3e] dark:border-[#f3f3f5] dark:text-white dark:placeholder-[#f3f3f5]/60 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 dark:bg-[#2a2a3e] dark:border-[#f3f3f5] dark:text-white dark:placeholder-[#f3f3f5]/60 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 rounded-lg text-sm border-2 dark:bg-[#2a2a3e] dark:border-[#f3f3f5] dark:text-white dark:placeholder-[#f3f3f5]/60 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-sm shadow-md"
              >
                Update Password
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}