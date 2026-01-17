import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, Eye, CheckSquare, ChevronRight } from 'lucide-react';
import { AlertDetailsModal, Alert as AlertType, AlertStatus } from './alert-details-modal';
import { subscribeToIncidents, updateIncident, Incident } from '../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getTeamForCategory } from '../services/incident-utils';

interface DynamicAlertsFeedProps {
  onNavigate?: (section: string) => void;
}

export function DynamicAlertsFeed({ onNavigate }: DynamicAlertsFeedProps) {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToIncidents((incidents: Incident[]) => {
      // Filter for last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const filteredIncidents = incidents.filter(incident => {
        try {
          const date = incident.createdAt?.toDate ? incident.createdAt.toDate() : new Date(incident.createdAt);
          return date >= twentyFourHoursAgo;
        } catch (e) {
          return true; // Keep if date is invalid to avoid missing data, or false to be strict
        }
      });

      const mappedAlerts: AlertType[] = filteredIncidents.map(incident => {
        // Handle Timestamp or date string
        let timeString = 'Just now';
        try {
          const date = incident.createdAt?.toDate ? incident.createdAt.toDate() : new Date(incident.createdAt);
          timeString = formatDistanceToNow(date, { addSuffix: true });
        } catch (e) {
          console.error("Error formatting date", e);
        }

        return {
          id: incident.id || Math.random().toString(),
          title: incident.title,
          location: incident.locationName, // Matched with Flutter logic
          time: timeString,
          severity: (incident.severity as any) || 'medium',
          type: incident.category, // Matched with Flutter logic
          status: (incident.status as AlertStatus) || 'pending',
          reportedBy: incident.reporterName,
          phone: 'N/A',
          summary: incident.description,
          assignedTeam: incident.resolvedBy || undefined,
        };
      });
      setAlerts(mappedAlerts);
    });

    return () => unsubscribe();
  }, []);

  const updateAlertStatus = async (id: string, newStatus: any, assignedTeam?: string) => {
    try {
      // Optimistic update
      setAlerts(alerts.map(alert =>
        alert.id === id ? { ...alert, status: newStatus, assignedTeam } : alert
      ));

      // Prepare updates
      const updates: any = {
        status: newStatus,
        ...(assignedTeam && { resolvedBy: assignedTeam })
      };

      if (newStatus === 'in-progress' || newStatus === 'assigned') {
        updates.assignedAt = serverTimestamp();
      }

      if (newStatus === 'resolved') {
        updates.resolvedAt = serverTimestamp();
      }

      // Update in Firebase
      await updateIncident(id, updates);
    } catch (error) {
      console.error("Error updating incident status:", error);
      // Revert optimistic update if needed or show error notification
      alert(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleVerify = (id: string) => {
    updateAlertStatus(id, 'verified');
  };

  const handleReject = (id: string) => {
    updateAlertStatus(id, 'rejected');
  };


  const handleAssign = (id: string) => {
    const alert = alerts.find(a => a.id === id);
    const teamName = getTeamForCategory(alert?.type);
    updateAlertStatus(id, 'in-progress', teamName);
  };

  const handleResolve = (id: string) => {
    updateAlertStatus(id, 'resolved');
  };

  const getCardBackground = () => {
    // Light mode: white background with gray border
    // Dark mode: slate/zinc background with darker border
    return 'bg-white border-gray-400 dark:bg-slate-800 dark:border-slate-700';
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
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active alerts found.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2 rounded-lg border-2 transition-all duration-300 ${getCardBackground()} shadow-gray-300/60 shadow-md hover:shadow-gray-400/70 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={
                              alert.severity.toLowerCase() === 'critical'
                                ? 'bg-red-600 text-white text-[10px] px-1.5 py-0'
                                : alert.severity.toLowerCase() === 'high'
                                  ? 'bg-orange-500 text-white text-[10px] px-1.5 py-0'
                                  : alert.severity.toLowerCase() === 'medium'
                                    ? 'bg-yellow-500 text-white text-[10px] px-1.5 py-0'
                                    : 'bg-blue-500 text-white text-[10px] px-1.5 py-0'
                            }
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 text-[10px] px-1.5 py-0">
                            {alert.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400 font-bold bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-slate-700">
                          <Clock className="w-2.5 h-2.5 text-blue-600" />
                          {alert.time}
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 text-xs mb-0.5 dark:text-slate-100 leading-tight">
                        {alert.title}
                      </h4>

                      <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1 dark:text-slate-400">
                        <MapPin className="w-2.5 h-2.5 text-red-500" />
                        <span className="truncate">{alert.location}</span>
                      </div>

                      {alert.summary && (
                        <p className="text-[10px] text-gray-500 dark:text-slate-300 line-clamp-1 italic mb-1 px-1 border-l-2 border-blue-200">
                          "{alert.summary}"
                        </p>
                      )}

                      <div className="flex items-center justify-end mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7.5 px-3 text-[10px] bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300 font-bold uppercase transition-all shadow-sm"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
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
                        Dismiss
                      </Button>
                    </div>
                  )}

                  {/* State 2: Verified - Assign Team Button */}
                  {alert.status === 'verified' && (
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold"
                      onClick={() => handleAssign(alert.id)}
                    >
                      Assign {getTeamForCategory(alert.type)}
                    </Button>
                  )}

                  {/* State 3: Team Assigned/In Progress - Resolve Button */}
                  {(alert.status === 'assigned' || alert.status === 'in-progress') && (
                    <div className="mt-3 space-y-2">
                      <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
                        <p className="text-sm font-semibold text-blue-800 flex items-center gap-2 dark:text-blue-300">
                          <CheckCircle className="w-4 h-4" />
                          Team Assigned: {alert.assignedTeam}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    </div>
                  )}

                  {/* State 4: Resolved */}
                  {alert.status === 'resolved' && (
                    <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg dark:bg-green-950/30 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-800 flex items-center gap-2 dark:text-blue-300">
                        <CheckCircle className="w-4 h-4" />
                        Incident Resolved
                      </p>
                    </div>
                  )}

                  {/* State 5: Rejected - Dismissed */}
                  {alert.status === 'rejected' && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg dark:bg-red-950/30 dark:border-red-800">
                      <p className="text-sm font-semibold text-red-800 flex items-center gap-2 dark:text-blue-300">
                        <XCircle className="w-4 h-4" />
                        Incident Dismissed
                      </p>
                    </div>
                  )}
                </div>
              )))}
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-100 dark:border-slate-700 p-3 bg-gray-50/50 dark:bg-slate-800/50">
          <Button
            className="w-full bg-blue-900 hover:bg-blue-950 text-white dark:bg-blue-700 dark:hover:bg-blue-800 font-bold group border-none shadow-md"
            onClick={() => onNavigate ? onNavigate('reports') : navigate('/reports')}
          >
            View All Incidents
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDetailsModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  );
}