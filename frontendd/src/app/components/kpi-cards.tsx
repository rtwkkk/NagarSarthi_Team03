import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { subscribeToIncidents } from '../../firebase/services';

export function KpiCards() {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const unsubscribe = subscribeToIncidents((reports) => {
      const total = reports.length;
      // Flutter logic: verified is a boolean field, but status also tracks 'verified'
      const verified = reports.filter(r => r.verified || r.status === 'verified').length;
      const pending = reports.filter(r => r.status === 'pending').length;
      const rejected = reports.filter(r => r.status === 'rejected' || r.status === 'dismissed').length;

      setStats({ total, verified, pending, rejected });
    });
    return () => unsubscribe();
  }, []);

  const kpiData = [
    {
      title: 'Total Incidents',
      value: stats.total.toLocaleString(),
      change: 'Live',
      trend: 'up',
      subtitle: 'Total Reports',
      detail: 'Registered incidents',
      icon: TrendingUp,
      bgGradient: 'from-blue-500 to-blue-700',
      bgLight: 'from-blue-50 to-blue-100',
      darkBgLight: 'dark:from-blue-950/40 dark:to-slate-900/60',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Verified',
      value: stats.verified.toLocaleString(),
      change: stats.total > 0 ? `${((stats.verified / stats.total) * 100).toFixed(1)}%` : '0%',
      trend: 'up',
      subtitle: 'Verification Rate',
      detail: 'Verified reports',
      icon: CheckCircle,
      bgGradient: 'from-green-500 to-green-700',
      bgLight: 'from-green-50 to-green-100',
      darkBgLight: 'dark:from-green-950/40 dark:to-slate-900/60',
      iconColor: 'text-green-600',
    },
    {
      title: 'Pending',
      value: stats.pending.toLocaleString(),
      change: stats.total > 0 ? `${((stats.pending / stats.total) * 100).toFixed(1)}%` : '0%',
      trend: 'down',
      subtitle: 'Pending Action',
      detail: 'Awaiting verification',
      icon: Clock,
      bgGradient: 'from-orange-500 to-orange-700',
      bgLight: 'from-orange-50 to-orange-100',
      darkBgLight: 'dark:from-orange-950/40 dark:to-slate-900/60',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Rejected',
      value: stats.rejected.toLocaleString(),
      change: stats.total > 0 ? `${((stats.rejected / stats.total) * 100).toFixed(1)}%` : '0%',
      trend: 'down',
      subtitle: 'Rejected Reports',
      detail: 'Dismissed or false',
      icon: XCircle,
      bgGradient: 'from-red-500 to-red-700',
      bgLight: 'from-red-50 to-red-100',
      darkBgLight: 'dark:from-red-950/40 dark:to-slate-900/60',
      iconColor: 'text-red-600',
    },
  ];

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