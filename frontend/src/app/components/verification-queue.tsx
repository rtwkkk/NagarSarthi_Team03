import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileCheck, Eye, AlertCircle, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

const queueStats = [
  { label: 'Pending Review', count: 47, color: 'text-orange-600' },
  { label: 'Auto-Verified', count: 342, color: 'text-green-600' },
  { label: 'Manually Reviewed', count: 156, color: 'text-blue-600' },
  { label: 'Rejected', count: 23, color: 'text-red-600' },
];

export function VerificationQueue() {
  const avgCredibilityScore = 78;
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-green-600" />
            <CardTitle className="text-blue-900">Report Verification Queue</CardTitle>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            47 Pending
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Average Credibility Score</p>
            <span className="text-lg font-bold text-blue-900">{avgCredibilityScore}%</span>
          </div>
          <Progress value={avgCredibilityScore} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            AI-powered credibility analysis using user history & cross-verification
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {queueStats.map((stat, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  High Priority Queue
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  12 reports with credibility score &lt; 50% require manual review
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Review Now
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Verification Efficiency
                </p>
                <p className="text-xs text-gray-600">
                  87% of reports auto-verified by AI, reducing manual workload by 65%
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          View Full Verification Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
