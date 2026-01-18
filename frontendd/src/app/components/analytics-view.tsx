import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { subscribeToIncidents, Incident } from '../../firebase/services';
import { formatDistanceToNow } from 'date-fns';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'resolved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default: return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Incident Reports Log</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time log of all reported incidents from the citizens.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
          {incidents.length} Total Records
        </Badge>
      </div>

      <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Incident Details</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {incidents.map((incident) => {
                  let timeAgo = 'Unknown';
                  try {
                    if (incident.createdAt) {
                      const date = incident.createdAt.toDate ? incident.createdAt.toDate() : new Date(incident.createdAt);
                      timeAgo = formatDistanceToNow(date, { addSuffix: true });
                    }
                  } catch (e) { console.error('Date error', e); }

                  return (
                    <tr key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white mb-0.5">{incident.title}</div>
                        <div className="text-gray-500 text-xs line-clamp-1 max-w-[200px]">{incident.description}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {incident.locationName || 'Unknown Location'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                          {incident.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`capitalize ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {timeAgo}
                        <div className="text-xs text-gray-400 mt-0.5">by {incident.reporterName || 'Anonymous'}</div>
                      </td>
                    </tr>
                  );
                })}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No incidents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}