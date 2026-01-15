import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const hourlyData = [
  { hour: '00:00', incidents: 12, traffic: 3, power: 5, water: 2, roadblock: 2 },
  { hour: '02:00', incidents: 8, traffic: 2, power: 3, water: 2, roadblock: 1 },
  { hour: '04:00', incidents: 6, traffic: 1, power: 2, water: 2, roadblock: 1 },
  { hour: '06:00', incidents: 24, traffic: 12, power: 5, water: 4, roadblock: 3 },
  { hour: '08:00', incidents: 45, traffic: 25, power: 8, water: 7, roadblock: 5 },
  { hour: '10:00', incidents: 38, traffic: 18, power: 9, water: 6, roadblock: 5 },
  { hour: '12:00', incidents: 52, traffic: 28, power: 11, water: 8, roadblock: 5 },
  { hour: '14:00', incidents: 48, traffic: 24, power: 12, water: 7, roadblock: 5 },
  { hour: '16:00', incidents: 56, traffic: 30, power: 13, water: 8, roadblock: 5 },
  { hour: '18:00', incidents: 68, traffic: 38, power: 15, water: 10, roadblock: 5 },
  { hour: '20:00', incidents: 42, traffic: 22, power: 10, water: 6, roadblock: 4 },
  { hour: '22:00', incidents: 28, traffic: 14, power: 7, water: 4, roadblock: 3 },
];

export function IncidentTimeline() {
  const [timeView, setTimeView] = useState<'hourly' | 'daily'>('hourly');
  const peakHour = '18:00';
  const peakIncidents = 68;

  return (
    <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Incident Timeline Analysis</CardTitle>
              <p className="text-xs text-gray-500 mt-1">Real-time pattern detection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <Button
                size="sm"
                variant={timeView === 'hourly' ? 'default' : 'ghost'}
                onClick={() => setTimeView('hourly')}
                className={timeView === 'hourly' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Hourly
              </Button>
              <Button
                size="sm"
                variant={timeView === 'daily' ? 'default' : 'ghost'}
                onClick={() => setTimeView('daily')}
                className={timeView === 'daily' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Daily
              </Button>
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              Peak: {peakHour}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200 shadow-sm">
            <p className="text-xs text-orange-700 font-medium mb-1">Peak Hour</p>
            <p className="text-2xl font-bold text-orange-900">{peakHour}</p>
            <p className="text-xs text-orange-600 mt-1">{peakIncidents} incidents</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 shadow-sm">
            <p className="text-xs text-blue-700 font-medium mb-1">Avg per Hour</p>
            <p className="text-2xl font-bold text-blue-900">34.5</p>
            <p className="text-xs text-blue-600 mt-1">Last 24 hours</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 shadow-sm">
            <p className="text-xs text-green-700 font-medium mb-1">Quietest Hour</p>
            <p className="text-2xl font-bold text-green-900">04:00</p>
            <p className="text-xs text-green-600 mt-1">6 incidents</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 shadow-sm">
            <p className="text-xs text-purple-700 font-medium mb-1">Rush Hours</p>
            <p className="text-2xl font-bold text-purple-900">3</p>
            <p className="text-xs text-purple-600 mt-1">8AM, 12PM, 6PM</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="h-80 min-h-[320px] bg-white rounded-xl p-4 border border-gray-200 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hour"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncidents)"
                name="Total Incidents"
              />
              <Area
                type="monotone"
                dataKey="traffic"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTraffic)"
                name="Traffic"
              />
              <Area
                type="monotone"
                dataKey="power"
                stroke="#eab308"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPower)"
                name="Power"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Morning Rush Pattern</p>
                <p className="text-xs text-blue-700">
                  Traffic incidents spike 300% between 6AM-9AM during weekdays
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <p className="text-sm font-semibold text-purple-900 mb-1">Evening Peak Alert</p>
                <p className="text-xs text-purple-700">
                  6PM shows highest incident rate - consider increased monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}