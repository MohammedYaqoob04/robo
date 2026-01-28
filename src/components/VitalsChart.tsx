import { TrendingUp } from 'lucide-react';

interface VitalSign {
  heart_rate: number;
  blood_pressure_systolic: number;
  oxygen_saturation: number;
  temperature: number;
  timestamp: string;
}

interface VitalsChartProps {
  vitals: VitalSign[];
}

export function VitalsChart({ vitals }: VitalsChartProps) {
  if (vitals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Vital Signs Trends</h2>
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No historical data available</p>
        </div>
      </div>
    );
  }

  const recentVitals = vitals.slice(-12);

  const getDataPoints = (key: keyof VitalSign) => {
    return recentVitals.map(v => (typeof v[key] === 'number' ? v[key] : 0)) as number[];
  };

  const heartRateData = getDataPoints('heart_rate');
  const bpData = getDataPoints('blood_pressure_systolic');
  const spo2Data = getDataPoints('oxygen_saturation');
  const tempData = getDataPoints('temperature');

  const normalize = (values: number[], min: number, max: number) => {
    const range = max - min;
    return values.map(v => ((v - min) / range) * 100);
  };

  const heartRateNorm = normalize(heartRateData, 40, 140);
  const bpNorm = normalize(bpData, 70, 200);
  const spo2Norm = normalize(spo2Data, 85, 100);
  const tempNorm = normalize(tempData, 35, 40);

  const createPath = (points: number[]) => {
    if (points.length === 0) return '';

    const width = 100;
    const height = 100;
    const step = width / (points.length - 1 || 1);

    let path = `M 0 ${height - points[0]}`;
    points.forEach((point, i) => {
      if (i > 0) {
        path += ` L ${step * i} ${height - point}`;
      }
    });

    return path;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const charts = [
    {
      label: 'Heart Rate',
      data: heartRateData,
      normalized: heartRateNorm,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      strokeColor: '#dc2626',
      unit: 'BPM'
    },
    {
      label: 'Blood Pressure',
      data: bpData,
      normalized: bpNorm,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      strokeColor: '#2563eb',
      unit: 'mmHg'
    },
    {
      label: 'SpO2',
      data: spo2Data,
      normalized: spo2Norm,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      strokeColor: '#16a34a',
      unit: '%'
    },
    {
      label: 'Temperature',
      data: tempData,
      normalized: tempNorm,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      strokeColor: '#ea580c',
      unit: '°C'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Vital Signs Trends</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charts.map((chart, idx) => (
          <div key={idx} className={`p-4 rounded-lg ${chart.bgColor}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${chart.color}`}>{chart.label}</h3>
              <span className={`text-2xl font-bold ${chart.color}`}>
                {chart.data[chart.data.length - 1]?.toFixed(1)} <span className="text-sm">{chart.unit}</span>
              </span>
            </div>

            <div className="relative">
              <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
                <path
                  d={createPath(chart.normalized)}
                  fill="none"
                  stroke={chart.strokeColor}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>{formatTime(recentVitals[0]?.timestamp || '')}</span>
              <span>{formatTime(recentVitals[recentVitals.length - 1]?.timestamp || '')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
