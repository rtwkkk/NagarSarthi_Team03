import { useState } from 'react';
import { KpiCards } from './kpi-cards';
import { DisruptionMap } from './disruption-map';
import { DynamicAlertsFeed } from './dynamic-alerts-feed';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Users, Clock } from 'lucide-react';
import { MapLayersPanel } from './map-layers-panel';



const additionalMetrics = [
  {
    title: 'New Incidents',
    value: '23',
    subtitle: 'Last Hour',
    icon: AlertTriangle,
    bgGradient: 'from-blue-50 to-cyan-50',
    darkBgGradient: 'dark:from-blue-900/30 dark:to-cyan-900/30',
    iconColor: 'text-blue-600',
    darkIconColor: 'dark:text-blue-400',
    detail: 'Reported in last 60 minutes',
  },
  {
    title: 'Field Teams Active',
    value: '18',
    subtitle: 'Active Now',
    icon: Users,
    bgGradient: 'from-green-50 to-emerald-50',
    darkBgGradient: 'dark:from-green-900/30 dark:to-emerald-900/30',
    iconColor: 'text-green-600',
    darkIconColor: 'dark:text-green-400',
    detail: 'Currently deployed across Jamshedpur',
  },
  {
    title: 'Avg Response Time',
    value: '3.9m',
    subtitle: 'Today',
    icon: Clock,
    bgGradient: 'from-purple-50 to-pink-50',
    darkBgGradient: 'dark:from-purple-900/30 dark:to-pink-900/30',
    iconColor: 'text-purple-600',
    darkIconColor: 'dark:text-purple-400',
    detail: 'Target: < 5 minutes',
  },
];

const initialMapLayers = [
  { id: 'traffic', label: 'Traffic', enabled: true, color: 'bg-blue-500' },
  { id: 'utility', label: 'Utility', enabled: true, color: 'bg-purple-500' },
  { id: 'disasters', label: 'Disasters', enabled: false, color: 'bg-red-500' },
  { id: 'protest', label: 'Protest', enabled: false, color: 'bg-orange-500' },
  { id: 'crime', label: 'Crime', enabled: false, color: 'bg-gray-700' },
  { id: 'infrastructure', label: 'Infrastructure', enabled: true, color: 'bg-yellow-500' },
  { id: 'health', label: 'Health', enabled: false, color: 'bg-pink-500' },
  { id: 'others', label: 'Others', enabled: true, color: 'bg-cyan-500' },
];

export function DashboardView() {
  const [layers, setLayers] = useState(initialMapLayers);

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };
  return (
    <div className="space-y-6">
      {/* Top Metrics Row - 4 Main KPI Cards */}
      <KpiCards />

      {/* Additional 3 Metrics Cards - Total 7 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {additionalMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="border border-gray-200 dark:border-blue-900/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer overflow-hidden group"
            >
              <CardContent className={`p-6 bg-gradient-to-br ${metric.bgGradient} ${metric.darkBgGradient}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${metric.iconColor} ${metric.darkIconColor}`} />
                  </div>
                  <Badge className="bg-blue-500 dark:bg-blue-600 text-white text-xs">{metric.subtitle}</Badge>
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 uppercase tracking-wide">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metric.value}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">{metric.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map and Layers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Disruption Map - Left (Larger) */}
        <div className="lg:col-span-2">
          <DisruptionMap layers={layers} />
        </div>

        {/* Map Layers Panel - Right (Sidebar) */}
        <div>
          <MapLayersPanel layers={layers} onToggleLayer={toggleLayer} />
        </div>
      </div>

      {/* New & High-Priority Alerts - Below Map */}
      <DynamicAlertsFeed />
    </div>
  );
}