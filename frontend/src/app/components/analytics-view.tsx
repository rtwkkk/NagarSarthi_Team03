import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { subscribeToIncidents, Incident } from '../../firebase/services';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp } from 'lucide-react';

export function AnalyticsView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToIncidents((data) => {
      setIncidents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'rejected':
      case 'dismissed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'resolved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getSeverityColor = (severity?: string) => {
    const sev = severity?.toLowerCase() || 'medium';
    switch (sev) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default: return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 shadow-lg"></div>
        <p className="text-gray-500 font-medium animate-pulse uppercase tracking-widest text-xs">Accessing Neural Core...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Detailed Activity Log */}
      <section className="animate-in fade-in duration-1000 delay-500">
        <Card className="border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent Activity Log</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-950/70 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Incident Info</th>
                    <th className="px-6 py-5">Location</th>
                    <th className="px-6 py-5 text-center">Severity</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Time Recorded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {incidents.slice(0, 10).map((incident) => {
                    let timeAgo = 'Just now';
                    try {
                      if (incident.createdAt) {
                        const date = incident.createdAt.toDate ? incident.createdAt.toDate() : new Date(incident.createdAt);
                        timeAgo = formatDistanceToNow(date, { addSuffix: true });
                      }
                    } catch (e) { console.error('Date error', e); }

                    return (
                      <tr key={incident.id} className="group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300">
                        <td className="px-8 py-5">
                          <div className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{incident.title}</div>
                          <div className="text-gray-400 text-xs font-medium uppercase tracking-tight">{incident.category}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                            <span className="text-blue-500">📍</span>
                            {incident.locationName || 'City Limit'}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <Badge variant="outline" className={`px-3 py-1 font-black rounded-lg border-2 uppercase text-[10px] ${getSeverityColor(incident.severity)}`}>
                            {incident.severity || 'Normal'}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 shadow-sm ${getStatusColor(incident.status)}`}>
                            {incident.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="text-gray-900 dark:text-white font-bold">{timeAgo}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Reported by {incident.reporterName || 'Citizen'}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {incidents.length === 0 && (
              <div className="px-6 py-20 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Synchronizing Data Streams...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
