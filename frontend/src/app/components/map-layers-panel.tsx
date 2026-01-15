import { Card } from './ui/card';
import { Layers } from 'lucide-react';

interface MapLayersPanelProps {
    layers: any[];
    onToggleLayer: (id: string) => void;
}

export function MapLayersPanel({ layers, onToggleLayer }: MapLayersPanelProps) {
    return (
        <Card className="border-gray-200 shadow-lg dark:bg-slate-800 dark:border-slate-600">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-700 dark:to-blue-950">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 dark:text-white">
                    <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Map Layers
                </h4>
            </div>

            <div className="p-3 space-y-2">
                {layers.map((layer) => (
                    <div
                        key={layer.id}
                        className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-50 transition-all cursor-pointer dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                        onClick={() => onToggleLayer(layer.id)}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${layer.color} rounded-full shadow-sm`}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{layer.label}</span>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            className={`relative w-10 h-5 rounded-full transition-colors ${layer.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-md ${layer.enabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            ></div>
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
}
