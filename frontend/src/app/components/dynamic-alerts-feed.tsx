import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { AlertDetailsModal, Alert as AlertType } from './alert-details-modal';

const initialAlerts: AlertType[] = [
  {
    id: 'INC-001',
    title: 'Major Traffic Jam - Bistupur Circle',
    location: 'Bistupur Circle, Main Road',
    time: '2 mins ago',
    severity: 'critical',
    type: 'Traffic',
    status: 'pending',
    reportedBy: 'Raj Kumar',
    phone: '+91 98765 43210',
    summary: 'Heavy congestion reported near Bistupur Circle due to a broken-down vehicle. Traffic is moving at a snail\'s pace, affecting commuters during peak hours.',
  },
  {
    id: 'INC-002',
    title: 'Power Outage - Residential Area',
    location: 'Kadma, Sector 5',
    time: '8 mins ago',
    severity: 'high',
    type: 'Power',
    status: 'verified',
    reportedBy: 'Priya Sharma',
    phone: '+91 98765 43211',
    summary: 'A complete power outage has been reported across Sector 5 in Kadma. Residents have been without electricity for over an hour. Utility teams have been notified.',
  },
  {
    id: 'INC-003',
    title: 'Water Pipe Burst',
    location: 'Sonari, Near Railway Station',
    time: '12 mins ago',
    severity: 'high',
    type: 'Water',
    status: 'assigned',
    reportedBy: 'Amit Singh',
    phone: '+91 98765 43212',
    assignedTeam: 'Team Gamma',
    summary: 'A major water main burst has occurred near the Sonari railway station, causing significant localized flooding. Water supply to the surrounding area is currently disrupted.',
  },
  {
    id: 'INC-004',
    title: 'Road Blockage - Construction Debris',
    location: 'Sakchi, Station Road',
    time: '18 mins ago',
    severity: 'medium',
    type: 'Roadblock',
    status: 'rejected',
    reportedBy: 'Anonymous',
    phone: 'N/A',
    summary: 'Construction debris has been dumped on Sakchi Station Road, partially blocking the thoroughfare. This report was rejected after field verification found no obstruction.',
  },
];

export function DynamicAlertsFeed() {
  const [alerts, setAlerts] = useState<AlertType[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  const updateAlertStatus = (id: string, newStatus: any, assignedTeam?: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: newStatus, assignedTeam } : alert
    ));
  };

  const handleVerify = (id: string) => {
    updateAlertStatus(id, 'verified');
  };

  const handleReject = (id: string) => {
    updateAlertStatus(id, 'rejected');
  };

  const handleAssign = (id: string) => {
    const alert = alerts.find(a => a.id === id);
    let teamName = 'Team Beta'; // Default

    if (alert) {
      if (alert.type === 'Traffic') teamName = 'Team Alpha';
      else if (alert.type === 'Power') teamName = 'Team Beta';
      else if (alert.type === 'Water') teamName = 'Team Gamma';
      else if (alert.type === 'Infrastructure' || alert.type === 'Roadblock') teamName = 'Team Delta';
      else if (alert.type === 'Sanitation' || alert.type === 'Health' || alert.type === 'Others') teamName = 'Team Epsilon';
    }

    updateAlertStatus(id, 'assigned', teamName);
  };

  const getCardBackground = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300';
      case 'rejected':
        return 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300';
      case 'assigned':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <>
      <Card className="border-gray-200 shadow-lg dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-800 dark:to-red-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900 flex items-center gap-2 dark:text-white">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              New & High-Priority Alerts
            </CardTitle>
            <Badge className="bg-red-600 text-white">{alerts.length}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 max-h-[600px] overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${getCardBackground(alert.status)} hover:shadow-lg dark:border-slate-600 ${alert.status === 'verified'
                  ? 'dark:bg-gradient-to-br dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800'
                  : alert.status === 'rejected'
                    ? 'dark:bg-gradient-to-br dark:from-red-950/40 dark:to-pink-950/40 dark:border-red-800'
                    : alert.status === 'assigned'
                      ? 'dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-cyan-950/40 dark:border-blue-800'
                      : 'dark:bg-slate-800 dark:border-slate-600'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          alert.severity === 'critical'
                            ? 'bg-red-600 text-white'
                            : alert.severity === 'high'
                              ? 'bg-orange-500 text-white'
                              : alert.severity === 'medium'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-blue-500 text-white'
                        }
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                        {alert.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 dark:text-white">
                        {alert.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1 dark:text-gray-300">
                      <MapPin className="w-3 h-3 dark:text-blue-400" />
                      {alert.location}
                    </div>
                    {alert.summary && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 italic mb-2 px-1 border-l-2 border-blue-200 dark:border-blue-800">
                        "{alert.summary}"
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 dark:text-blue-400" />
                        {alert.time}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 font-bold uppercase tracking-wider gap-1"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Eye className="w-3 h-3" />
                        {alert.summary ? 'View Summary' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* State 1: Pending - Verify/Reject Buttons */}
                {alert.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      onClick={() => handleVerify(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 font-semibold"
                      onClick={() => handleReject(alert.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {/* State 2: Verified - Assign Team Button */}
                {alert.status === 'verified' && (
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => handleAssign(alert.id)}
                  >
                    Assign Team
                  </Button>
                )}

                {/* State 3: Rejected - Dismissed */}
                {alert.status === 'rejected' && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg dark:bg-red-950/30 dark:border-red-800">
                    <p className="text-sm font-semibold text-red-800 flex items-center gap-2 dark:text-red-300">
                      <XCircle className="w-4 h-4" />
                      Incident Dismissed
                    </p>
                  </div>
                )}

                {/* State 4: Assigned - Team Assigned */}
                {alert.status === 'assigned' && (
                  <div className="mt-3 space-y-2">
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg dark:bg-green-950/30 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-800 flex items-center gap-2 dark:text-green-300">
                        <CheckCircle className="w-4 h-4" />
                        Team Assigned: {alert.assignedTeam}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDetailsModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  );
}