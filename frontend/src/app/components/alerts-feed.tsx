import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  AlertTriangle, 
  Car, 
  Construction, 
  Zap, 
  Droplets, 
  MapPin,
  Clock,
  CheckCircle,
  Eye
} from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'traffic',
    title: 'Heavy Traffic Congestion',
    location: 'Ward 12, Bistupur Main Road',
    time: '5 mins ago',
    severity: 'CRITICAL',
    verified: true,
    icon: Car,
  },
  {
    id: 2,
    type: 'roadblock',
    title: 'Road Construction Block',
    location: 'Ward 8, Sakchi Junction',
    time: '12 mins ago',
    severity: 'HIGH',
    verified: true,
    icon: Construction,
  },
  {
    id: 3,
    type: 'power',
    title: 'Power Outage Reported',
    location: 'Ward 15, Jugsalai Sector-A',
    time: '18 mins ago',
    severity: 'CRITICAL',
    verified: true,
    icon: Zap,
  },
  {
    id: 4,
    type: 'water',
    title: 'Waterlogging on Main Street',
    location: 'Ward 4, Kadma Housing Area',
    time: '23 mins ago',
    severity: 'HIGH',
    verified: true,
    icon: Droplets,
  },
  {
    id: 5,
    type: 'traffic',
    title: 'Accident Blocking Lane',
    location: 'Ward 6, Mango Bridge Approach',
    time: '35 mins ago',
    severity: 'CRITICAL',
    verified: false,
    icon: Car,
  },
  {
    id: 6,
    type: 'roadblock',
    title: 'Tree Fall Blocking Road',
    location: 'Ward 9, Dimna Road Near Park',
    time: '42 mins ago',
    severity: 'MODERATE',
    verified: true,
    icon: Construction,
  },
  {
    id: 7,
    type: 'power',
    title: 'Transformer Malfunction',
    location: 'Ward 14, Sonari Market Area',
    time: '1 hour ago',
    severity: 'HIGH',
    verified: true,
    icon: Zap,
  },
  {
    id: 8,
    type: 'water',
    title: 'Drainage System Overflow',
    location: 'Ward 3, Golmuri Station Road',
    time: '1 hour ago',
    severity: 'MODERATE',
    verified: true,
    icon: Droplets,
  },
];

export function AlertsFeed() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'traffic':
        return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'roadblock':
        return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'power':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      case 'water':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50/10">
      <CardHeader className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">New & High-Priority Alerts</CardTitle>
              <p className="text-xs text-gray-500 mt-1">Real-time incident monitoring</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 shadow-sm">
            {alerts.filter(a => a.severity === 'CRITICAL').length} Critical
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              
              return (
                <div
                  key={alert.id}
                  className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 ${getTypeColor(alert.type)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transform hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{alert.title}</h4>
                        {alert.verified && (
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span className="text-xs text-green-700 font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <p className="text-xs text-gray-600 font-medium">{alert.location}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs text-gray-500">{alert.time}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 font-semibold ${getSeverityColor(alert.severity)}`}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-8 text-xs shadow-md">
                          Assign Team
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs hover:bg-gray-50">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}