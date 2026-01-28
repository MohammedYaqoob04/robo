export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          patient_code: string
          name: string
          age: number
          gender: string
          blood_type: string
          admission_date: string
          room_number: string
          diagnosis: string
          status: string
          doctor_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_code: string
          name: string
          age: number
          gender: string
          blood_type?: string
          admission_date?: string
          room_number: string
          diagnosis?: string
          status?: string
          doctor_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_code?: string
          name?: string
          age?: number
          gender?: string
          blood_type?: string
          admission_date?: string
          room_number?: string
          diagnosis?: string
          status?: string
          doctor_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      vital_signs: {
        Row: {
          id: string
          patient_id: string
          heart_rate: number
          blood_pressure_systolic: number
          blood_pressure_diastolic: number
          oxygen_saturation: number
          temperature: number
          respiratory_rate: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          heart_rate?: number
          blood_pressure_systolic?: number
          blood_pressure_diastolic?: number
          oxygen_saturation?: number
          temperature?: number
          respiratory_rate?: number
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          heart_rate?: number
          blood_pressure_systolic?: number
          blood_pressure_diastolic?: number
          oxygen_saturation?: number
          temperature?: number
          respiratory_rate?: number
          timestamp?: string
          created_at?: string
        }
      }
      ai_predictions: {
        Row: {
          id: string
          patient_id: string
          prediction_type: string
          risk_score: number
          confidence: number
          recommendations: string
          factors: Json
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          prediction_type: string
          risk_score?: number
          confidence?: number
          recommendations?: string
          factors?: Json
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          prediction_type?: string
          risk_score?: number
          confidence?: number
          recommendations?: string
          factors?: Json
          timestamp?: string
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          patient_id: string
          alert_type: string
          severity: string
          title: string
          message: string
          acknowledged: boolean
          acknowledged_by: string
          acknowledged_at: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          alert_type: string
          severity: string
          title: string
          message: string
          acknowledged?: boolean
          acknowledged_by?: string
          acknowledged_at?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          alert_type?: string
          severity?: string
          title?: string
          message?: string
          acknowledged?: boolean
          acknowledged_by?: string
          acknowledged_at?: string | null
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
}
