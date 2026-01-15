import { X, User, Mail, Phone, MapPin, Calendar, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSettings?: (tab: string) => void;
}

export function ProfileSidebar({ isOpen, onClose, onNavigateToSettings }: ProfileSidebarProps) {
  const { user, signOut } = useAuth();

  const handleNavigate = (tab: string) => {
    if (onNavigateToSettings) {
      onNavigateToSettings(tab);
      onClose();
    }
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to check out?')) {
      signOut();
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-screen w-96 bg-white dark:bg-[#2a2a3e] border-l-2 border-gray-300 dark:border-[#f3f3f5] shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="h-[73px] border-b-2 border-gray-300 dark:border-[#f3f3f5]/20 bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-between px-6">
          <h2 className="text-white font-bold text-base tracking-wide">ADMIN PROFILE</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
            aria-label="Close profile sidebar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {/* Profile Header Card */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-b-2 border-gray-200 dark:border-[#f3f3f5]/20">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-xl mb-4 ring-4 ring-white dark:ring-[#2a2a3e]">
                <User className="w-12 h-12 text-white" />
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user?.name || 'Admin User'}</h3>
              <Badge className="bg-blue-600 text-white mb-2">{user?.role || 'Super Admin'}</Badge>
              <p className="text-xs text-gray-600 dark:text-gray-400">Municipal Authority</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">Contact Information</h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-[#f3f3f5]/10">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Email Address</p>
                  <p className="text-sm text-gray-900 dark:text-white font-semibold">{user?.email || 'admin@nagarsarthi.gov.in'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-[#f3f3f5]/10">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Phone Number</p>
                  <p className="text-sm text-gray-900 dark:text-white font-semibold">+91 9876543210</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-[#f3f3f5]/10">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Office Location</p>
                  <p className="text-sm text-gray-900 dark:text-white font-semibold">{user?.region || 'Jamshedpur'}, Jharkhand</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-[#f3f3f5]/10">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Last Login</p>
                  <p className="text-sm text-gray-900 dark:text-white font-semibold">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Today at 9:30 AM'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t-2 border-gray-200 dark:border-[#f3f3f5]/20">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">Activity Summary</h4>

            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-gray-200 dark:border-[#f3f3f5]/10 shadow-sm dark:bg-[#1a1a2e]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">247</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Incidents Reviewed</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-[#f3f3f5]/10 shadow-sm dark:bg-[#1a1a2e]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">189</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Teams Assigned</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-[#f3f3f5]/10 shadow-sm dark:bg-[#1a1a2e]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">4.2m</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-[#f3f3f5]/10 shadow-sm dark:bg-[#1a1a2e]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">98.5%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3 border-t-2 border-gray-200 dark:border-[#f3f3f5]/20">
            <Button
              className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Settings className="w-4 h-4" />
              Account Settings
            </Button>

            <Button
              onClick={() => handleNavigate('security')}
              variant="outline"
              className="w-full justify-start gap-3 border-gray-300 dark:border-[#f3f3f5]/20 hover:bg-gray-50 dark:hover:bg-[#1a1a2e] dark:text-white"
            >
              <Shield className="w-4 h-4" />
              Security & Privacy
            </Button>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start gap-3 border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-400 mt-4"
            >
              <LogOut className="w-4 h-4" />
              Check Out
            </Button>
          </div>

          {/* Footer Info */}
          <div className="p-6 border-t-2 border-gray-300 dark:border-[#f3f3f5]/20 bg-gray-50 dark:bg-[#1a1a2e]">
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Government of India</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Smart Cities Mission • Nagar Alert Hub v2.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}