import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  FileText,
  Download,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Eye,
  FileDown,
  Users,
  BarChart3
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDetailsModal } from './alert-details-modal';
import { useDarkMode } from '../contexts/dark-mode-context';

const incidentLogs: any[] = [
  {
    id: 'INC-2026-0145',
    title: 'Traffic Jam - Bistupur Circle',
    status: 'resolved',
    location: 'Bistupur Circle, Main Road',
    ward: 'Ward 12',
    reportedBy: 'Citizen App',
    phone: '+91 94311 00001',
    assignedTeam: 'Team Alpha',
    reportedAt: '2026-01-09 08:45',
    resolvedAt: '2026-01-09 09:12',
    responseTime: '27 mins',
    type: 'Traffic',
    verified: true,
    time: '2026-01-09 08:45',
    severity: 'high',
    summary: 'A localized traffic bottleneck developed at Bistupur Circle during morning rush hour. Specialized traffic units were deployed to manage the flow and clear the congestion.',
  },
  {
    id: 'INC-2026-0144',
    title: 'Power Outage - Kadma Sector 5',
    status: 'in-progress',
    location: 'Kadma, Sector 5',
    ward: 'Ward 8',
    reportedBy: 'Field Officer',
    phone: '+91 94311 00002',
    assignedTeam: 'Team Beta',
    reportedAt: '2026-01-09 07:30',
    resolvedAt: null,
    responseTime: '1.5 hrs',
    type: 'Power',
    verified: true,
    time: '2026-01-09 07:30',
    severity: 'medium',
    summary: 'A transformer failure has caused a localized power outage in Kadma Sector 5. Maintenance teams are currently on-site working to restore power to approximately 200 households.',
  },
  {
    id: 'INC-2026-0143',
    title: 'Water Pipe Burst',
    status: 'resolved',
    location: 'Sonari, Near Railway Station',
    ward: 'Ward 15',
    reportedBy: 'Citizen App',
    phone: '+91 94311 00003',
    assignedTeam: 'Team Gamma',
    reportedAt: '2026-01-09 06:15',
    resolvedAt: '2026-01-09 08:45',
    responseTime: '2.5 hrs',
    type: 'Water',
    verified: true,
    time: '2026-01-09 06:15',
    severity: 'high',
    summary: 'A medium-sized water main burst near the Sonari station caused significant water loss and minor road damage. The leak was successfully isolated and repaired within 3 hours.',
  },
  {
    id: 'INC-2026-0142',
    title: 'Road Blockage - Construction Debris',
    status: 'pending',
    location: 'Sakchi, Station Road',
    ward: 'Ward 6',
    reportedBy: 'Citizen App',
    phone: '+91 94311 00004',
    assignedTeam: 'Team Delta',
    reportedAt: '2026-01-09 05:20',
    resolvedAt: null,
    responseTime: null,
    type: 'Roadblock',
    verified: false,
    time: '2026-01-09 05:20',
    severity: 'low',
    summary: 'Illegal dumping of construction materials has blocked half of Station Road in Sakchi. A cleanup crew has been scheduled for the next shift.',
  },
  {
    id: 'INC-2026-0141',
    title: 'Street Light Not Working',
    status: 'resolved',
    location: 'Mango, Gandhi Chowk',
    ward: 'Ward 10',
    reportedBy: 'Citizen App',
    phone: '+91 94311 00005',
    assignedTeam: 'Team Delta',
    reportedAt: '2026-01-08 20:30',
    resolvedAt: '2026-01-09 10:15',
    responseTime: '13.75 hrs',
    type: 'Infrastructure',
    verified: true,
    time: '2026-01-08 20:30',
    severity: 'low',
    summary: 'Several streetlights were reported non-functional at Gandhi Chowk. Infrastructure teams completed a group replacement of faulty bulbs and identified a wiring issue.',
  },
  {
    id: 'INC-2026-0140',
    title: 'Garbage Not Collected',
    status: 'resolved',
    location: 'Jugsalai, Market Area',
    ward: 'Ward 3',
    reportedBy: 'Citizen App',
    phone: '+91 94311 00006',
    assignedTeam: 'Team Epsilon',
    reportedAt: '2026-01-08 18:00',
    resolvedAt: '2026-01-09 07:30',
    responseTime: '13.5 hrs',
    type: 'Sanitation',
    verified: false,
    time: '2026-01-08 18:00',
    severity: 'low',
    summary: 'Waste collection was delayed in the Jugsalai market area due to vehicle issues. A backup truck was eventually dispatched to clear the backlog.',
  },
];

const teamPerformance = [
  { team: 'Team Alpha', specialization: 'Traffic', resolved: 234, avgTime: '3.2 mins', efficiency: 96 },
  { team: 'Team Beta', specialization: 'Power', resolved: 198, avgTime: '4.1 mins', efficiency: 92 },
  { team: 'Team Gamma', specialization: 'Water', resolved: 187, avgTime: '3.8 mins', efficiency: 94 },
  { team: 'Team Delta', specialization: 'Infrastructure', resolved: 156, avgTime: '5.2 mins', efficiency: 88 },
  { team: 'Team Epsilon', specialization: 'Sanitation', resolved: 143, avgTime: '4.5 mins', efficiency: 90 },
];

export function ReportsView() {
  const { darkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const handleDownloadReport = (type: string) => {
    // Simulate report content
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
- Total Incidents: ${incidentLogs.length}
- Verified Reports: ${incidentLogs.filter(l => l.verified).length}
- Pending Actions: ${incidentLogs.filter(l => l.status === 'pending').length}

This is a simulated ${type} file for demonstration purposes.
In a production environment, this would be a formatted PDF or XLSX document.
--------------------------------------------------
© 2026 Nagar Sarthi
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set filename based on type
    const filename = type.toLowerCase().replace(/\s+/g, '-') + '.txt';

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`${type} has been generated and downloaded successfully.`);
  };

  const filteredLogs = incidentLogs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const verifiedCount = incidentLogs.filter(log => log.verified).length;
  const unverifiedCount = incidentLogs.filter(log => !log.verified).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <Badge className="bg-blue-500 dark:bg-blue-600 text-white">Total</Badge>
            </div>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{incidentLogs.length}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Total Incidents</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <Badge className="bg-green-500 dark:bg-green-600 text-white">Verified</Badge>
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-300">{verifiedCount}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Verified Reports</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <Badge className="bg-orange-500 dark:bg-orange-600 text-white">Unverified</Badge>
            </div>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-300">{unverifiedCount}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Needs Review</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <Badge className="bg-purple-500 dark:bg-purple-600 text-white">Quality</Badge>
            </div>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">
              {((verifiedCount / incidentLogs.length) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Verification Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Center */}
      <Card className={`shadow-lg transition-all duration-300 border-2 ${darkMode
        ? 'bg-gradient-to-r from-slate-800 to-blue-950 border-blue-900/50'
        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-gray-200'
        }`}>
        <CardContent className={`p-6 ${darkMode ? 'bg-transparent' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-blue-900'
                }`}>
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
                    Response Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50 transition-colors dark:hover:bg-slate-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-blue-900 dark:text-blue-300">{log.id}</span>
                        {log.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <Badge variant="outline" className="mt-1 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                        {log.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-semibold text-gray-900 mb-1 dark:text-white">{log.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                          <MapPin className="w-3 h-3 dark:text-blue-400" />
                          {log.location}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{log.ward}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          log.status === 'resolved'
                            ? 'bg-green-500 text-white'
                            : log.status === 'in-progress'
                              ? 'bg-blue-500 text-white'
                              : 'bg-orange-500 text-white'
                        }
                      >
                        {log.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {log.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                        {log.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.assignedTeam ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center dark:from-blue-600 dark:to-cyan-600">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{log.assignedTeam}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic dark:text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                        <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        {log.reportedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.responseTime ? (
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{log.responseTime}</span>
                      ) : (
                        <span className="text-sm text-gray-500 italic dark:text-gray-400">-</span>
                      )}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Reports */}
      <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-blue-900/50 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40">
          <CardTitle className="text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Performance Reports
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 dark:bg-slate-900/50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {teamPerformance.map((team, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border-2 border-gray-200 dark:border-blue-900/50 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/30 dark:to-slate-900/60 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-none mb-1">{team.team}</h4>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">{team.specialization}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Incidents Resolved</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{team.resolved}</p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Avg Response Time</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{team.avgTime}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600 dark:text-slate-400">Efficiency</p>
                      <Badge
                        className={
                          team.efficiency >= 95
                            ? 'bg-green-500 dark:bg-green-600 text-white'
                            : team.efficiency >= 90
                              ? 'bg-blue-500 dark:bg-blue-600 text-white'
                              : 'bg-orange-500 dark:bg-orange-600 text-white'
                        }
                      >
                        {team.efficiency}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${team.efficiency >= 95
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : team.efficiency >= 90
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                        style={{ width: `${team.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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