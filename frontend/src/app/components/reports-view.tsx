import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Download,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Eye,
  FileDown,
  FileText,
  XCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDetailsModal } from './alert-details-modal';
import { useDarkMode } from '../contexts/dark-mode-context';
import { subscribeToIncidents, Incident } from '../../firebase/services';
import { formatDistanceToNow } from 'date-fns';

export function ReportsView() {
  const { darkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToIncidents((data) => {
      setIncidents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDownloadReport = (type: string) => {
    const timestamp = new Date().toLocaleString();
    const reportTitle = type.toUpperCase();
    const content = `
--------------------------------------------------
${reportTitle} - NAGAR SARTHI
--------------------------------------------------
Generated on: ${timestamp}
Authority: Municipal Authority
Region: Jamshedpur

Summary of Incident Data:
- Total Incidents: ${incidents.length}
- Verified Reports: ${incidents.filter(l => l.verified).length}
- Pending Actions: ${incidents.filter(l => l.status === 'pending').length}

This is a simulated ${type} file for demonstration purposes.
In a production environment, this would be a formatted PDF or XLSX document.
--------------------------------------------------
© 2026 Nagar Sarthi
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = type.toLowerCase().replace(/\s+/g, '-') + '.txt';

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`${type} has been generated and downloaded successfully.`);
  };

  const filteredLogs = incidents.filter((log) => {
    // Map fields for search
    const searchString = `${log.title} ${log.locationName || ''} ${log.category}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Incident Reports</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view detailed incident reports.</p>
        </div>
      </div>

      {/* Export Center */}
      <Card className={`shadow-lg transition-all duration-300 border-2 ${darkMode
          ? 'bg-gradient-to-r from-slate-800 to-blue-950 border-blue-900/50'
          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-gray-200'
        }`}>
        <CardContent className={`p-6 ${darkMode ? 'bg-transparent' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                <FileDown className={`w-5 h-5 ${darkMode ? 'text-blue-400' : ''}`} />
                Export Center
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Download reports and data exports</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleDownloadReport('Weekly PDF Report')}
                className="gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
              >
                <Download className="w-4 h-4" />
                Download Weekly PDF Report
              </Button>
              <Button
                onClick={() => handleDownloadReport('Custom Report')}
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600"
              >
                <FileText className="w-4 h-4" />
                Generate Custom Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Log Table */}
      <Card className="border-gray-200 shadow-lg dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-800 dark:to-blue-950">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900 dark:text-white">Incident Log (All Records)</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 dark:text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-gray-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 dark:bg-slate-800 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Incident ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Title & Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Assigned Team
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Reported
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Severity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
                {filteredLogs.map((log) => {
                  let timeAgo = 'Just now';
                  try {
                    const date = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.createdAt);
                    timeAgo = formatDistanceToNow(date, { addSuffix: true });
                  } catch (e) { }

                  return (
                    <tr key={log.id} className="hover:bg-blue-50 transition-colors dark:hover:bg-slate-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-semibold text-blue-900 dark:text-blue-300">
                            {log.id ? log.id.slice(0, 8) : '...'}
                          </span>
                          {log.verified ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : null}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                          {log.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-semibold text-gray-900 mb-1 dark:text-white">{log.title}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                            <MapPin className="w-3 h-3 dark:text-blue-400" />
                            {log.locationName || 'Unknown'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            log.status === 'resolved'
                              ? 'bg-green-500 text-white'
                              : log.status === 'in-progress'
                                ? 'bg-blue-500 text-white'
                                : log.status === 'rejected'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-orange-500 text-white'
                          }
                        >
                          {log.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {log.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.resolvedBy ? (
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{log.resolvedBy}</span>
                        ) : (
                          <span className="text-sm text-gray-500 italic dark:text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                          <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          {timeAgo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize">
                          {log.severity || 'Medium'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                          onClick={() => setSelectedIncident(log)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">No incidents found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDetailsModal
        alert={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}