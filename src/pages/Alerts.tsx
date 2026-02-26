import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, AlertTriangle, Clock, Check, X } from "lucide-react";

interface Alert {
  id: string;
  type: 'spike' | 'trend' | 'warning';
  title: string;
  description: string;
  repository: string;
  category: string;
  timestamp: string;
  isRead: boolean;
  severity: 'high' | 'medium' | 'low';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'spike',
    title: 'Explosive Growth Detected',
    description: 'vinext gained 2,514 stars in the last 24 hours',
    repository: 'cloudflare/vinext',
    category: 'Frontend',
    timestamp: '2024-02-25T10:30:00Z',
    isRead: false,
    severity: 'high'
  },
  {
    id: '2',
    type: 'trend',
    title: 'Emerging Trend Alert',
    description: 'taste-skill showing consistent growth in AI tools category',
    repository: 'Leonxlnx/taste-skill',
    category: 'AI / ML',
    timestamp: '2024-02-25T09:15:00Z',
    isRead: false,
    severity: 'medium'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Unusual Activity Pattern',
    description: 'OpenPlanter showing sudden contributor increase',
    repository: 'ShinMegamiBoson/OpenPlanter',
    category: 'AI / ML',
    timestamp: '2024-02-25T08:45:00Z',
    isRead: true,
    severity: 'medium'
  },
  {
    id: '4',
    type: 'spike',
    title: 'Viral Repository Alert',
    description: 'financial-services-plugins gained 982 stars overnight',
    repository: 'anthropics/financial-services-plugins',
    category: 'AI / ML',
    timestamp: '2024-02-25T07:20:00Z',
    isRead: true,
    severity: 'high'
  },
  {
    id: '5',
    type: 'trend',
    title: 'Silent Climber Detected',
    description: 'polymarket-cli showing steady growth without mainstream attention',
    repository: 'Polymarket/polymarket-cli',
    category: 'Web3',
    timestamp: '2024-02-25T06:10:00Z',
    isRead: false,
    severity: 'low'
  }
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'spike': return <TrendingUp className="w-4 h-4 text-red" />;
      case 'trend': return <Bell className="w-4 h-4 text-blue" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow" />;
      default: return <Bell className="w-4 h-4 text-secondary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red';
      case 'medium': return 'bg-yellow';
      case 'low': return 'bg-green';
      default: return 'bg-secondary';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'high') return alert.severity === 'high';
    return true;
  });

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="alerts"
          onItemClick={(item) => console.log('Navigate to:', item.id)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Signal Alerts</h1>
              <p className="text-secondary">Real-time notifications for emerging trends and unusual activity.</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({alerts.length})
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({alerts.filter(a => !a.isRead).length})
              </Button>
              <Button 
                variant={filter === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('high')}
              >
                High Priority ({alerts.filter(a => a.severity === 'high').length})
              </Button>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`border-border ${!alert.isRead ? 'border-blue bg-surface' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-primary mb-1">{alert.title}</h3>
                            <p className="text-sm text-secondary mb-2">{alert.description}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-xs border-blue text-blue bg-blue/10">{alert.category}</Badge>
                            <Badge variant="outline" className="text-xs border-green text-green bg-green/10">
                              {alert.repository}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-secondary">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(alert.timestamp)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!alert.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(alert.id)}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">No alerts found</h3>
                <p className="text-secondary">
                  {filter === 'unread' ? 'All alerts have been read.' : 
                   filter === 'high' ? 'No high priority alerts at this time.' : 
                   'No alerts match your current filter.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
