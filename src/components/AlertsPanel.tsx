import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  acknowledged: boolean;
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'low':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) {
      return a.acknowledged ? 1 : -1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Active Alerts</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No active alerts</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-2 transition-all ${getAlertStyles(alert.severity)} ${
                alert.acknowledged ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{alert.title}</h3>
                    <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.acknowledged && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Acknowledged
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
