import { TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const kpiData = [
  {
    title: 'Total Incidents',
    value: '1,247',
    change: '+5.2%',
    trend: 'up',
    subtitle: 'increase from yesterday',
    detail: 'Reported in last 24 hours across all wards',
    icon: TrendingUp,
    bgGradient: 'from-blue-500 to-blue-700',
    bgLight: 'from-blue-50 to-blue-100',
    darkBgLight: 'dark:from-blue-950/40 dark:to-slate-900/60',
    iconColor: 'text-blue-600',
    chartData: [20, 35, 30, 45, 40, 55, 50],
  },
  {
    title: 'Total Verified',
    value: '1,089',
    change: '+87.3%',
    trend: 'up',
    subtitle: 'verification rate',
    detail: '87.3% of all reports have been verified by officials',
    icon: CheckCircle,
    bgGradient: 'from-green-500 to-green-700',
    bgLight: 'from-green-50 to-green-100',
    darkBgLight: 'dark:from-green-950/40 dark:to-slate-900/60',
    iconColor: 'text-green-600',
    chartData: [30, 40, 35, 50, 45, 60, 55],
  },
  {
    title: 'Pending',
    value: '158',
    change: '-12.4%',
    trend: 'down',
    subtitle: 'awaiting verification',
    detail: 'Average verification time: 8.5 minutes',
    icon: Clock,
    bgGradient: 'from-orange-500 to-orange-700',
    bgLight: 'from-orange-50 to-orange-100',
    darkBgLight: 'dark:from-orange-950/40 dark:to-slate-900/60',
    iconColor: 'text-orange-600',
    chartData: [50, 45, 40, 35, 30, 25, 20],
  },
  {
    title: 'Rejected',
    value: '34',
    change: '-3.1%',
    trend: 'down',
    subtitle: 'false reports dismissed',
    detail: 'Only 2.7% rejection rate - High data quality',
    icon: XCircle,
    bgGradient: 'from-red-500 to-red-700',
    bgLight: 'from-red-50 to-red-100',
    darkBgLight: 'dark:from-red-950/40 dark:to-slate-900/60',
    iconColor: 'text-red-600',
    chartData: [15, 18, 14, 12, 10, 8, 6],
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="relative">
            <Card className="border border-gray-200 dark:border-blue-900/50 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className={`p-4 bg-gradient-to-br ${kpi.bgLight} ${kpi.darkBgLight}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${kpi.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                      <TrendingUp className={`w-3 h-3 ${kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 rotate-180'
                        }`} />
                      <span className={`text-xs font-bold ${kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{kpi.title}</p>

                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}