import { useState } from 'react';
import {
    Database,
    RefreshCw,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { nagarApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SidebarProps {
    onPredictionsUpdated?: () => void;
}

export function AdminActionsSidebar({ onPredictionsUpdated }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [status, setStatus] = useState<{ [key: string]: { type: 'success' | 'error', message: string } | null }>({});

    const handleAction = async (actionKey: string, apiCall: () => Promise<any>) => {
        setLoading((prev: { [key: string]: boolean }) => ({ ...prev, [actionKey]: true }));
        setStatus((prev: { [key: string]: { type: 'success' | 'error', message: string } | null }) => ({ ...prev, [actionKey]: null }));

        try {
            const result = await apiCall();
            if (result.status === 'FAILED') {
                throw new Error(result.error || 'Action failed');
            }
            setStatus((prev: { [key: string]: { type: 'success' | 'error', message: string } | null }) => ({
                ...prev,
                [actionKey]: { type: 'success', message: result.status || 'Success!' }
            }));

            if (actionKey === 'predict' && onPredictionsUpdated) {
                onPredictionsUpdated();
            }
        } catch (err: any) {
            setStatus((prev: { [key: string]: { type: 'success' | 'error', message: string } | null }) => ({
                ...prev,
                [actionKey]: { type: 'error', message: err.message || 'Error occurred' }
            }));
        } finally {
            setLoading((prev: { [key: string]: boolean }) => ({ ...prev, [actionKey]: false }));
        }
    };

    return (
        <aside
            className={`fixed right-0 top-[73px] h-[calc(100vh-73px)] bg-white dark:bg-slate-900 border-l-2 border-gray-300 dark:border-blue-900/50 shadow-2xl transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-12' : 'w-80'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -left-3 top-4 w-6 h-6 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-blue-900/50 rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
            >
                {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isCollapsed ? (
                <div className="flex flex-col items-center py-8 gap-8">
                    <Database className="w-6 h-6 text-blue-600" />
                    <RefreshCw className="w-6 h-6 text-green-600" />
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
            ) : (
                <div className="p-4 flex flex-col gap-6 overflow-y-auto">
                    <div className="border-b border-gray-200 dark:border-blue-900/30 pb-2">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Data Operations
                        </h3>
                        <p className="text-xs text-gray-500">Trigger backend workflows</p>
                    </div>

                    {/* Action Cards */}
                    <ActionCard
                        title="Step 1: Synthetic Data"
                        desc="Generate random incident data for simulation."
                        icon={Database}
                        color="blue"
                        loading={loading['generate']}
                        status={status['generate']}
                        onClick={() => handleAction('generate', nagarApi.generateData)}
                    />

                    <ActionCard
                        title="Step 2: Preprocessing"
                        desc="Clean and restructure data for the model."
                        icon={RefreshCw}
                        color="green"
                        loading={loading['preprocess']}
                        status={status['preprocess']}
                        onClick={() => handleAction('preprocess', nagarApi.preprocessData)}
                    />

                    <ActionCard
                        title="Step 3: SARIMA Forecast"
                        desc="Run time-series prediction for future alerts."
                        icon={TrendingUp}
                        color="purple"
                        loading={loading['predict']}
                        status={status['predict']}
                        onClick={() => handleAction('predict', nagarApi.getPredictions)}
                    />
                </div>
            )}
        </aside>
    );
}

function ActionCard({ title, desc, icon: Icon, color, loading, status, onClick }: any) {
    const colors: any = {
        blue: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
        green: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
        purple: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    };

    return (
        <Card className="border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${colors[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{desc}</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    disabled={loading}
                    onClick={onClick}
                    className="w-full h-9 text-xs font-bold border-2 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                    {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    ) : 'Run Operation'}
                </Button>

                {status && (
                    <div className={`mt-2 flex items-center gap-1.5 text-[10px] font-bold ${status.type === 'success' ? 'text-green-600' : 'text-red-500'
                        }`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {status.message}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
