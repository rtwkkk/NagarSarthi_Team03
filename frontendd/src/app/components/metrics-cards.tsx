import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const sparklineData = [
  { value: 80 },
  { value: 90 },
  { value: 85 },
  { value: 95 },
  { value: 100 },
  { value: 110 },
  { value: 127 },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  subMetrics?: Array<{ label: string; value: number; color: string }>;
  showSparkline?: boolean;
  gradient: string;
}

function MetricCard({ title, value, change, trend, icon, subMetrics, showSparkline, gradient }: MetricCardProps) {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">{value}</h3>
            </div>
          </div>
          <Badge 
            variant={isPositive ? 'default' : 'secondary'} 
            className={`${isPositive ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'} text-white border-0 shadow-md`}
          >
            <TrendIcon className="w-3 h-3 mr-1" />
            {Math.abs(change)}%
          </Badge>
        </div>

        {showSparkline && (
          <div className="h-12 -mx-2 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <defs>
                  <linearGradient id="sparkGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#sparkGradient)"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {subMetrics && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {subMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${metric.color} shadow-sm`}></div>
                <span className="text-xs text-gray-600 font-medium">{metric.label}:</span>
                <span className="text-sm font-bold text-gray-900">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Active Alerts"
        value={127}
        change={12}
        trend="up"
        icon={<AlertTriangle className="w-7 h-7 text-white" />}
        gradient="from-orange-500 to-red-500"
        showSparkline={true}
        subMetrics={[
          { label: 'High Priority', value: 23, color: 'bg-red-500' },
          { label: 'In Progress', value: 45, color: 'bg-yellow-500' },
        ]}
      />
      
      <MetricCard
        title="Verified Reports"
        value={342}
        change={8}
        trend="up"
        icon={<CheckCircle className="w-7 h-7 text-white" />}
        gradient="from-green-500 to-emerald-500"
      />
      
      <MetricCard
        title="Avg Response Time"
        value="4.2 min"
        change={15}
        trend="down"
        icon={<Clock className="w-7 h-7 text-white" />}
        gradient="from-cyan-500 to-blue-500"
      />
      
      <MetricCard
        title="Reports This Week"
        value="1,247"
        change={5}
        trend="up"
        icon={<FileText className="w-7 h-7 text-white" />}
        gradient="from-blue-600 to-purple-600"
      />
    </div>
  );
}