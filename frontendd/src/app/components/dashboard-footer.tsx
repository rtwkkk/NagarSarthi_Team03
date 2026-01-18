import { Phone } from 'lucide-react';
import { useDarkMode } from '../contexts/dark-mode-context';

export function DashboardFooter() {
  const { darkMode } = useDarkMode();

  return (
    <footer className={`py-4 px-6 border-t transition-colors ${darkMode
      ? 'bg-[#1a1a2e] border-[#f3f3f5]/10'
      : 'bg-gray-50 border-gray-200'
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <p className={`text-sm ${darkMode ? 'text-[#f3f3f5]/60' : 'text-gray-600'}`}>
            © 2026 Nagar Sarthi - Powered by Community Coders
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className={`text-sm hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Privacy Policy
            </a>
            <a href="#" className={`text-sm hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Terms of Service
            </a>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-[#f3f3f5]/60' : 'text-gray-600'}`}>
          <Phone className="w-4 h-4" />
          <span className="font-medium">Authority Helpline:</span>
          <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>1800-XXX-XXXX</span>
        </div>
      </div>
    </footer>
  );
}
