import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { nagarApi, PredictionData } from '../services/api';

interface MapLayer {
  id: string;
  label: string;
  enabled: boolean;
  color: string;
}

interface DisruptionMapProps {
  layers: MapLayer[];
}

export function DisruptionMap({ layers }: DisruptionMapProps) {
  const [showLiveDisruptions, setShowLiveDisruptions] = useState(true);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await nagarApi.getPredictions();
        setPredictions(data);
      } catch (err) {
        console.error('Failed to fetch predictions:', err);
      }
    };
    fetchPredictions();
  }, []);

  // Simulated marker categories
  const markers = [
    { id: 1, top: '25%', left: '33%', layerId: 'traffic', color: 'bg-red-600' },
    { id: 2, top: '50%', left: '50%', layerId: 'disasters', color: 'bg-orange-500' },
    { id: 3, top: '66%', left: '25%', layerId: 'utility', color: 'bg-green-500' },
    { id: 4, top: '33%', right: '33%', layerId: 'crime', color: 'bg-red-600' },
    { id: 5, top: '75%', right: '25%', layerId: 'protest', color: 'bg-orange-500' },
  ];

  return (
    <>
      <Card className="border-gray-200 shadow-lg relative dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-800 dark:to-blue-950">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900 flex items-center gap-2 dark:text-white">
              <MapPin className="w-5 h-5 dark:text-blue-400" />
              Live Disruption Map
            </CardTitle>
            {/* Live Disruption Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Live Disruptions</span>
              <button
                onClick={() => setShowLiveDisruptions(!showLiveDisruptions)}
                className={`relative w-12 h-6 rounded-full transition-colors ${showLiveDisruptions ? 'bg-green-600' : 'bg-gray-300 dark:bg-slate-600'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-md ${showLiveDisruptions ? 'translate-x-6' : 'translate-x-0'
                    }`}
                ></div>
              </button>
              <Badge className={showLiveDisruptions ? 'bg-green-600 text-white' : 'bg-gray-400 text-white dark:bg-slate-600'}>
                {showLiveDisruptions ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {/* Map Container */}
          <div className="relative w-full h-[450px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-b-lg overflow-hidden dark:bg-gradient-to-br dark:from-slate-800 dark:to-blue-950">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20 dark:opacity-30">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="0.5" className="dark:stroke-blue-400" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map Markers - Conditionally Shown by Live Toggle and Layers */}
            {/* Map Markers - Conditionally Shown by Live Toggle and Layers */}
            {showLiveDisruptions && markers.map(marker => {
              const layer = layers.find(l => l.id === marker.layerId);
              if (!layer || !layer.enabled) return null;

              return (
                <div
                  key={marker.id}
                  className={`absolute w-5 h-5 ${marker.color} rounded-full border-4 border-white shadow-lg animate-pulse dark:border-slate-800`}
                  style={{
                    top: marker.top,
                    left: marker.left,
                    right: (marker as any).right
                  }}
                ></div>
              );
            })}

            {/* Predicted Markers - Future Hotspots */}
            {predictions.map((pred: PredictionData, index: number) => (
              <div
                key={`pred-${index}`}
                className="absolute w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-2xl animate-bounce flex items-center justify-center dark:border-slate-800"
                style={{
                  top: `${20 + (index * 15) % 60}%`,
                  left: `${20 + (index * 25) % 60}%`,
                }}
                title={`Predicted Alert: ${pred.predicted_incidents_7_days} incidents in ${pred.area_name}`}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            ))}

            {/* Severity Levels Legend - Floating */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 dark:bg-slate-800 dark:border-slate-600">
              <h4 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2 dark:text-white">
                <MapPin className="w-4 h-4 dark:text-blue-400" />
                Severity Levels
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full shadow-md"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">High - Critical</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Medium - Moderate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Low - Minor</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="w-5 h-5 bg-purple-600 rounded-full shadow-md flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400">AI PREDICTION</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}