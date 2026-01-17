import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
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
      subtitle: 'All Time',
      detail: 'Cumulative reports registered',
      icon: TrendingUp,
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'dark:from-blue-900/30 dark:to-blue-900/10',
      iconColor: 'text-blue-600',
      darkIconColor: 'dark:text-blue-400',
      badgeColor: 'bg-blue-500',
    },
    {
      title: 'Total Verified',
      value: stats.verified.toLocaleString(),
      subtitle: stats.total > 0 ? `${((stats.verified / stats.total) * 100).toFixed(0)}% Rate` : '0% Rate',
      detail: 'Successfully verified incidents',
      icon: CheckCircle,
      bgGradient: 'from-green-50 to-green-100',
      darkBgGradient: 'dark:from-green-900/30 dark:to-green-900/10',
      iconColor: 'text-green-600',
      darkIconColor: 'dark:text-green-400',
      badgeColor: 'bg-green-600',
    },
    {
      title: 'Pending Action',
      value: stats.pending.toLocaleString(),
      subtitle: 'Review Queue',
      detail: 'Awaiting authority check',
      icon: Clock,
      bgGradient: 'from-orange-50 to-orange-100',
      darkBgGradient: 'dark:from-orange-900/30 dark:to-orange-900/10',
      iconColor: 'text-orange-600',
      darkIconColor: 'dark:text-orange-400',
      badgeColor: 'bg-orange-500',
    },
    {
      title: 'Dismissed',
      value: stats.rejected.toLocaleString(),
      subtitle: 'Dismissed',
      detail: 'Invalid or flagged reports',
      icon: XCircle,
      bgGradient: 'from-red-50 to-red-100',
      darkBgGradient: 'dark:from-red-900/30 dark:to-red-900/10',
      iconColor: 'text-red-600',
      darkIconColor: 'dark:text-red-400',
      badgeColor: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={index}
            className="border border-gray-200 dark:border-blue-900/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer overflow-hidden group"
          >
            <CardContent className={`p-6 bg-gradient-to-br ${kpi.bgGradient} ${kpi.darkBgGradient}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor} ${kpi.darkIconColor}`} />
                </div>
                <Badge className={`${kpi.badgeColor} text-white text-[10px]`}>{kpi.subtitle}</Badge>
              </div>
              <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 uppercase tracking-wide">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{kpi.value}</p>
              <p className="text-[10px] text-gray-600 dark:text-slate-400 line-clamp-1">{kpi.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}