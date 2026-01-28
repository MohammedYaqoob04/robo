import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { aiProcessor } from './lib/aiProcessor';
import { seedDemoPatients } from './utils/seedDemoData';
import { Header } from './components/Header';
import { PatientCard } from './components/PatientCard';
import { VitalSignsDisplay } from './components/VitalSignsDisplay';
import { AlertsPanel } from './components/AlertsPanel';
import { AIPredictionsPanel } from './components/AIPredictionsPanel';
import { VitalsChart } from './components/VitalsChart';
import { Plus, Database } from 'lucide-react';

interface Patient {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: string;
  room_number: string;
  diagnosis: string;
  status: string;
  blood_type: string;
  doctor_name: string;
}

interface VitalSign {
  id: string;
  patient_id: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  oxygen_saturation: number;
  temperature: number;
  respiratory_rate: number;
  timestamp: string;
}

interface Alert {
  id: string;
  patient_id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  acknowledged: boolean;
  timestamp: string;
}

interface AIPrediction {
  id: string;
  patient_id: string;
  prediction_type: string;
  risk_score: number;
  confidence: number;
  recommendations: string;
  timestamp: string;
}

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [currentVitals, setCurrentVitals] = useState<VitalSign | null>(null);
  const [vitalHistory, setVitalHistory] = useState<VitalSign[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [showAddPatient, setShowAddPatient] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadPatientData(selectedPatientId);
    }
  }, [selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) {
      const interval = setInterval(() => {
        simulateVitalSigns(selectedPatientId);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedPatientId]);

  const loadPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'active')
      .order('room_number');

    if (error) {
      console.error('Error loading patients:', error);
      return;
    }

    if (data && data.length > 0) {
      setPatients(data);
      if (!selectedPatientId) {
        setSelectedPatientId(data[0].id);
      }
    }
  };

  const loadPatientData = async (patientId: string) => {
    const [vitalsResult, alertsResult, predictionsResult] = await Promise.all([
      supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(20),
      supabase
        .from('alerts')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(10),
      supabase
        .from('ai_predictions')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(5)
    ]);

    if (vitalsResult.data && vitalsResult.data.length > 0) {
      setCurrentVitals(vitalsResult.data[0]);
      setVitalHistory(vitalsResult.data.reverse());
    }

    if (alertsResult.data) {
      setAlerts(alertsResult.data);
    }

    if (predictionsResult.data) {
      setPredictions(predictionsResult.data);
    }
  };

  const simulateVitalSigns = async (patientId: string) => {
    const baseline = currentVitals || {
      heart_rate: 75,
      blood_pressure_systolic: 120,
      blood_pressure_diastolic: 80,
      oxygen_saturation: 98,
      temperature: 37,
      respiratory_rate: 16
    };

    const newVitals = aiProcessor.generateSimulatedVitals(baseline);

    const { data: vitalData, error: vitalError } = await supabase
      .from('vital_signs')
      .insert({
        patient_id: patientId,
        ...newVitals
      })
      .select()
      .single();

    if (vitalError) {
      console.error('Error inserting vitals:', vitalError);
      return;
    }

    if (vitalData) {
      setCurrentVitals(vitalData);
      setVitalHistory(prev => [...prev.slice(-19), vitalData]);
    }

    const analysis = aiProcessor.analyzeVitalSigns(newVitals);

    if (analysis.alerts.length > 0) {
      const alertPromises = analysis.alerts.map(alert =>
        supabase.from('alerts').insert({
          patient_id: patientId,
          ...alert
        }).select()
      );

      const results = await Promise.all(alertPromises);
      const newAlerts = results
        .filter(r => r.data && r.data.length > 0)
        .map(r => r.data![0]);

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    }

    if (analysis.prediction) {
      const { data: predictionData } = await supabase
        .from('ai_predictions')
        .insert({
          patient_id: patientId,
          ...analysis.prediction
        })
        .select()
        .single();

      if (predictionData) {
        setPredictions(prev => [predictionData, ...prev.slice(0, 4)]);
      }
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('alerts')
      .update({
        acknowledged: true,
        acknowledged_by: 'System User',
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (!error) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, acknowledged: true }
            : alert
        )
      );
    }
  };

  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { data, error } = await supabase
      .from('patients')
      .insert({
        patient_code: formData.get('patient_code') as string,
        name: formData.get('name') as string,
        age: parseInt(formData.get('age') as string),
        gender: formData.get('gender') as string,
        room_number: formData.get('room_number') as string,
        diagnosis: formData.get('diagnosis') as string,
        blood_type: formData.get('blood_type') as string,
        doctor_name: formData.get('doctor_name') as string,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding patient:', error);
      alert('Error adding patient');
      return;
    }

    if (data) {
      setPatients(prev => [...prev, data]);
      setShowAddPatient(false);
      e.currentTarget.reset();
    }
  };

  const handleLoadDemoData = async () => {
    const result = await seedDemoPatients();
    if (result.success) {
      alert('Demo patients loaded successfully!');
      loadPatients();
    } else {
      alert('Error loading demo patients');
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  const patientAlerts = alerts.filter(a => a.patient_id === selectedPatientId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeAlerts={activeAlerts} totalPatients={patients.length} />

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Patients</h2>
                <div className="flex space-x-2">
                  {patients.length === 0 && (
                    <button
                      onClick={handleLoadDemoData}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Load Demo Patients"
                    >
                      <Database className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddPatient(!showAddPatient)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Add Patient"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showAddPatient && (
                <form onSubmit={handleAddPatient} className="mb-4 p-3 bg-blue-50 rounded-lg space-y-2">
                  <input name="patient_code" placeholder="Patient Code" required className="w-full px-2 py-1 text-sm border rounded" />
                  <input name="name" placeholder="Full Name" required className="w-full px-2 py-1 text-sm border rounded" />
                  <input name="age" type="number" placeholder="Age" required className="w-full px-2 py-1 text-sm border rounded" />
                  <select name="gender" required className="w-full px-2 py-1 text-sm border rounded">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input name="room_number" placeholder="Room #" required className="w-full px-2 py-1 text-sm border rounded" />
                  <input name="blood_type" placeholder="Blood Type" className="w-full px-2 py-1 text-sm border rounded" />
                  <input name="diagnosis" placeholder="Diagnosis" className="w-full px-2 py-1 text-sm border rounded" />
                  <input name="doctor_name" placeholder="Doctor Name" className="w-full px-2 py-1 text-sm border rounded" />
                  <button type="submit" className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Add Patient
                  </button>
                </form>
              )}

              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {patients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="mb-2">No patients found</p>
                    <button
                      onClick={handleLoadDemoData}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Load Demo Patients
                    </button>
                  </div>
                ) : (
                  patients.map(patient => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      isSelected={patient.id === selectedPatientId}
                      hasAlerts={alerts.some(a => a.patient_id === patient.id && !a.acknowledged)}
                      onClick={() => setSelectedPatientId(patient.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            {selectedPatient && currentVitals ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">Room {selectedPatient.room_number} • {selectedPatient.patient_code}</p>
                  </div>
                  <VitalSignsDisplay vitals={currentVitals} />
                </div>

                <VitalsChart vitals={vitalHistory} />

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Age</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gender</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Blood Type</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.blood_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Doctor</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.doctor_name || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Diagnosis</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.diagnosis || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">Select a patient to view monitoring data</p>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <AIPredictionsPanel predictions={predictions} />
            <AlertsPanel alerts={patientAlerts} onAcknowledge={handleAcknowledgeAlert} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
