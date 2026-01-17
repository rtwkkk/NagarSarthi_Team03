import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart3, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { useDarkMode } from '../contexts/dark-mode-context';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const weeklyData = [
  { name: 'Mon', incidents: 145, resolved: 132, pending: 13 },
  { name: 'Tue', incidents: 178, resolved: 156, pending: 22 },
  { name: 'Wed', incidents: 162, resolved: 148, pending: 14 },
  { name: 'Thu', incidents: 189, resolved: 171, pending: 18 },
  { name: 'Fri', incidents: 203, resolved: 184, pending: 19 },
  { name: 'Sat', incidents: 134, resolved: 125, pending: 9 },
  { name: 'Sun', incidents: 98, resolved: 92, pending: 6 },
];

const monthlyData = [
  { name: 'Jan', incidents: 4234, resolved: 3987, critical: 247 },
  { name: 'Feb', incidents: 3892, resolved: 3654, critical: 238 },
  { name: 'Mar', incidents: 4567, resolved: 4289, critical: 278 },
  { name: 'Apr', incidents: 4123, resolved: 3876, critical: 247 },
  { name: 'May', incidents: 4789, resolved: 4512, critical: 277 },
  { name: 'Jun', incidents: 4456, resolved: 4198, critical: 258 },
];

export function WeeklyMonthlyComparison() {
  const { darkMode } = useDarkMode();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const currentData = viewMode === 'weekly' ? weeklyData : monthlyData;
  const totalIncidents = viewMode === 'weekly' ? 1109 : 26061;
  const resolvedIncidents = viewMode === 'weekly' ? 1008 : 24516;
  const resolutionRate = ((resolvedIncidents / totalIncidents) * 100).toFixed(1);
  const weeklyChange = viewMode === 'weekly' ? -8.3 : 5.2;

  return (
    <Card className="border-gray-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/20 dark:from-slate-900 dark:to-purple-950/20">
      <CardHeader className="border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900 dark:text-purple-400">
                {viewMode === 'weekly' ? 'Weekly' : 'Monthly'} Incident Analysis
              </CardTitle>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Comparative performance metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shadow-sm">
              <Button
                size="sm"
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                onClick={() => setViewMode('weekly')}
                className={viewMode === 'weekly' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'dark:text-slate-300'}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Weekly
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setViewMode('monthly')}
                className={viewMode === 'monthly' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'dark:text-slate-300'}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Monthly
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative overflow-hidden p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <p className="text-xs font-medium mb-2 opacity-90">Total Incidents</p>
            <p className="text-3xl font-bold mb-1">{totalIncidents.toLocaleString()}</p>
            <p className="text-xs opacity-75">This {viewMode === 'weekly' ? 'week' : 'period'}</p>
          </div>

          <div className="relative overflow-hidden p-5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg text-white">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <p className="text-xs font-medium mb-2 opacity-90">Resolved</p>
            <p className="text-3xl font-bold mb-1">{resolvedIncidents.toLocaleString()}</p>
            <p className="text-xs opacity-75">Successfully closed</p>
          </div>

          <div className="relative overflow-hidden p-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg text-white">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <p className="text-xs font-medium mb-2 opacity-90">Resolution Rate</p>
            <p className="text-3xl font-bold mb-1">{resolutionRate}%</p>
            <p className="text-xs opacity-75">Overall efficiency</p>
          </div>

          <div className={`relative overflow-hidden p-5 bg-gradient-to-br ${weeklyChange >= 0 ? 'from-orange-500 to-red-500' : 'from-cyan-500 to-blue-500'} rounded-xl shadow-lg text-white`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <p className="text-xs font-medium mb-2 opacity-90">Trend</p>
            <div className="flex items-center gap-2">
              {weeklyChange >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <p className="text-3xl font-bold">{Math.abs(weeklyChange)}%</p>
            </div>
            <p className="text-xs opacity-75">{weeklyChange >= 0 ? 'Increase' : 'Decrease'}</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="h-80 min-h-[320px] bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-inner mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData}>
              <defs>
                <linearGradient id="colorBar1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="colorBar2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="colorBar3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#e5e7eb"} />
              <XAxis
                dataKey="name"
                stroke={darkMode ? "#94a3b8" : "#6b7280"}
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <YAxis
                stroke={darkMode ? "#94a3b8" : "#6b7280"}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#0f172a' : 'white',
                  border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                  color: darkMode ? '#f1f5f9' : '#1e293b'
                }}
                itemStyle={{ color: darkMode ? '#cbd5e1' : '#475569' }}
                cursor={{ fill: darkMode ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', color: darkMode ? '#94a3b8' : '#475569' }}
                iconType="circle"
              />
              <Bar
                dataKey="incidents"
                fill="url(#colorBar1)"
                name="Total Incidents"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="resolved"
                fill="url(#colorBar2)"
                name="Resolved"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
              {viewMode === 'weekly' ? (
                <Bar
                  dataKey="pending"
                  fill="url(#colorBar3)"
                  name="Pending"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              ) : (
                <Bar
                  dataKey="critical"
                  fill="url(#colorBar3)"
                  name="Critical"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Busiest Day</p>
            </div>
            <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {viewMode === 'weekly' ? 'Friday' : 'May'}
            </p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
              {viewMode === 'weekly' ? '203 incidents' : '4,789 incidents'}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Best Performance</p>
            </div>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {viewMode === 'weekly' ? 'Saturday' : 'March'}
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              {viewMode === 'weekly' ? '93.3% resolved' : '93.9% resolved'}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">Avg Response</p>
            </div>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {viewMode === 'weekly' ? '4.1 min' : '4.5 min'}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Per incident average
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
