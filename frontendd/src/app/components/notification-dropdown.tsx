import { Bell, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical: Road Blockage at Bistupur',
    message: 'Major traffic disruption reported. Immediate action required.',
    time: '2 minutes ago',
    icon: AlertTriangle,
    unread: true,
  },
  {
    id: 2,
    type: 'success',
    title: 'Incident Resolved: Water Leak Fixed',
    message: 'Sakchi Main Road water leak has been successfully resolved.',
    time: '15 minutes ago',
    icon: CheckCircle,
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Pending Verification: 12 New Reports',
    message: 'Multiple incidents awaiting manual verification.',
    time: '1 hour ago',
    icon: Clock,
    unread: true,
  },
  {
    id: 4,
    type: 'info',
    title: 'Report Rejected: False Alarm',
    message: 'Kadma Junction report marked as false alarm.',
    time: '2 hours ago',
    icon: XCircle,
    unread: false,
  },
  {
    id: 5,
    type: 'success',
    title: 'Team Assigned: Sonari Zone',
    message: 'Field team dispatched to handle street light outage.',
    time: '3 hours ago',
    icon: CheckCircle,
    unread: false,
  },
];

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  if (!isOpen) return null;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400';
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Dropdown Card */}
      <div className="absolute top-16 right-0 z-50 w-96 animate-in slide-in-from-top-5 duration-200">
        <Card className="border-2 border-gray-300 dark:border-blue-900/50 shadow-2xl dark:bg-slate-800">
          <CardHeader className="border-b-2 border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-base font-bold text-gray-900 dark:text-white">Notifications</CardTitle>
              </div>
              <Badge className="bg-red-500 dark:bg-red-600 text-white">
                {notifications.filter(n => n.unread).length} New
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 max-h-[500px] overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/50 dark:bg-blue-950/30' : 'bg-white dark:bg-slate-800'
                    }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeStyles(notification.type)}`}>
                      <Icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                          {notification.title}
                        </h4>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>

          <div className="p-3 border-t-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <button className="w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">
              View All Notifications →
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
