import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useDarkMode } from '../contexts/dark-mode-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { darkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await signIn(email, password);
      if (!success) {
        setError('Invalid email or password');
      } else {
        onAuthSuccess();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode
      ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-cyan-900/20'
      : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20'
      }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <Card className={`relative w-full max-w-md shadow-2xl ${darkMode
        ? 'bg-[#2a2a3e] border-[#f3f3f5]'
        : 'border-gray-300'
        }`}>
        {/* Header */}
        <CardHeader className={`border-b-2 ${darkMode ? 'border-[#f3f3f5]/20' : 'border-gray-200'} bg-gradient-to-r from-blue-700 to-blue-900 rounded-t-lg`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-blue-100 overflow-hidden">
              <img src="/assets/logo.jpg" alt="Nagar Sarthi Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">Check In</CardTitle>
            <p className="text-blue-200 text-sm">Municipal Administration Portal</p>
            <Badge className="bg-white/20 text-white mt-2">NAGAR SARTHI</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8">

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                  }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nagaralert.gov.in"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-all ${darkMode
                    ? 'bg-[#2a2a3e] border-2 border-[#f3f3f5] text-white placeholder-[#f3f3f5]/60'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                  }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg text-sm transition-all ${darkMode
                    ? 'bg-[#2a2a3e] border-2 border-[#f3f3f5] text-white placeholder-[#f3f3f5]/60'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors ${darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                    }`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base uppercase tracking-wider"
            >
              {loading ? 'Processing...' : 'Check In'}
            </Button>
          </form>

        </CardContent>

        {/* Footer */}
        <div className={`px-8 py-4 border-t-2 ${darkMode ? 'border-[#f3f3f5]/20 bg-[#1a1a2e]' : 'border-gray-200 bg-gray-50'
          } rounded-b-lg`}>
          <div className="text-center">
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Smart Cities Mission • Government of India
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
