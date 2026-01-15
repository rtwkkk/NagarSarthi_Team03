import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  TrendingUp,
  Activity,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const hourlyData = [
  { hour: '00:00', incidents: 12, resolved: 11 },
  { hour: '01:00', incidents: 8, resolved: 8 },
  { hour: '02:00', incidents: 6, resolved: 6 },
  { hour: '03:00', incidents: 5, resolved: 5 },
  { hour: '04:00', incidents: 7, resolved: 7 },
  { hour: '05:00', incidents: 15, resolved: 14 },
  { hour: '06:00', incidents: 28, resolved: 25 },
  { hour: '07:00', incidents: 45, resolved: 42 },
  { hour: '08:00', incidents: 67, resolved: 61 },
  { hour: '09:00', incidents: 89, resolved: 82 },
  { hour: '10:00', incidents: 78, resolved: 73 },
  { hour: '11:00', incidents: 71, resolved: 68 },
  { hour: '12:00', incidents: 82, resolved: 76 },
  { hour: '13:00', incidents: 75, resolved: 71 },
  { hour: '14:00', incidents: 85, resolved: 79 },
  { hour: '15:00', incidents: 91, resolved: 84 },
  { hour: '16:00', incidents: 98, resolved: 89 },
  { hour: '17:00', incidents: 112, resolved: 101 },
  { hour: '18:00', incidents: 127, resolved: 115 },
  { hour: '19:00', incidents: 105, resolved: 98 },
  { hour: '20:00', incidents: 87, resolved: 82 },
  { hour: '21:00', incidents: 62, resolved: 59 },
  { hour: '22:00', incidents: 43, resolved: 41 },
  { hour: '23:00', incidents: 28, resolved: 27 },
];

// Weekly data organized by year and month
const weeklyDataByMonth: Record<string, Record<string, any[]>> = {
  '2024': {
    'January': [
      { week: 'Week 1', total: 4234, resolved: 3987, pending: 247, avgResponseTime: 4.2 },
      { week: 'Week 2', total: 3892, resolved: 3654, pending: 238, avgResponseTime: 4.5 },
      { week: 'Week 3', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.1 },
      { week: 'Week 4', total: 4123, resolved: 3876, pending: 247, avgResponseTime: 4.3 },
    ],
    'February': [
      { week: 'Week 1', total: 3987, resolved: 3654, pending: 333, avgResponseTime: 4.4 },
      { week: 'Week 2', total: 4198, resolved: 3921, pending: 277, avgResponseTime: 4.2 },
      { week: 'Week 3', total: 4367, resolved: 4102, pending: 265, avgResponseTime: 4.0 },
      { week: 'Week 4', total: 3845, resolved: 3612, pending: 233, avgResponseTime: 4.3 },
    ],
    'March': [
      { week: 'Week 1', total: 4512, resolved: 4234, pending: 278, avgResponseTime: 4.1 },
      { week: 'Week 2', total: 4289, resolved: 4021, pending: 268, avgResponseTime: 4.0 },
      { week: 'Week 3', total: 4678, resolved: 4398, pending: 280, avgResponseTime: 3.9 },
      { week: 'Week 4', total: 4456, resolved: 4187, pending: 269, avgResponseTime: 4.2 },
    ],
    'April': [
      { week: 'Week 1', total: 4345, resolved: 4087, pending: 258, avgResponseTime: 4.1 },
      { week: 'Week 2', total: 4123, resolved: 3876, pending: 247, avgResponseTime: 4.3 },
      { week: 'Week 3', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.0 },
      { week: 'Week 4', total: 4234, resolved: 3987, pending: 247, avgResponseTime: 4.2 },
    ],
    'May': [
      { week: 'Week 1', total: 4789, resolved: 4512, pending: 277, avgResponseTime: 3.9 },
      { week: 'Week 2', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.0 },
      { week: 'Week 3', total: 4892, resolved: 4621, pending: 271, avgResponseTime: 3.8 },
      { week: 'Week 4', total: 4678, resolved: 4398, pending: 280, avgResponseTime: 4.1 },
    ],
    'June': [
      { week: 'Week 1', total: 4456, resolved: 4187, pending: 269, avgResponseTime: 4.2 },
      { week: 'Week 2', total: 4234, resolved: 3987, pending: 247, avgResponseTime: 4.3 },
      { week: 'Week 3', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.1 },
      { week: 'Week 4', total: 4345, resolved: 4087, pending: 258, avgResponseTime: 4.0 },
    ],
    'July': [
      { week: 'Week 1', total: 4234, resolved: 3987, pending: 247, avgResponseTime: 4.2 },
      { week: 'Week 2', total: 3892, resolved: 3654, pending: 238, avgResponseTime: 4.5 },
      { week: 'Week 3', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.1 },
      { week: 'Week 4', total: 4123, resolved: 3876, pending: 247, avgResponseTime: 4.3 },
    ],
    'August': [
      { week: 'Week 1', total: 3987, resolved: 3654, pending: 333, avgResponseTime: 4.4 },
      { week: 'Week 2', total: 4198, resolved: 3921, pending: 277, avgResponseTime: 4.2 },
      { week: 'Week 3', total: 4367, resolved: 4102, pending: 265, avgResponseTime: 4.5 },
      { week: 'Week 4', total: 3845, resolved: 3612, pending: 233, avgResponseTime: 4.6 },
    ],
    'September': [
      { week: 'Week 1', total: 4512, resolved: 4234, pending: 278, avgResponseTime: 4.1 },
      { week: 'Week 2', total: 4289, resolved: 4021, pending: 268, avgResponseTime: 4.0 },
      { week: 'Week 3', total: 4678, resolved: 4398, pending: 280, avgResponseTime: 3.9 },
      { week: 'Week 4', total: 4456, resolved: 4187, pending: 269, avgResponseTime: 4.2 },
    ],
    'October': [
      { week: 'Week 1', total: 4345, resolved: 4087, pending: 258, avgResponseTime: 4.1 },
      { week: 'Week 2', total: 4123, resolved: 3876, pending: 247, avgResponseTime: 4.3 },
      { week: 'Week 3', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.0 },
      { week: 'Week 4', total: 4234, resolved: 3987, pending: 247, avgResponseTime: 4.2 },
    ],
    'November': [
      { week: 'Week 1', total: 4789, resolved: 4512, pending: 277, avgResponseTime: 3.9 },
      { week: 'Week 2', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.0 },
      { week: 'Week 3', total: 4892, resolved: 4621, pending: 271, avgResponseTime: 4.2 },
      { week: 'Week 4', total: 4678, resolved: 4398, pending: 280, avgResponseTime: 4.3 },
    ],
    'December': [
      { week: 'Week 1', total: 4456, resolved: 4187, pending: 269, avgResponseTime: 4.4 },
      { week: 'Week 2', total: 4234, resolved: 3987, pending: 247, avgResponseTime: 4.3 },
      { week: 'Week 3', total: 4567, resolved: 4289, pending: 278, avgResponseTime: 4.1 },
      { week: 'Week 4', total: 4345, resolved: 4087, pending: 258, avgResponseTime: 4.2 },
    ],
  },
  '2023': {
    'January': [
      { week: 'Week 1', total: 4134, resolved: 3887, pending: 247, avgResponseTime: 4.5 },
      { week: 'Week 2', total: 3792, resolved: 3554, pending: 238, avgResponseTime: 4.7 },
      { week: 'Week 3', total: 4467, resolved: 4189, pending: 278, avgResponseTime: 4.4 },
      { week: 'Week 4', total: 4023, resolved: 3776, pending: 247, avgResponseTime: 4.6 },
    ],
  },
};

// Monthly data organized by year
const monthlyDataByYear: Record<string, any[]> = {
  '2024': [
    { period: 'Jan', total: 16816, resolved: 15806, pending: 1010, avgResponseTime: 4.2 },
    { period: 'Feb', total: 16397, resolved: 15289, pending: 1108, avgResponseTime: 4.2 },
    { period: 'Mar', total: 17935, resolved: 16840, pending: 1095, avgResponseTime: 4.1 },
    { period: 'Apr', total: 17269, resolved: 16239, pending: 1030, avgResponseTime: 4.2 },
    { period: 'May', total: 18926, resolved: 17820, pending: 1106, avgResponseTime: 3.9 },
    { period: 'Jun', total: 17602, resolved: 16550, pending: 1052, avgResponseTime: 4.2 },
    { period: 'Jul', total: 16816, resolved: 15806, pending: 1010, avgResponseTime: 4.3 },
    { period: 'Aug', total: 16397, resolved: 15289, pending: 1108, avgResponseTime: 4.4 },
    { period: 'Sep', total: 17935, resolved: 16840, pending: 1095, avgResponseTime: 4.1 },
    { period: 'Oct', total: 17269, resolved: 16239, pending: 1030, avgResponseTime: 4.2 },
    { period: 'Nov', total: 18926, resolved: 17820, pending: 1106, avgResponseTime: 4.1 },
    { period: 'Dec', total: 17602, resolved: 16550, pending: 1052, avgResponseTime: 4.2 },
  ],
  '2023': [
    { period: 'Jan', total: 15234, resolved: 14287, pending: 947, avgResponseTime: 4.5 },
    { period: 'Feb', total: 14892, resolved: 13954, pending: 938, avgResponseTime: 4.6 },
    { period: 'Mar', total: 16567, resolved: 15589, pending: 978, avgResponseTime: 4.4 },
    { period: 'Apr', total: 15123, resolved: 14176, pending: 947, avgResponseTime: 4.7 },
    { period: 'May', total: 17789, resolved: 16712, pending: 1077, avgResponseTime: 4.3 },
    { period: 'Jun', total: 16456, resolved: 15498, pending: 958, avgResponseTime: 4.5 },
    { period: 'Jul', total: 16234, resolved: 15287, pending: 947, avgResponseTime: 4.3 },
    { period: 'Aug', total: 15892, resolved: 14954, pending: 938, avgResponseTime: 4.5 },
    { period: 'Sep', total: 17567, resolved: 16589, pending: 978, avgResponseTime: 4.1 },
    { period: 'Oct', total: 16123, resolved: 15176, pending: 947, avgResponseTime: 4.3 },
    { period: 'Nov', total: 18789, resolved: 17712, pending: 1077, avgResponseTime: 4.2 },
    { period: 'Dec', total: 17456, resolved: 16498, pending: 958, avgResponseTime: 4.4 },
  ],
  '2022': [
    { period: 'Jan', total: 14234, resolved: 13287, pending: 947, avgResponseTime: 4.8 },
    { period: 'Feb', total: 13892, resolved: 12954, pending: 938, avgResponseTime: 4.9 },
    { period: 'Mar', total: 15567, resolved: 14589, pending: 978, avgResponseTime: 4.7 },
    { period: 'Apr', total: 14123, resolved: 13176, pending: 947, avgResponseTime: 5.0 },
    { period: 'May', total: 16789, resolved: 15712, pending: 1077, avgResponseTime: 4.6 },
    { period: 'Jun', total: 15456, resolved: 14498, pending: 958, avgResponseTime: 4.8 },
    { period: 'Jul', total: 15234, resolved: 14287, pending: 947, avgResponseTime: 4.7 },
    { period: 'Aug', total: 14892, resolved: 13954, pending: 938, avgResponseTime: 4.9 },
    { period: 'Sep', total: 16567, resolved: 15589, pending: 978, avgResponseTime: 4.5 },
    { period: 'Oct', total: 15123, resolved: 14176, pending: 947, avgResponseTime: 4.7 },
    { period: 'Nov', total: 17789, resolved: 16712, pending: 1077, avgResponseTime: 4.6 },
    { period: 'Dec', total: 16456, resolved: 15498, pending: 958, avgResponseTime: 4.8 },
  ],
};

const yearlyDataForFilter = [
  { period: '2020', total: 187234, resolved: 176287, pending: 10947, avgResponseTime: 5.2 },
  { period: '2021', total: 195892, resolved: 184954, pending: 10938, avgResponseTime: 4.8 },
  { period: '2022', total: 207567, resolved: 196589, pending: 10978, avgResponseTime: 4.5 },
  { period: '2023', total: 216123, resolved: 205176, pending: 10947, avgResponseTime: 4.3 },
  { period: '2024', total: 228789, resolved: 217712, pending: 11077, avgResponseTime: 4.1 },
];

const resolutionEfficiency = [
  { type: 'Traffic', avgTime: 3.2, efficiency: 95, total: 5234 },
  { type: 'Power', avgTime: 4.8, efficiency: 87, total: 3421 },
  { type: 'Water', avgTime: 4.1, efficiency: 91, total: 2876 },
  { type: 'Roadblock', avgTime: 2.9, efficiency: 96, total: 4123 },
  { type: 'Infrastructure', avgTime: 5.5, efficiency: 82, total: 1987 },
  { type: 'Other', avgTime: 4.5, efficiency: 89, total: 2345 },
];

export function AnalyticsView() {
  const [hoveredWeekCard, setHoveredWeekCard] = useState<number | null>(null);
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear] = useState('2024');
  const [selectedYearRange, setSelectedYearRange] = useState('2024');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const availableYears = ['2024', '2023', '2022'];

  // Get data based on selected time period
  const getFilteredData = () => {
    switch (timePeriod) {
      case 'weekly':
        return weeklyDataByMonth[selectedYear]?.[selectedMonth] || [];
      case 'monthly':
        return monthlyDataByYear[selectedYearRange] || [];
      case 'yearly':
        return yearlyDataForFilter;
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  const dataKey = timePeriod === 'weekly' ? 'week' : 'period';

  return (
    <div className="space-y-6">
      {/* Peak/Quiet Hour Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-red-50 to-orange-100/50 dark:from-red-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400" />
              <Badge className="bg-red-500 dark:bg-red-600 text-white">Peak</Badge>
            </div>
            <p className="text-3xl font-bold text-red-900 dark:text-red-300">18:00</p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Peak Hour</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">127 incidents/hour average</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              <Badge className="bg-green-500 dark:bg-green-600 text-white">Quiet</Badge>
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-300">03:00</p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Quiet Hour</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">5 incidents/hour average</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100/50 dark:from-purple-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <Badge className="bg-purple-500 dark:bg-purple-600 text-white">Rush Hours</Badge>
            </div>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">17-20</p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Peak Period</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Evening rush hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Incident Timeline Analysis */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-blue-300 font-semibold">Incident Timeline Analysis (24-Hour Pattern)</CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hourly incident reporting and resolution trends</p>
            </div>
            <Badge className="bg-blue-500 dark:bg-blue-600 text-white">Today</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8 dark:bg-gray-900/50">
          <div className="flex items-center justify-center">
            <div className="w-full h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis dataKey="hour" stroke="#6b7280" className="dark:stroke-gray-400" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" className="dark:stroke-gray-400" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorIncidents)"
                    name="Incidents Reported"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorResolved)"
                    name="Incidents Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Incident Analysis with Hover Details */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-300">
                {timePeriod === 'weekly' && 'Weekly Incident Analysis'}
                {timePeriod === 'monthly' && 'Monthly Incident Analysis'}
                {timePeriod === 'yearly' && 'Yearly Incident Analysis'}
              </CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hover over each {timePeriod === 'weekly' ? 'week' : timePeriod === 'monthly' ? 'month' : 'year'} to see detailed metrics</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setTimePeriod('weekly')}
                variant={timePeriod === 'weekly' ? 'default' : 'outline'}
                size="sm"
                className={timePeriod === 'weekly' ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'}
              >
                Weekly
              </Button>
              <Button
                onClick={() => setTimePeriod('monthly')}
                variant={timePeriod === 'monthly' ? 'default' : 'outline'}
                size="sm"
                className={timePeriod === 'monthly' ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'}
              >
                Monthly
              </Button>
              <Button
                onClick={() => setTimePeriod('yearly')}
                variant={timePeriod === 'yearly' ? 'default' : 'outline'}
                size="sm"
                className={timePeriod === 'yearly' ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'}
              >
                Yearly
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 dark:bg-gray-900/50">
          {/* Time Context Selectors */}
          {timePeriod === 'weekly' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">Weeks for {selectedMonth} {selectedYear}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select a month to view weekly breakdown</p>
                </div>
              </div>

              {/* Month Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedMonth === month
                      ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:shadow-md'
                      }`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {timePeriod === 'monthly' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">All Months for {selectedYearRange}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select a year to view monthly data</p>
                </div>
              </div>

              {/* Year Selector Pills */}
              <div className="flex gap-3">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYearRange(year)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedYearRange === year
                      ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:shadow-md'
                      }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {timePeriod === 'yearly' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">Yearly Data Overview (2020–2024)</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">5-year incident analysis and trends</p>
                </div>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 gap-4 mb-6 ${timePeriod === 'weekly' ? 'md:grid-cols-4' :
            timePeriod === 'monthly' ? 'md:grid-cols-6' :
              'md:grid-cols-5'
            }`}>
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredWeekCard(index)}
                onMouseLeave={() => setHoveredWeekCard(null)}
              >
                {/* Main Card */}
                <div
                  className={`p-5 rounded-xl border-2 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 cursor-pointer transition-all duration-300 ${hoveredWeekCard === index
                    ? 'shadow-2xl scale-105 border-blue-400 dark:border-blue-500 z-10'
                    : 'shadow-md border-gray-200 dark:border-slate-700 hover:shadow-lg'
                    }`}
                >
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-blue-300 mb-3">{item.period || item.week}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Incidents</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{item.total.toLocaleString()}</p>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600"
                        style={{ width: `${(item.resolved / item.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Hover Detail Card */}
                {hoveredWeekCard === index && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-blue-400 p-6 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-l-2 border-t-2 border-blue-400 rotate-45"></div>

                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {item.period || item.week} Detailed Metrics
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Total Incidents</span>
                        </div>
                        <span className="text-xl font-bold text-blue-900 dark:text-blue-200">{item.total.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Resolved</span>
                        </div>
                        <span className="text-xl font-bold text-green-900 dark:text-green-400">{item.resolved.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Pending</span>
                        </div>
                        <span className="text-xl font-bold text-orange-900 dark:text-orange-400">{item.pending.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Avg Response</span>
                        </div>
                        <span className="text-xl font-bold text-purple-900 dark:text-purple-300">{item.avgResponseTime}m</span>
                      </div>

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Resolution Rate</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {((item.resolved / item.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${(item.resolved / item.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Chart */}
          <div className="h-64 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey={dataKey} stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" name="Total Incidents" radius={[8, 8, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Efficiency */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
          <CardTitle className="text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Resolution Efficiency (By Type)
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 dark:bg-gray-900/50">
          <div className="space-y-4">
            {resolutionEfficiency.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.type}</h4>
                  <Badge
                    className={
                      item.efficiency >= 95
                        ? 'bg-green-500 dark:bg-green-600 text-white'
                        : item.efficiency >= 85
                          ? 'bg-blue-500 dark:bg-blue-600 text-white'
                          : 'bg-orange-500 dark:bg-orange-600 text-white'
                    }
                  >
                    {item.efficiency}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="font-bold text-gray-900 dark:text-white">{item.avgTime} mins</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Handled</p>
                    <p className="font-bold text-gray-900 dark:text-white">{item.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.efficiency >= 95
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : item.efficiency >= 85
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                    style={{ width: `${item.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}