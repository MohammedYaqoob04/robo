import { Heart, Thermometer, Wind, Activity, Droplet } from 'lucide-react';

interface VitalSigns {
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  oxygen_saturation: number;
  temperature: number;
  respiratory_rate: number;
}

interface VitalSignsDisplayProps {
  vitals: VitalSigns;
}

interface VitalCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

function VitalCard({ icon, label, value, unit, status }: VitalCardProps) {
  const statusColors = {
    normal: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    critical: 'bg-red-50 border-red-200 text-red-700'
  };

  const iconColors = {
    normal: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status]} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className={iconColors[status]}>{icon}</span>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm opacity-75">{unit}</span>
      </div>
    </div>
  );
}

export function VitalSignsDisplay({ vitals }: VitalSignsDisplayProps) {
  const getVitalStatus = (value: number, min: number, max: number, criticalLow: number, criticalHigh: number): 'normal' | 'warning' | 'critical' => {
    if (value < criticalLow || value > criticalHigh) return 'critical';
    if (value < min || value > max) return 'warning';
    return 'normal';
  };

  const vitalCards = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Heart Rate',
      value: vitals.heart_rate.toString(),
      unit: 'BPM',
      status: getVitalStatus(vitals.heart_rate, 60, 100, 40, 120)
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Blood Pressure',
      value: `${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic}`,
      unit: 'mmHg',
      status: getVitalStatus(vitals.blood_pressure_systolic, 90, 140, 80, 180)
    },
    {
      icon: <Droplet className="w-5 h-5" />,
      label: 'SpO2',
      value: vitals.oxygen_saturation.toFixed(1),
      unit: '%',
      status: getVitalStatus(vitals.oxygen_saturation, 95, 100, 90, 100)
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Temperature',
      value: vitals.temperature.toFixed(1),
      unit: '°C',
      status: getVitalStatus(vitals.temperature, 36.5, 37.5, 35, 39)
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: 'Resp. Rate',
      value: vitals.respiratory_rate.toString(),
      unit: '/min',
      status: getVitalStatus(vitals.respiratory_rate, 12, 20, 8, 30)
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {vitalCards.map((card, index) => (
        <VitalCard key={index} {...card} />
      ))}
    </div>
  );
}
