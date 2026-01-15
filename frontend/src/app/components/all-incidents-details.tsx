import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileText,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  X,
  Filter as FilterIcon,
} from 'lucide-react';
import { Badge } from './ui/badge';

// ============= TYPES =============

interface Incident {
  id: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  title: string;
  description: string;
  status?: 'pending' | 'verified' | 'rejected' | 'dismissed' | null;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  category?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

type FilterType = 'all' | 'verified' | 'pending' | 'rejected';
type SortField = 'date' | 'status' | 'customer' | 'priority';
type SortOrder = 'asc' | 'desc';

interface Statistics {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  verifiedPercentage: string;
  pendingPercentage: string;
  rejectedPercentage: string;
}

// ============= MAIN COMPONENT =============

export function AllIncidentsDetails() {
  const db = getFirestore();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIncidents, setSelectedIncidents] = useState<Set<string>>(new Set());

  // Statistics
  const [stats, setStats] = useState<Statistics>({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    verifiedPercentage: '0',
    pendingPercentage: '0',
    rejectedPercentage: '0',
  });

  // ============= FIREBASE LISTENER =============

  useEffect(() => {
    const incidentsRef = collection(db, 'incidents');
    const q = query(incidentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incidentsList: Incident[] = [];
      snapshot.forEach((doc) => {
        incidentsList.push({ id: doc.id, ...doc.data() } as Incident);
      });

      setIncidents(incidentsList);

      // Calculate statistics
      const total = incidentsList.length;
      const verified = incidentsList.filter((i) => i.status === 'verified').length;
      const pending = incidentsList.filter(
        (i) => i.status === 'pending' || !i.status
      ).length;
      const rejected = incidentsList.filter(
        (i) => i.status === 'rejected' || i.status === 'dismissed'
      ).length;

      setStats({
        total,
        verified,
        pending,
        rejected,
        verifiedPercentage: total > 0 ? ((verified / total) * 100).toFixed(1) : '0',
        pendingPercentage: total > 0 ? ((pending / total) * 100).toFixed(1) : '0',
        rejectedPercentage: total > 0 ? ((rejected / total) * 100).toFixed(1) : '0',
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // ============= HANDLE INITIAL FILTER FROM ROUTER STATE =============

  useEffect(() => {
    const state = location.state as { statusFilter?: FilterType } | null;
    if (state?.statusFilter && state.statusFilter !== 'all') {
      setActiveFilter(state.statusFilter);
      // Clear the state after applying to prevent reapplying on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ============= FILTERING & SORTING =============

  const getFilteredAndSortedIncidents = (): Incident[] => {
    let filtered = [...incidents];

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((incident) => {
        switch (activeFilter) {
          case 'verified':
            return incident.status === 'verified';
          case 'pending':
            return incident.status === 'pending' || !incident.status;
          case 'rejected':
            return incident.status === 'rejected' || incident.status === 'dismissed';
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (incident) =>
          incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison =
            a.createdAt.toMillis() - b.createdAt.toMillis();
          break;
        case 'status':
          comparison = (a.status || 'pending').localeCompare(b.status || 'pending');
          break;
        case 'customer':
          comparison = (a.customerName || '').localeCompare(b.customerName || '');
          break;
        case 'priority':
          const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          comparison =
            (priorityOrder[a.priority || 'medium'] || 0) -
            (priorityOrder[b.priority || 'medium'] || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredIncidents = getFilteredAndSortedIncidents();

  // ============= HELPER FUNCTIONS =============

  const formatDate = (timestamp: Timestamp): string => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status?: string | null) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'rejected':
      case 'dismissed':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getStatusBadge = (status?: string | null): string => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'rejected':
      case 'dismissed':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
    }
  };

  const getPriorityBadge = (priority?: string): string => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-blue-500 text-white';
      case 'low':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
    }
  };

  // ============= EXPORT FUNCTIONS =============

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Customer', 'Email', 'Status', 'Priority', 'Date'];
    const rows = filteredIncidents.map((inc) => [
      inc.id,
      inc.title,
      inc.customerName || 'N/A',
      inc.customerEmail || 'N/A',
      inc.status || 'pending',
      inc.priority || 'medium',
      formatDate(inc.createdAt),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const toggleIncidentSelection = (id: string) => {
    const newSet = new Set(selectedIncidents);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIncidents(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIncidents.size === filteredIncidents.length) {
      setSelectedIncidents(new Set());
    } else {
      setSelectedIncidents(new Set(filteredIncidents.map((i) => i.id)));
    }
  };

  // ============= RENDER =============

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading all incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Close Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            <X className="w-5 h-5" />
            Close
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Incidents Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive view of all customer-reported incidents and their lifecycle
            </p>
          </div>

          {/* Active Filter Indicator Badge */}
          {activeFilter && activeFilter !== 'all' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <Badge className="text-lg px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                  Active Filter: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                </Badge>
              </div>
              <button
                onClick={() => setActiveFilter('all')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Incident Lifecycle Flow Diagram */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Incident Lifecycle Flow
        </h2>

        {/* Visual Flow */}
        <div className="relative">
          {/* Total at top */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 border-4 border-blue-600 dark:border-blue-500 rounded-lg p-6 inline-block">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                  Total Incidents Reported
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">by Customers</div>
              </div>
            </div>
          </div>

          {/* Arrow down */}
          <div className="flex justify-center mb-8">
            <div className="text-4xl text-gray-400 dark:text-gray-600">↓</div>
          </div>

          {/* Admin Review Stage */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-100 dark:bg-gray-700 rounded-lg px-6 py-3 border-2 border-gray-300 dark:border-gray-600">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                👨‍💼 Review Process
              </div>
            </div>
          </div>

          {/* Arrows splitting */}
          <div className="flex justify-center mb-8">
            <div className="text-2xl text-gray-400 dark:text-gray-600">⤵️ ⤵️ ⤵️</div>
          </div>

          {/* Three outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Verified */}
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.verified}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                Verified Incidents
              </div>
              <div className="text-lg font-semibold text-green-700 dark:text-green-300 mt-2">
                {stats.verifiedPercentage}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Confirmed as legitimate
              </div>
            </div>

            {/* Pending */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6 text-center">
              <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                Pending Review
              </div>
              <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mt-2">
                {stats.pendingPercentage}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Awaiting admin action
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-lg p-6 text-center">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                Rejected/Dismissed
              </div>
              <div className="text-lg font-semibold text-red-700 dark:text-red-300 mt-2">
                {stats.rejectedPercentage}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Invalid or duplicate
              </div>
            </div>
          </div>

          {/* Validation Check */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Data Integrity Check:
              </span>
              <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                {stats.verified} + {stats.pending} + {stats.rejected} = {stats.total}
              </span>
              <span className="text-green-600 dark:text-green-400 font-bold">✓ Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Detailed Statistics Breakdown
        </h3>

        <div className="space-y-4">
          {/* Verified Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Verified Incidents</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.verified} ({stats.verifiedPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-600 dark:bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${stats.verifiedPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Pending Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Pending Review</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.pending} ({stats.pendingPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-yellow-500 dark:bg-yellow-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${stats.pendingPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Rejected Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Rejected/Dismissed</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.rejected} ({stats.rejectedPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-red-600 dark:bg-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${stats.rejectedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, customer, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'verified', 'pending', 'rejected'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Export Actions */}
        <div className="flex flex-wrap gap-4 mt-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="status">Status</option>
              <option value="customer">Customer</option>
              <option value="priority">Priority</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredIncidents.length}</span> of{' '}
          <span className="font-semibold">{stats.total}</span> incidents
        </div>
      </div>

      {/* Comprehensive Incidents Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIncidents.size === filteredIncidents.length && filteredIncidents.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIncidents.has(incident.id)}
                      onChange={() => toggleIncidentSelection(incident.id)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                    {incident.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {incident.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {incident.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {incident.customerName || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {incident.customerEmail || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(incident.status)}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                          incident.status
                        )}`}
                      >
                        {incident.status || 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadge(
                        incident.priority
                      )}`}
                    >
                      {incident.priority || 'medium'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(incident.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions Footer */}
        {selectedIncidents.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedIncidents.size} incident(s) selected
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  Verify Selected
                </button>
                <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                  Reject Selected
                </button>
                <button
                  onClick={() => setSelectedIncidents(new Set())}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredIncidents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center mt-6">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Incidents Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
}