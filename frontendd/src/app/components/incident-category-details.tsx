import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { X, TrendingUp, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

// ============= TYPES =============

interface Incident {
  id: string;
  title: string;
  description: string;
  status?: 'pending' | 'verified' | 'rejected' | 'dismissed' | null;
  category?: string;
  createdAt: Timestamp;
}

interface CategoryStats {
  name: string;
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  color: string;
  icon: string;
}

interface IncidentCategoryDetailsProps {
  category: string;
  onClose: () => void;
}

// ============= MAIN COMPONENT =============

export function IncidentCategoryDetails({ onClose }: Omit<IncidentCategoryDetailsProps, 'category'>) {
  const db = getFirestore();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

  // ============= FIREBASE LISTENER =============

  useEffect(() => {
    const incidentsRef = collection(db, 'incidents');
    const q = query(incidentsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incidentsList: Incident[] = [];
      snapshot.forEach((doc) => {
        incidentsList.push({ id: doc.id, ...doc.data() } as Incident);
      });

      setIncidents(incidentsList);
      calculateCategoryStats(incidentsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // ============= CALCULATE CATEGORY STATS =============

  const calculateCategoryStats = (incidentsList: Incident[]) => {
    const categoryMap = new Map<string, CategoryStats>();

    // Predefined categories with colors and icons
    const predefinedCategories = [
      { name: 'Traffic', color: 'from-blue-500 to-blue-700', icon: '🚗' },
      { name: 'Power', color: 'from-yellow-500 to-yellow-700', icon: '⚡' },
      { name: 'Water', color: 'from-cyan-500 to-cyan-700', icon: '💧' },
      { name: 'Roadblock', color: 'from-orange-500 to-orange-700', icon: '🚧' },
      { name: 'Infrastructure', color: 'from-purple-500 to-purple-700', icon: '🏗️' },
      { name: 'Health', color: 'from-pink-500 to-pink-700', icon: '🏥' },
      { name: 'Utility', color: 'from-indigo-500 to-indigo-700', icon: '🔧' },
      { name: 'Others', color: 'from-gray-500 to-gray-700', icon: '📋' },
    ];

    // Initialize predefined categories
    predefinedCategories.forEach(cat => {
      categoryMap.set(cat.name, {
        name: cat.name,
        total: 0,
        verified: 0,
        pending: 0,
        rejected: 0,
        color: cat.color,
        icon: cat.icon,
      });
    });

    // Count incidents by category
    incidentsList.forEach(incident => {
      const categoryName = incident.category || 'Others';
      const stats = categoryMap.get(categoryName) || {
        name: categoryName,
        total: 0,
        verified: 0,
        pending: 0,
        rejected: 0,
        color: 'from-gray-500 to-gray-700',
        icon: '📋',
      };

      stats.total++;

      if (incident.status === 'verified') {
        stats.verified++;
      } else if (incident.status === 'rejected' || incident.status === 'dismissed') {
        stats.rejected++;
      } else {
        stats.pending++;
      }

      categoryMap.set(categoryName, stats);
    });

    // Convert to array and sort by total
    const statsArray = Array.from(categoryMap.values())
      .filter(stat => stat.total > 0)
      .sort((a, b) => b.total - a.total);

    setCategoryStats(statsArray);
  };

  // ============= CALCULATE TOTALS =============

  const totalStats = {
    total: incidents.length,
    verified: incidents.filter(i => i.status === 'verified').length,
    pending: incidents.filter(i => !i.status || i.status === 'pending').length,
    rejected: incidents.filter(i => i.status === 'rejected' || i.status === 'dismissed').length,
  };

  // ============= RENDER =============

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-1 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                Total Incidents - Detailed Breakdown
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Category-wise and status-wise analysis of all incidents
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Overall Status Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Status-wise Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Total Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-500 dark:border-blue-600 rounded-lg p-5 text-center">
                    <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalStats.total}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">Total Incidents</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">100%</div>
                  </div>

                  {/* Verified Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-500 dark:border-green-600 rounded-lg p-5 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalStats.verified}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">Verified</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {totalStats.total > 0 ? ((totalStats.verified / totalStats.total) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  {/* Pending Card */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-5 text-center">
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{totalStats.pending}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">Pending</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {totalStats.total > 0 ? ((totalStats.pending / totalStats.total) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  {/* Rejected Card */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-2 border-red-500 dark:border-red-600 rounded-lg p-5 text-center">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">{totalStats.rejected}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">Rejected</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {totalStats.total > 0 ? ((totalStats.rejected / totalStats.total) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Category-wise Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Category-wise Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStats.map((category, index) => (
                    <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                      <CardHeader className={`border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${category.color} bg-opacity-10 dark:bg-opacity-20`}>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="text-gray-900 dark:text-white">{category.name}</span>
                          <Badge className="ml-auto bg-blue-600 dark:bg-blue-500 text-white">
                            {category.total}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Verified */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{category.verified}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({category.total > 0 ? ((category.verified / category.total) * 100).toFixed(0) : 0}%)
                              </span>
                            </div>
                          </div>

                          {/* Pending */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{category.pending}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({category.total > 0 ? ((category.pending / category.total) * 100).toFixed(0) : 0}%)
                              </span>
                            </div>
                          </div>

                          {/* Rejected */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejected</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{category.rejected}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({category.total > 0 ? ((category.rejected / category.total) * 100).toFixed(0) : 0}%)
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="pt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div className="h-full flex">
                                <div
                                  className="bg-green-500 dark:bg-green-400 h-full"
                                  style={{ width: `${category.total > 0 ? (category.verified / category.total) * 100 : 0}%` }}
                                ></div>
                                <div
                                  className="bg-yellow-500 dark:bg-yellow-400 h-full"
                                  style={{ width: `${category.total > 0 ? (category.pending / category.total) * 100 : 0}%` }}
                                ></div>
                                <div
                                  className="bg-red-500 dark:bg-red-400 h-full"
                                  style={{ width: `${category.total > 0 ? (category.rejected / category.total) * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {categoryStats.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No incident data available</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Total Incidents:</strong> {totalStats.total} |
              <strong className="ml-2">Categories:</strong> {categoryStats.length}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}