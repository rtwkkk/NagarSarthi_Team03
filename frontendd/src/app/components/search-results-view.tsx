import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, MapPin, CheckCircle, XCircle, Clock, Users, Eye, ArrowLeft } from 'lucide-react';
import { Alert, AlertDetailsModal } from './alert-details-modal';

const incidentLogs: any[] = [
    {
        id: 'INC-001',
        title: 'Major Traffic Jam - Bistupur Circle',
        status: 'pending',
        location: 'Bistupur Circle, Main Road',
        ward: 'Ward 1',
        reportedBy: 'Raj Kumar',
        phone: '+91 94311 00010',
        assignedTeam: null,
        reportedAt: '2026-01-08 20:30',
        time: '2026-01-08 20:30',
        severity: 'critical',
        responseTime: null,
        type: 'Traffic',
        verified: false,
        summary: 'Massive traffic congestion reported at Bistupur Circle. Vehicles are backed up for several kilometers. Initial reports suggest a multi-vehicle collision near the main intersection.',
    },
    {
        id: 'INC-002',
        title: 'Power Outage - Residential Area',
        status: 'verified',
        location: 'Kadma, Sector 5',
        ward: 'Ward 2',
        reportedBy: 'Priya Sharma',
        phone: '+91 94311 00011',
        assignedTeam: null,
        reportedAt: '2026-01-08 18:00',
        time: '2026-01-08 18:00',
        severity: 'high',
        responseTime: null,
        type: 'Power',
        verified: true,
        summary: 'Total power failure in Kadma Sector 5. Residents report a loud explosion from a nearby transformer prior to the outage. Utility crews have been verified and are preparing for dispatch.',
    },
    {
        id: 'INC-003',
        title: 'Water Pipe Burst',
        status: 'assigned',
        location: 'Sonari, Near Railway Station',
        ward: 'Ward 3',
        reportedBy: 'Amit Singh',
        phone: '+91 94311 00012',
        assignedTeam: 'Team Gamma',
        reportedAt: '2026-01-08 16:20',
        time: '2026-01-08 16:20',
        severity: 'high',
        responseTime: null,
        type: 'Water',
        verified: false,
        summary: 'A high-pressure water main has burst near the Sonari railway station. Significant volumes of water are flooding the ticket counter area. Team Gamma has been assigned for emergency repairs.',
    },
    {
        id: 'INC-005',
        title: 'Street Light Failure - Sakchi Main Road',
        status: 'assigned',
        location: 'Sakchi, Main Road',
        ward: 'Ward 6',
        reportedBy: 'Deepak V.',
        phone: '+91 94311 00013',
        assignedTeam: 'Team Delta',
        reportedAt: '2026-01-08 14:15',
        time: '2026-01-08 14:15',
        severity: 'low',
        responseTime: null,
        type: 'Infrastructure',
        verified: false,
        summary: 'A string of approximately 15 streetlights is non-functional along Sakchi Main Road. This creates a safety hazard for pedestrians and motorists. Team Delta is scheduled to investigate.',
    },
    {
        id: 'INC-006',
        title: 'Garbage Overflow - Jugsalai Market',
        status: 'assigned',
        location: 'Jugsalai, Market Area',
        ward: 'Ward 3',
        reportedBy: 'Suresh M.',
        phone: '+91 94311 00014',
        assignedTeam: 'Team Epsilon',
        reportedAt: '2026-01-08 12:00',
        time: '2026-01-08 12:00',
        severity: 'medium',
        responseTime: null,
        type: 'Sanitation',
        verified: false,
        summary: 'Excessive garbage accumulation reported at the primary collection point in Jugsalai Market. The overflow is creating unsanitary conditions and blocking market access. Team Epsilon is en route.',
    },
    {
        id: 'INC-139',
        title: 'Illegal Parking - Sakchi Market',
        status: 'dismissed',
        location: 'Sakchi, Main Market Area',
        ward: 'Ward 6',
        reportedBy: 'Citizen App',
        phone: '+91 94311 00015',
        assignedTeam: null,
        reportedAt: '2026-01-08 16:20',
        time: '2026-01-08 16:20',
        severity: 'low',
        responseTime: null,
        type: 'Traffic',
        verified: false,
        summary: 'Report of multiple vehicles parked in a no-parking zone near Sakchi Market. Traffic police investigated and found vehicles were parked legally in designated spots during off-hours.',
    },
    {
        id: 'INC-2026-0138',
        title: 'Duplicate Report - Water Leak',
        status: 'dismissed',
        location: 'Bistupur, South Park',
        ward: 'Ward 12',
        reportedBy: 'Field Officer',
        phone: '+91 94311 00016',
        assignedTeam: null,
        reportedAt: '2026-01-08 14:15',
        time: '2026-01-08 14:15',
        severity: 'low',
        responseTime: null,
        type: 'Water',
        verified: false,
        summary: 'A report of a water leak in South Park, Bistupur. This was found to be a duplicate of INC-2026-125 which is already being handled by utility crews.',
    },
    {
        id: 'INC-007',
        title: 'Street Flooding - Mango Area',
        status: 'resolved',
        location: 'Mango, Near Bridge',
        ward: 'Ward 8',
        reportedBy: 'Karan J.',
        phone: '+91 94311 00017',
        assignedTeam: 'Team Gamma',
        reportedAt: '2026-01-08 10:30',
        time: '2026-01-08 10:30',
        severity: 'medium',
        responseTime: '15m',
        type: 'Water',
        verified: true,
        summary: 'Localized flooding reported near the Mango bridge following heavy rainfall. Drain blockage was identified as the cause. Team Gamma cleared the obstruction and water has receded.',
    },
    {
        id: 'INC-008',
        title: 'Broken Traffic Signal',
        status: 'in-progress',
        location: 'Telco Colony Entrance',
        ward: 'Ward 15',
        reportedBy: 'Amit K.',
        phone: '+91 94311 00018',
        assignedTeam: 'Team Alpha',
        reportedAt: '2026-01-14 11:20',
        time: '2026-01-14 11:20',
        severity: 'medium',
        responseTime: '5m',
        type: 'Traffic',
        verified: true,
        summary: 'The traffic signal at Telco Colony Entrance is malfunctioning, flashing only red in all directions. Team Alpha is on-site performing electrical diagnostics and repairs.',
    },
    {
        id: 'INC-009',
        title: 'Public Protest - DC Office',
        status: 'pending',
        location: 'DC Office Area',
        ward: 'Ward 5',
        reportedBy: 'Field Agent',
        phone: '+91 94311 00019',
        assignedTeam: null,
        reportedAt: '2026-01-14 10:45',
        time: '2026-01-14 10:45',
        severity: 'high',
        responseTime: null,
        type: 'Protest',
        verified: true,
        summary: 'A peaceful demonstration of approximately 50 citizens has gathered outside the DC Office. They are protesting the recent utility rate hikes. Situation is being monitored for security.',
    },
    {
        id: 'INC-010',
        title: 'Suspicious Activity Reported',
        status: 'assigned',
        location: 'Bistupur Market',
        ward: 'Ward 1',
        reportedBy: 'Citizen App',
        phone: '+91 94311 00020',
        assignedTeam: 'Patrol Team 1',
        reportedAt: '2026-01-14 09:30',
        time: '2026-01-14 09:30',
        severity: 'medium',
        responseTime: null,
        type: 'Crime',
        verified: false,
        summary: 'Report of individuals behaving suspiciously near the jewelers quadrant in Bistupur Market. Local patrol unit has been assigned to conduct a discrete walkthrough and verify.',
    },
    {
        id: 'INC-011',
        title: 'Bridge Wall Crack',
        status: 'verified',
        location: 'Adityapur Bridge',
        ward: 'Ward 12',
        reportedBy: 'Engineering Team',
        assignedTeam: 'Team Delta',
        reportedAt: '2026-01-14 08:15',
        responseTime: null,
        type: 'Infrastructure',
        verified: true,
        phone: '+91 94311 00021',
        time: '2026-01-14 08:15',
        severity: 'high',
        summary: 'A significant crack has been observed in the load-bearing wall of the Adityapur Bridge. Structural integrity assessment is underway. Team Delta is securing the area.',
    },
    {
        id: 'INC-012',
        title: 'Disease Outbreak Alert',
        status: 'pending',
        location: 'Sitaramdera Colony',
        ward: 'Ward 7',
        reportedBy: 'Health Dept',
        assignedTeam: 'Team Epsilon',
        reportedAt: '2026-01-14 07:00',
        responseTime: null,
        type: 'Health',
        verified: true,
        phone: '+91 94311 00022',
        time: '2026-01-14 07:00',
        severity: 'critical',
        summary: 'Multiple cases of a highly contagious viral infection reported in Sitaramdera Colony. Health Department has issued an alert. Team Epsilon is coordinating with local health workers.',
    },
    {
        id: 'INC-013',
        title: 'Stray Animal Rescue',
        status: 'resolved',
        location: 'Sonari Area',
        ward: 'Ward 3',
        reportedBy: 'NGO Partner',
        assignedTeam: 'Team Epsilon',
        reportedAt: '2026-01-14 06:30',
        responseTime: '20m',
        type: 'Others',
        verified: true,
        phone: '+91 94311 00023',
        time: '2026-01-14 06:30',
        severity: 'low',
        summary: 'A distressed stray dog was reported near Sonari Area. NGO Partner and Team Epsilon successfully rescued the animal and transported it to a local shelter for care.',
    },
    {
        id: 'INC-014',
        title: 'Dangling Power Line',
        status: 'pending',
        location: 'Telco Housing Complex',
        ward: 'Ward 15',
        reportedBy: 'Residents Association',
        assignedTeam: null,
        reportedAt: '2026-01-14 15:30',
        responseTime: null,
        type: 'Power',
        verified: true,
        phone: '+91 94311 00024',
        time: '2026-01-14 15:30',
        severity: 'high',
        summary: 'A live power line is dangling dangerously low across a pedestrian pathway in Telco Housing Complex. Immediate action required to prevent accidents. Utility company has been notified.',
    },
    {
        id: 'INC-015',
        title: 'Open Manhole - Market Entrance',
        status: 'verified',
        location: 'Sakchi Market, Gate 2',
        ward: 'Ward 6',
        reportedBy: 'Traffic Police',
        assignedTeam: null,
        reportedAt: '2026-01-14 14:00',
        responseTime: null,
        type: 'Sanitation',
        verified: true,
        phone: '+91 94311 00025',
        time: '2026-01-14 14:00',
        severity: 'medium',
        summary: 'An open manhole cover has been reported at the entrance of Sakchi Market, posing a hazard to pedestrians and vehicles. Traffic Police have verified the incident and cordoned off the area.',
    },
];

interface SearchResultsViewProps {
    searchQuery: string;
    onClearSearch?: () => void;
}

export function SearchResultsView({ searchQuery, onClearSearch }: SearchResultsViewProps) {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const handleViewDetails = (log: any) => {
        setSelectedAlert(log as Alert);
    };

    const filteredLogs = incidentLogs.filter((log) => {
        if (!searchQuery) return false;
        const query = searchQuery.toLowerCase().trim();

        // Exact status and category keyword matching
        if (query === 'verified') return log.status === 'verified' || log.verified === true;
        if (query === 'pending') return log.status === 'pending';
        if (query === 'dismissed') return log.status === 'dismissed';
        if (query === 'assigned') return log.status === 'assigned';
        if (query === 'resolved') return log.status === 'resolved';
        if (query === 'in progress') return log.status === 'in-progress';

        // Category matching
        if (query === 'traffic') return log.type.toLowerCase() === 'traffic';
        if (query === 'utility') return ['power', 'water', 'sanitation'].includes(log.type.toLowerCase());
        if (query === 'protest') return log.type.toLowerCase() === 'protest';
        if (query === 'crime') return log.type.toLowerCase() === 'crime';
        if (query === 'infrastructure') return log.type.toLowerCase() === 'infrastructure';
        if (query === 'health') return log.type.toLowerCase() === 'health';
        if (query === 'others') return log.type.toLowerCase() === 'others';

        // Team matching (explicit check for common team patterns)
        if (query.includes('team') || query.includes('patrol') || query.includes('rescue')) {
            if (log.assignedTeam && log.assignedTeam.toLowerCase().includes(query)) return true;
        }

        // Location & Ward matching
        if (query.startsWith('ward') || !isNaN(Number(query))) {
            const wardNum = query.replace('ward', '').trim();
            if (log.ward.toLowerCase().includes(wardNum)) return true;
        }

        const locations = ['bistupur', 'sakchi', 'kadma', 'sonari', 'mango', 'telco', 'jugsalai', 'adityapur'];
        if (locations.some(loc => query.includes(loc))) {
            if (log.location.toLowerCase().includes(query)) return true;
        }

        // General search matching
        const statusMatches =
            log.status.toLowerCase().replace('-', ' ').includes(query) ||
            (log.verified && query === 'verified') ||
            (!log.verified && (query.includes('unverified') || query.includes('fake'))) ||
            (log.status === 'dismissed' && query.includes('dismiss'));

        return (
            log.title.toLowerCase().includes(query) ||
            log.location.toLowerCase().includes(query) ||
            log.id.toLowerCase().includes(query) ||
            log.type.toLowerCase().includes(query) ||
            statusMatches ||
            (log.assignedTeam && log.assignedTeam.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6">
            <Card className="border-gray-200 dark:border-blue-900/50 shadow-lg bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-blue-950">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-blue-900 dark:text-white">
                                    Search Results
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing results for "<span className="font-semibold text-blue-700 dark:text-blue-300">{searchQuery}</span>"
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600 text-white text-base px-3 py-1">
                                {filteredLogs.length} found
                            </Badge>
                            {onClearSearch && (
                                <Button variant="outline" size="sm" onClick={onClearSearch} className="gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300">
                                    <ArrowLeft className="w-4 h-4" />
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredLogs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Incident Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Team</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 p-1.5 rounded-full ${log.verified ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                                        }`}>
                                                        {log.verified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{log.title}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {log.location}
                                                        </div>
                                                        {log.summary && (
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 italic mb-1 max-w-xs">
                                                                "{log.summary}"
                                                            </p>
                                                        )}
                                                        <Badge variant="outline" className="text-[10px] h-5 bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:border-gray-600">{log.type}</Badge>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    className={
                                                        log.status === 'resolved'
                                                            ? 'bg-green-500 text-white'
                                                            : log.status === 'in-progress'
                                                                ? 'bg-blue-500 text-white'
                                                                : log.status === 'dismissed'
                                                                    ? 'bg-slate-500 text-white'
                                                                    : 'bg-orange-500 text-white'
                                                    }
                                                >
                                                    {log.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.assignedTeam ? (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{log.assignedTeam}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {log.reportedAt}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400"
                                                    onClick={() => handleViewDetails(log)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" /> View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No incidents found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                We couldn't find any incidents matching "{searchQuery}"
                            </p>
                            <Button variant="link" onClick={onClearSearch} className="mt-2 text-blue-600 dark:text-blue-400">
                                Clear search and return to dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Shared View Details Modal */}
            <AlertDetailsModal
                alert={selectedAlert}
                onClose={() => setSelectedAlert(null)}
            />
        </div>
    );
}
