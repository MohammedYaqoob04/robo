import { Brain, TrendingUp } from 'lucide-react';

interface AIPrediction {
  id: string;
  prediction_type: string;
  risk_score: number;
  confidence: number;
  recommendations: string;
  timestamp: string;
}

interface AIPredictionsPanelProps {
  predictions: AIPrediction[];
}

export function AIPredictionsPanel({ predictions }: AIPredictionsPanelProps) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  const formatPredictionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const latestPrediction = predictions[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-bold text-gray-900">AI Analysis</h2>
      </div>

      {latestPrediction ? (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {formatPredictionType(latestPrediction.prediction_type)}
                </h3>
                <p className="text-xs text-gray-500">{formatTimestamp(latestPrediction.timestamp)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(latestPrediction.risk_score)}`}>
                  {getRiskLabel(latestPrediction.risk_score)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Risk Score</span>
                  <span className="text-sm font-bold text-gray-900">{latestPrediction.risk_score.toFixed(0)}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      latestPrediction.risk_score >= 70
                        ? 'bg-red-600'
                        : latestPrediction.risk_score >= 40
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${latestPrediction.risk_score}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                  <span className="text-sm font-bold text-gray-900">
                    {(latestPrediction.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all"
                    style={{ width: `${latestPrediction.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-purple-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendations</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{latestPrediction.recommendations}</p>
              </div>
            </div>
          </div>

          {predictions.length > 1 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Previous Predictions</h3>
              {predictions.slice(1, 4).map((prediction) => (
                <div key={prediction.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPredictionType(prediction.prediction_type)}
                      </p>
                      <p className="text-xs text-gray-500">{formatTimestamp(prediction.timestamp)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(prediction.risk_score)}`}>
                      {prediction.risk_score.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No predictions available</p>
          <p className="text-sm">AI analysis will appear here</p>
        </div>
      )}
    </div>
  );
}
