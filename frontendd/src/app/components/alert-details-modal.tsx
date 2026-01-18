import { AlertTriangle, MapPin, Clock, X, User, Phone, FileText } from 'lucide-react';
import { Badge } from './ui/badge';

export type AlertStatus = 'pending' | 'verified' | 'rejected' | 'assigned' | 'resolved' | 'in-progress' | 'dismissed';

export interface Alert {
    id: string;
    title: string;
    location: string;
    time: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    status: AlertStatus;
    reportedBy: string;
    phone: string;
    assignedTeam?: string;
    summary?: string;
}

interface AlertDetailsModalProps {
    alert: Alert | null;
    onClose: () => void;
}

export function AlertDetailsModal({ alert, onClose }: AlertDetailsModalProps) {
    if (!alert) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-blue-950">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-1">
                                {alert.title}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                {alert.location}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* User Name */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Reported By</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{alert.reportedBy}</p>
                        </div>

                        {/* Phone */}
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Phone Number</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{alert.phone}</p>
                        </div>

                        {/* Status */}
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Status</span>
                            </div>
                            <Badge className="bg-blue-600 text-white text-sm">
                                {alert.status.toUpperCase()}
                            </Badge>
                        </div>

                        {/* Timing */}
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Reported</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{alert.time}</p>
                        </div>
                    </div>

                    {/* Incident Summary Section */}
                    {alert.summary && (
                        <div className="p-5 bg-blue-50/50 dark:bg-slate-800/80 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Citizen-Uploaded Summary</span>
                                </div>
                                <Badge variant="outline" className="text-[9px] bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 uppercase px-1">
                                    Verified Source
                                </Badge>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                                "{alert.summary}"
                            </p>
                        </div>
                    )}

                    {alert.assignedTeam && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800/50 mb-6 font-bold">
                            <p className="text-xs font-bold text-blue-900 dark:text-blue-400 mb-1 uppercase tracking-wider">Assigned Team</p>
                            <p className="text-xl font-bold text-blue-900 dark:text-white">{alert.assignedTeam}</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="w-full max-w-xs px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-bold shadow-md"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
