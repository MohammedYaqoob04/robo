import { User, AlertCircle } from 'lucide-react';

interface Patient {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: string;
  room_number: string;
  diagnosis: string;
  status: string;
}

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  hasAlerts: boolean;
  onClick: () => void;
}

export function PatientCard({ patient, isSelected, hasAlerts, onClick }: PatientCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    critical: 'bg-red-100 text-red-800',
    stable: 'bg-blue-100 text-blue-800'
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">{patient.patient_code}</p>
          </div>
        </div>
        {hasAlerts && (
          <div className="flex items-center space-x-1 text-red-600 animate-pulse">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Room:</span>
          <span className="font-medium text-gray-900">{patient.room_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Age/Gender:</span>
          <span className="font-medium text-gray-900">{patient.age}Y / {patient.gender}</span>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">Diagnosis:</p>
          <p className="text-xs text-gray-900 line-clamp-2">{patient.diagnosis || 'N/A'}</p>
        </div>
        <div className="mt-2">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[patient.status as keyof typeof statusColors] || statusColors.active}`}>
            {patient.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
