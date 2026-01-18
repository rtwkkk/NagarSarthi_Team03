import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ activeSection, onSectionChange, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange(newCollapsed);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r-2 border-gray-300 dark:border-blue-900/50 shadow-lg transition-all duration-300 z-40 overflow-y-auto scrollbar-hide ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Government Portal Header */}
      <div className="h-[73px] border-b-2 border-gray-300 dark:border-blue-900/50 bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-900 dark:to-indigo-950 flex items-center justify-center px-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-blue-200 shadow-sm">
          <img src="/assets/logo.jpg" alt="Nagar Sarthi Logo" className="w-full h-full object-cover scale-110" />
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <h2 className="text-white font-bold text-sm tracking-wide leading-none">NAGAR SARTHI</h2>
            <p className="text-blue-200 dark:text-blue-300 text-[10px] mt-1 font-medium uppercase tracking-tighter">Official Portal</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="py-6 px-3 overflow-y-auto scrollbar-hide h-[calc(100vh-150px)]">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-all duration-200 group ${isActive
                    ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                >
                  <Icon
                    className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'text-white' : 'text-gray-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400'
                      }`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium text-sm tracking-wide uppercase">
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Government Portal Info Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-300 dark:border-blue-900/50 bg-gray-50 dark:bg-slate-800 p-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">Govt. of India</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">Smart Cities Mission</p>
          </div>
        </div>
      )}

      {/* Collapse/Expand Toggle */}
      <button
        onClick={handleCollapse}
        className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-blue-900/50 rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-slate-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-slate-400" />
        )}
      </button>
    </aside>
  );
}