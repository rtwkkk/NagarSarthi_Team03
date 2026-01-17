import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Construction, Building2, ShieldAlert, HeartPulse, Activity, Trash2, X, List, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { subscribeToIncidents, Incident } from '../../firebase/services';
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
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [predictions, setPredictions] = useState<PredictionData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToIncidents((items) => {
            setIncidents(items);
        });

        // Load AI predictions
        const loadPredictions = async () => {
            try {
                const data = await nagarApi.getPredictions();
                setPredictions(data);
            } catch (err) {
                console.error("Failed to load predictions", err);
            }
        };
        loadPredictions();

        return () => unsubscribe();
    }, []);

    // Location Coordinate Mapping (expanded for Jamshedpur)
    const locationCoords: Record<string, { top: string; left: string }> = {
        'Bistupur': { top: '35%', left: '40%' },
        'Sakchi': { top: '42%', left: '55%' },
        'Kadma': { top: '28%', left: '22%' },
        'Sonari': { top: '20%', left: '30%' },
        'Mango': { top: '18%', left: '60%' },
        'Telco': { top: '70%', left: '80%' },
        'Jugsalai': { top: '65%', left: '45%' },
        'Adityapur': { top: '78%', left: '25%' },
        'Golmuri': { top: '48%', left: '65%' },
        'Baridih': { top: '45%', left: '82%' },
        'Sidhora': { top: '30%', left: '75%' },
        'Burmamines': { top: '55%', left: '70%' },
        'Gamharia': { top: '75%', left: '15%' },
    };

    // Deterministic jitter for unknown locations to prevent perfect overlap at 50/50
    const getUnknownCoords = (name: string) => {
        let hash = 0;
        const str = name || 'unknown';
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Constrain unknown points to a "safe center" area (20% to 75%)
        // to avoid the floating header and footer panels
        const top = 22 + (Math.abs(hash) % 55);
        const left = 20 + (Math.abs(hash >> 2) % 65);
        return { top: `${top}%`, left: `${left}%` };
    };

    // Helper function to get icon for each layer type
    const getLayerIcon = (category: string) => {
        const cat = category?.toLowerCase().trim() || '';
        if (cat.includes('road') || cat.includes('traffic') || cat.includes('block')) return Construction;
        if (cat.includes('infra') || cat.includes('build') || cat.includes('construction')) return Building2;
        if (cat.includes('health') || cat.includes('medic')) return HeartPulse;
        if (cat.includes('crime') || cat.includes('security') || cat.includes('protest')) return ShieldAlert;
        if (cat.includes('anomaly') || cat.includes('intel') || cat.includes('power')) return Activity;
        if (cat.includes('garbage') || cat.includes('trash') || cat.includes('sanitation')) return Trash2;
        return MapPin;
    };

    const getMarkerColor = (severity: string) => {
        const sev = severity?.toLowerCase() || '';
        if (sev.includes('critical') || sev.includes('high')) return 'bg-red-600';
        if (sev.includes('medium')) return 'bg-orange-500';
        return 'bg-green-500';
    };

    // Group incidents by location
    const groupedIncidents = incidents.reduce((acc, incident) => {
        const locName = incident.locationName || 'Unknown Site';
        if (!acc[locName]) {
            acc[locName] = [];
        }
        acc[locName].push(incident);
        return acc;
    }, {} as Record<string, Incident[]>);

    const activeLocations = Object.entries(groupedIncidents).filter(([locName]) => {
        // Check if at least one incident in this group belongs to an enabled layer
        return groupedIncidents[locName].some(inc => {
            const category = inc.category?.toLowerCase() || '';
            const layer = layers.find(l => {
                const lid = l.id.toLowerCase();
                const keywords: Record<string, string[]> = {
                    'road': ['road', 'traffic', 'block'],
                    'infrastructure': ['infra', 'build', 'construction'],
                    'crime': ['crime', 'security', 'protest'],
                    'health': ['health', 'medic'],
                    'anomaly': ['anomaly', 'intel', 'power'],
                    'garbage': ['garbage', 'trash', 'sanitation']
                };
                if (lid === 'ai-prediction') return false; // AI predictions handled separately
                const matches = keywords[lid] || [lid];
                return matches.some(k => category.includes(k));
            });
            return layer ? layer.enabled : true;
        });
    });

    return (
        <>
            <Card className="border-gray-200 shadow-xl relative dark:bg-slate-900 dark:border-slate-700 overflow-hidden group">
                <CardContent className="p-0 relative">
                    {/* Map Container - Now filling the entire card height */}
                    <div className="relative w-full h-[550px] bg-[#f0f4f8] dark:bg-[#0f172a] transition-colors duration-500">
                        {/* Enhanced Map Background Pattern */}
                        <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="#3b82f6" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#dotGrid)" />
                                {/* Organic City Shapes */}
                                <path d="M0,100 Q150,50 300,150 T600,100" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3" />
                                <path d="M100,0 Q200,300 0,600" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.2" />
                            </svg>
                        </div>

                        {/* Floating Header UI */}
                        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-blue-100 dark:border-slate-800 pointer-events-auto flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-blue-900 dark:text-white leading-none">JAMSHEDPUR</h3>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1">Live Disruption Map</p>
                                </div>
                            </div>

                            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-blue-100 dark:border-slate-800 pointer-events-auto flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 delay-100">
                                <div className="flex items-center gap-2 px-2">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">System Live</span>
                                </div>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                                <button
                                    onClick={() => setShowLiveDisruptions(!showLiveDisruptions)}
                                    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${showLiveDisruptions ? 'bg-blue-600 shadow-inner' : 'bg-gray-300 dark:bg-slate-700'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-md transform ${showLiveDisruptions ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    ></div>
                                </button>
                            </div>
                        </div>

                        {/* Grouped Map Markers */}
                        {showLiveDisruptions && activeLocations.map(([locName, group]) => {
                            const coords = locationCoords[locName] || getUnknownCoords(locName);
                            const mainIncident = group[0];
                            const IconComponent = getLayerIcon(mainIncident.category);
                            const color = getMarkerColor(mainIncident.severity);

                            return (
                                <div
                                    key={locName}
                                    className="absolute"
                                    style={{ top: coords.top, left: coords.left }}
                                >
                                    <div className="relative">
                                        <button
                                            onMouseEnter={() => setHoveredLocation(locName)}
                                            onMouseLeave={() => setHoveredLocation(null)}
                                            onClick={() => setSelectedLocation(locName)}
                                            className={`w-10 h-10 ${color} rounded-full border-4 border-white shadow-2xl animate-pulse dark:border-slate-800 flex items-center justify-center transition-all hover:scale-125 focus:outline-none z-20 group/marker`}
                                        >
                                            <IconComponent className="w-5 h-5 text-white" />

                                            {/* Selection Ring */}
                                            {selectedLocation === locName && (
                                                <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-50"></div>
                                            )}
                                        </button>

                                        {/* Hover Count Badge */}
                                        {group.length > 1 && (
                                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-blue-900 text-white border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black z-30 shadow-lg group-hover/marker:scale-110 transition-transform">
                                                {group.length}
                                            </div>
                                        )}

                                        {/* Hover Info Popover */}
                                        {hoveredLocation === locName && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-xl text-xs whitespace-nowrap shadow-2xl z-50 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                                                <p className="font-black text-blue-400">{locName.toUpperCase()}</p>
                                                <p className="text-[10px] font-medium text-slate-300 mt-0.5">{group.length} ACTIVE INCIDENTS</p>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* AI Prediction Markers */}
                        {showLiveDisruptions && layers.find(l => l.id === 'ai-prediction')?.enabled && predictions.map((pred, idx) => {
                            const coords = locationCoords[pred.area_name] || getUnknownCoords(pred.area_name);
                            const locName = `${pred.area_name} (AI Prediction)`;

                            return (
                                <div
                                    key={`pred-${idx}`}
                                    className="absolute"
                                    style={{ top: coords.top, left: coords.left }}
                                >
                                    <div className="relative group/pred">
                                        <button
                                            onMouseEnter={() => setHoveredLocation(locName)}
                                            onMouseLeave={() => setHoveredLocation(null)}
                                            className={`w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg border-4 border-white shadow-2xl dark:border-slate-800 flex items-center justify-center transition-all hover:scale-125 focus:outline-none z-20`}
                                        >
                                            <Brain className="w-5 h-5 text-white" />
                                            {/* AI Scan Effect */}
                                            <div className="absolute inset-0 rounded-lg bg-white/30 animate-pulse"></div>
                                        </button>

                                        {/* Hover Info Popover */}
                                        {hoveredLocation === locName && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-xl text-xs whitespace-nowrap shadow-2xl z-50 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                                                <p className="font-black text-purple-400">AI FORECAST: {pred.area_name.toUpperCase()}</p>
                                                <p className="text-[10px] font-medium text-slate-300 mt-0.5">
                                                    PREDICTED: {pred.predicted_incidents_7_days} INCIDENTS (7 DAYS)
                                                </p>
                                                <p className={`text-[9px] font-bold mt-1 ${pred.risk_level === 'HIGH' ? 'text-red-400' : 'text-orange-400'}`}>
                                                    RISK LEVEL: {pred.risk_level}
                                                </p>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Selection Overlay List */}
                        {selectedLocation && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-40 flex items-center justify-center p-6 animate-in fade-in duration-300">
                                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-blue-100 dark:border-slate-800">
                                    <div className="p-5 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-between text-white border-b border-blue-400/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                                <List className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg tracking-tight">{selectedLocation}</h3>
                                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">{groupedIncidents[selectedLocation].length} Reports Grouped</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedLocation(null)}
                                            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center justify-center"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto p-4 space-y-3 scrollbar-hide bg-gray-50/50 dark:bg-slate-900/50">
                                        {groupedIncidents[selectedLocation].map((inc, i) => {
                                            const ItemIcon = getLayerIcon(inc.category);
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-4 p-4 rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-blue-400 hover:shadow-md transition-all group/item"
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover/item:scale-110 ${getMarkerColor(inc.severity)}`}>
                                                        <ItemIcon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">{inc.title}</p>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 border-blue-100">
                                                                {inc.category}
                                                            </Badge>
                                                            <Badge className={`text-[9px] font-black uppercase text-white ${getMarkerColor(inc.severity)}`}>
                                                                {inc.severity}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed italic line-clamp-2">
                                                            {inc.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Floating Legend - Bottom Left */}
                        <div className="absolute bottom-4 left-4 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl shadow-xl border border-blue-100 dark:border-slate-800 pointer-events-auto flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]"></div>
                                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Critical</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Medium</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Normal</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
