import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
const MapContainerAny = MapContainer as any;
const TileLayerAny = TileLayer as any;
const MarkerAny = Marker as any;
const PopupAny = Popup as any;
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import { Badge } from './ui/badge';

// Fix for default marker icon in react-leaflet
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ============= TYPES =============

interface IncidentLocation {
  lat: number;
  lng: number;
}

interface Incident {
  id: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  title: string;
  description: string;
  status?: 'pending' | 'verified' | 'rejected' | 'dismissed' | null;
  createdAt: Timestamp;
  location?: IncidentLocation;
}

type CardType = 'total' | 'verified' | 'pending' | 'rejected' | null;

interface StatsCardProps {
  title: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<any>;
  isSelected: boolean;
  onClick: () => void;
  onDetailsClick?: () => void;
  onClose?: () => void;
}

// ============= MAIN COMPONENT =============

export function IncidentsDashboard() {
  const db = getFirestore();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType>(null);

  // Statistics counts
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });

  // Filtered incidents based on selected card
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);

  // ============= FIREBASE REAL-TIME LISTENER =============

  useEffect(() => {
    setLoading(true);

    // Real-time listener for all incidents
    const incidentsRef = collection(db, 'incidents');
    const q = query(incidentsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const incidents: Incident[] = [];

        snapshot.forEach((doc) => {
          incidents.push({
            id: doc.id,
            ...doc.data(),
          } as Incident);
        });

        setAllIncidents(incidents);

        // Calculate statistics
        const total = incidents.length;
        const verified = incidents.filter(
          (inc) => inc.status === 'verified'
        ).length;
        const pending = incidents.filter(
          (inc) =>
            inc.status === 'pending' ||
            !inc.status ||
            inc.status === null
        ).length;
        const rejected = incidents.filter(
          (inc) => inc.status === 'rejected' || inc.status === 'dismissed'
        ).length;

        setStats({ total, verified, pending, rejected });
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching incidents:', err);
        setError('Failed to load incidents. Please try again.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [db]);

  // ============= HANDLE INITIAL FILTER FROM ROUTER STATE =============

  useEffect(() => {
    const state = location.state as { statusFilter?: string } | null;
    if (state?.statusFilter) {
      const filter = state.statusFilter as CardType;
      setSelectedCard(filter);
    }
  }, [location.state]);

  // ============= FILTER INCIDENTS BASED ON SELECTED CARD =============

  useEffect(() => {
    if (!selectedCard) {
      setFilteredIncidents([]);
      return;
    }

    let filtered: Incident[] = [];

    switch (selectedCard) {
      case 'total':
        filtered = allIncidents;
        break;
      case 'verified':
        filtered = allIncidents.filter((inc) => inc.status === 'verified');
        break;
      case 'pending':
        filtered = allIncidents.filter(
          (inc) =>
            inc.status === 'pending' ||
            !inc.status ||
            inc.status === null
        );
        break;
      case 'rejected':
        filtered = allIncidents.filter(
          (inc) => inc.status === 'rejected' || inc.status === 'dismissed'
        );
        break;
    }

    setFilteredIncidents(filtered);
  }, [selectedCard, allIncidents]);

  // ============= CARD CLICK HANDLER =============

  const handleCardClick = (cardType: CardType) => {
    // Navigate to All Incidents Details page with status filter
    if (cardType === 'total') {
      navigate('/incidents/all', { state: { statusFilter: 'all' } });
    } else {
      navigate('/incidents/all', { state: { statusFilter: cardType } });
    }
  };

  const handleAllIncidentsDetails = () => {
    navigate('/incidents/all', { state: { statusFilter: 'all' } });
  };

  // ============= FORMAT DATE =============

  const formatDate = (timestamp: Timestamp): string => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============= GET STATUS BADGE COLOR =============

  const getStatusColor = (status?: string | null): string => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case null:
      case undefined:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
      case 'dismissed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // ============= GET INCIDENTS WITH VALID LOCATIONS =============

  const incidentsWithLocations = filteredIncidents.filter(
    (inc) => inc.location && inc.location.lat && inc.location.lng
  );

  // ============= DEFAULT MAP CENTER =============

  const defaultCenter: [number, number] = [20.5937, 78.9629]; // India center
  const mapCenter: [number, number] =
    incidentsWithLocations.length > 0 && incidentsWithLocations[0].location
      ? [incidentsWithLocations[0].location.lat, incidentsWithLocations[0].location.lng]
      : defaultCenter;

  // ============= RENDER =============

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading incidents dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Incidents Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time monitoring of customer incidents and complaints
            </p>
          </div>

          {/* Active Filter Badge */}
          {selectedCard && (
            <div className="flex items-center gap-3">
              <Badge className="text-base px-4 py-2 bg-blue-600 text-white">
                Filter: {selectedCard.charAt(0).toUpperCase() + selectedCard.slice(1)}
              </Badge>
              <button
                onClick={() => setSelectedCard(null)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Incidents Card */}
        <StatCard
          title="Total Incidents"
          count={stats.total}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          borderColor="border-blue-500 dark:border-blue-600"
          icon={TrendingUp}
          isSelected={selectedCard === 'total'}
          onClick={() => handleCardClick('total')}
          onDetailsClick={handleAllIncidentsDetails}
          onClose={() => setSelectedCard(null)}
        />

        {/* Verified Incidents Card */}
        <StatCard
          title="Verified Incidents"
          count={stats.verified}
          color="text-green-600 dark:text-green-400"
          bgColor="bg-green-50 dark:bg-green-900/20"
          borderColor="border-green-500 dark:border-green-600"
          icon={CheckCircle}
          isSelected={selectedCard === 'verified'}
          onClick={() => handleCardClick('verified')}
          onClose={() => setSelectedCard(null)}
        />

        {/* Pending Incidents Card */}
        <StatCard
          title="Pending Incidents"
          count={stats.pending}
          color="text-yellow-600 dark:text-yellow-400"
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
          borderColor="border-yellow-500 dark:border-yellow-600"
          icon={Clock}
          isSelected={selectedCard === 'pending'}
          onClick={() => handleCardClick('pending')}
          onClose={() => setSelectedCard(null)}
        />

        {/* Rejected Incidents Card */}
        <StatCard
          title="Rejected Incidents"
          count={stats.rejected}
          color="text-red-600 dark:text-red-400"
          bgColor="bg-red-50 dark:bg-red-900/20"
          borderColor="border-red-500 dark:border-red-600"
          icon={XCircle}
          isSelected={selectedCard === 'rejected'}
          onClick={() => handleCardClick('rejected')}
          onClose={() => setSelectedCard(null)}
        />
      </div>

      {/* Details Section - Conditionally Shown */}
      {selectedCard && filteredIncidents.length > 0 && (
        <>
          {/* Details Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCard.charAt(0).toUpperCase() + selectedCard.slice(1)}{' '}
                Incidents Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Showing {filteredIncidents.length} incident(s)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
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
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
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
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {incident.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {incident.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {incident.customerName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {incident.customerEmail || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            incident.status
                          )}`}
                        >
                          {incident.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(incident.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {incident.location ? (
                          <span className="text-green-600 dark:text-green-400">📍 Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map Section - Conditionally Shown */}
          {incidentsWithLocations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Incidents Map
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Showing {incidentsWithLocations.length} incident(s) with location data
                </p>
              </div>

              <div className="h-[500px] w-full">
                <MapContainerAny
                  center={mapCenter}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayerAny
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {incidentsWithLocations.map((incident) => {
                    if (!incident.location) return null;

                    return (
                      <MarkerAny
                        key={incident.id}
                        position={[incident.location.lat, incident.location.lng]}
                      >
                        <PopupAny>
                          <div className="p-2">
                            <h4 className="font-bold text-gray-900 mb-2">
                              {incident.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {incident.description.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-700">
                                Status:
                              </span>
                              <span
                                className={`px-2 py-0.5 text-xs rounded ${getStatusColor(
                                  incident.status
                                )}`}
                              >
                                {incident.status || 'pending'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              <strong>Customer:</strong>{' '}
                              {incident.customerName || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(incident.createdAt)}
                            </div>
                          </div>
                        </PopupAny>
                      </MarkerAny>
                    );
                  })}
                </MapContainerAny>
              </div>
            </div>
          )}

          {incidentsWithLocations.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No incidents with location data in this category.
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {selectedCard && filteredIncidents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Incidents Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no {selectedCard} incidents at the moment.
          </p>
        </div>
      )}

      {!selectedCard && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👆</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select a Category
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Click on any card above to view detailed incidents and map locations.
          </p>
        </div>
      )}
    </div>
  );
}

// ============= STAT CARD COMPONENT =============

function StatCard({
  title,
  count,
  color,
  bgColor,
  borderColor,
  icon: Icon,
  isSelected,
  onClick,
  onDetailsClick,
  onClose,
}: StatsCardProps) {
  return (
    <div
      className={`
        relative p-6 rounded-lg shadow-md cursor-pointer 
        transition-all duration-300 transform hover:scale-105 hover:shadow-xl
        ${bgColor} border-2 
        ${isSelected ? `${borderColor} ring-4 ring-opacity-50` : 'border-transparent'}
      `}
      style={{
        ...(isSelected && { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }),
      }}
    >
      {/* Icon */}
      <div className="mb-2">
        <Icon className="w-10 h-10" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>

      {/* Count */}
      <div className={`text-4xl font-bold ${color} mb-3`}>{count}</div>

      {/* Details Button */}
      {onDetailsClick ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetailsClick();
          }}
          className={`
            w-full py-2 px-4 rounded-md font-semibold text-sm
            transition-colors duration-200
            ${color} ${bgColor} border border-current
            hover:bg-white dark:hover:bg-gray-700
          `}
        >
          All Details →
        </button>
      ) : (
        <button
          onClick={onClick}
          className={`
            w-full py-2 px-4 rounded-md font-semibold text-sm
            transition-colors duration-200
            ${color} ${bgColor} border border-current
            hover:bg-white dark:hover:bg-gray-700
          `}
        >
          {isSelected ? 'Selected' : 'View Details'}
        </button>
      )}

      {/* Close Button - Secondary Style, Right Aligned */}
      {isSelected && onClose && (
        <div className="flex justify-end mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2 rounded-md font-medium text-sm
              text-gray-600 dark:text-gray-400
              bg-transparent border border-gray-300 dark:border-gray-600
              hover:bg-gray-100 dark:hover:bg-gray-700
              hover:border-gray-400 dark:hover:border-gray-500
              transition-all duration-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}