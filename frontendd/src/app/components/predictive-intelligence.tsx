import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  TrendingUp,
  Brain,
  AlertCircle,
  Car,
  Construction,
  Zap,
  Droplets,
  BarChart3,
  Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { nagarApi, PredictionData } from '../services/api';

const categoryData = [
  { name: 'Traffic', value: 40, color: '#f97316' },
  { name: 'Power Outage', value: 30, color: '#eab308' },
  { name: 'Waterlogging', value: 20, color: '#3b82f6' },
  { name: 'Roadblocks', value: 10, color: '#ef4444' },
];


export function PredictiveIntelligence() {
  const [forecastData, setForecastData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await nagarApi.getPredictions();
        setForecastData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Anticipated Disruptions */}
      <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/20">
        <CardHeader className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-900">Predictive Intelligence</CardTitle>
                <p className="text-xs text-gray-500 mt-1">AI-powered forecasting</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 shadow-sm">
              AI-Powered
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Anticipated Disruptions</p>
                <p className="text-xs text-gray-500">
                  Based on time-series analysis & anomaly detection (Isolation Forest)
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Fetching neural forecasts...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                <AlertCircle className="w-4 h-4 mb-2" />
                Failed to load AI predictions: {error}
              </div>
            ) : forecastData.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm italic">
                No active predictions found. Run SARIMA model to generate.
              </div>
            ) : (
              forecastData.slice(0, 5).map((prediction, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">SARIMA Forecast</h4>
                        <Badge
                          variant="outline"
                          className="text-xs font-bold bg-purple-100 text-purple-900 border-purple-300"
                        >
                          Predicted Incidents: {prediction.predicted_incidents_7_days}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-2 font-medium">
                        Area: {prediction.area_name}
                      </p>

                      <div className="flex items-center justify-between text-[10px] bg-white/60 rounded-lg p-2">
                        <span className="text-gray-600">
                          Risk Level: <span className={`font-bold ${prediction.risk_level === 'HIGH' ? 'text-red-700' :
                              prediction.risk_level === 'MEDIUM' ? 'text-orange-700' : 'text-green-700'
                            }`}>{prediction.risk_level}</span>
                        </span>
                        <span className="text-gray-600 font-bold text-blue-700 uppercase">
                          7-Day Forecast
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-900 font-semibold">
                  3 potential disruptions predicted in the next 6 hours
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-cyan-50/20">
        <CardHeader className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Active Disruption Breakdown</CardTitle>
              <p className="text-xs text-gray-500 mt-1">Category distribution</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="h-64 min-h-[256px] bg-white rounded-xl p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {categoryData.map((category) => {
              let Icon;
              switch (category.name) {
                case 'Traffic':
                  Icon = Car;
                  break;
                case 'Power Outage':
                  Icon = Zap;
                  break;
                case 'Waterlogging':
                  Icon = Droplets;
                  break;
                case 'Roadblocks':
                  Icon = Construction;
                  break;
                default:
                  Icon = AlertCircle;
              }

              return (
                <div
                  key={category.name}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{category.name}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">{category.value}%</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 shadow-sm">
            <p className="text-xs text-cyan-900 font-medium">
              <span className="font-bold">DBSCAN Clustering</span> enabled for hotspot detection
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}