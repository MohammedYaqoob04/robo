import { Activity, Bell, Users } from 'lucide-react';

interface HeaderProps {
  activeAlerts: number;
  totalPatients: number;
}

export function Header({ activeAlerts, totalPatients }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ICU Monitoring System</h1>
              <p className="text-sm text-gray-500">24/7 Automated AI Patient Monitoring</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Active Patients</p>
                <p className="text-lg font-bold text-gray-900">{totalPatients}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-lg">
              <Bell className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Active Alerts</p>
                <p className="text-lg font-bold text-gray-900">{activeAlerts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
