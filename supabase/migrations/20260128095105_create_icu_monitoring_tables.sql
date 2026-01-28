/*
  # ICU Patient Monitoring System Schema

  ## Overview
  This migration creates the core database structure for an automated AI-powered ICU patient monitoring system.

  ## New Tables

  ### 1. `patients`
  Stores patient demographic and admission information
  - `id` (uuid, primary key) - Unique patient identifier
  - `patient_code` (text, unique) - Human-readable patient code
  - `name` (text) - Patient full name
  - `age` (integer) - Patient age
  - `gender` (text) - Patient gender
  - `blood_type` (text) - Patient blood type
  - `admission_date` (timestamptz) - ICU admission timestamp
  - `room_number` (text) - ICU room/bed number
  - `diagnosis` (text) - Primary diagnosis
  - `status` (text) - Current status (active, discharged, critical)
  - `doctor_name` (text) - Attending physician
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `vital_signs`
  Records real-time vital signs monitoring data
  - `id` (uuid, primary key) - Unique record identifier
  - `patient_id` (uuid, foreign key) - Reference to patients table
  - `heart_rate` (integer) - Heart rate in BPM
  - `blood_pressure_systolic` (integer) - Systolic BP in mmHg
  - `blood_pressure_diastolic` (integer) - Diastolic BP in mmHg
  - `oxygen_saturation` (numeric) - SpO2 percentage
  - `temperature` (numeric) - Body temperature in Celsius
  - `respiratory_rate` (integer) - Breaths per minute
  - `timestamp` (timestamptz) - Reading timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `ai_predictions`
  Stores AI analysis and predictive alerts
  - `id` (uuid, primary key) - Unique prediction identifier
  - `patient_id` (uuid, foreign key) - Reference to patients table
  - `prediction_type` (text) - Type of prediction (deterioration, sepsis, etc.)
  - `risk_score` (numeric) - Risk score (0-100)
  - `confidence` (numeric) - AI confidence level (0-1)
  - `recommendations` (text) - AI-generated recommendations
  - `factors` (jsonb) - Contributing factors as JSON
  - `timestamp` (timestamptz) - Prediction timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `alerts`
  Manages critical alerts and notifications
  - `id` (uuid, primary key) - Unique alert identifier
  - `patient_id` (uuid, foreign key) - Reference to patients table
  - `alert_type` (text) - Type of alert (critical, warning, info)
  - `severity` (text) - Severity level (high, medium, low)
  - `title` (text) - Alert title
  - `message` (text) - Detailed alert message
  - `acknowledged` (boolean) - Whether alert has been acknowledged
  - `acknowledged_by` (text) - User who acknowledged
  - `acknowledged_at` (timestamptz) - Acknowledgment timestamp
  - `timestamp` (timestamptz) - Alert generation timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access to authenticated users only
  - Separate policies for SELECT, INSERT, UPDATE, DELETE operations
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  blood_type text DEFAULT '',
  admission_date timestamptz DEFAULT now(),
  room_number text NOT NULL,
  diagnosis text DEFAULT '',
  status text DEFAULT 'active',
  doctor_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vital_signs table
CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  heart_rate integer DEFAULT 0,
  blood_pressure_systolic integer DEFAULT 0,
  blood_pressure_diastolic integer DEFAULT 0,
  oxygen_saturation numeric DEFAULT 0,
  temperature numeric DEFAULT 0,
  respiratory_rate integer DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create ai_predictions table
CREATE TABLE IF NOT EXISTS ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  prediction_type text NOT NULL,
  risk_score numeric DEFAULT 0,
  confidence numeric DEFAULT 0,
  recommendations text DEFAULT '',
  factors jsonb DEFAULT '{}',
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  acknowledged boolean DEFAULT false,
  acknowledged_by text DEFAULT '',
  acknowledged_at timestamptz,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_timestamp ON vital_signs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_patient_id ON ai_predictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_patient_id ON alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Patients table policies
CREATE POLICY "Authenticated users can view patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patients"
  ON patients FOR DELETE
  TO authenticated
  USING (true);

-- Vital signs table policies
CREATE POLICY "Authenticated users can view vital signs"
  ON vital_signs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vital signs"
  ON vital_signs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vital signs"
  ON vital_signs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vital signs"
  ON vital_signs FOR DELETE
  TO authenticated
  USING (true);

-- AI predictions table policies
CREATE POLICY "Authenticated users can view predictions"
  ON ai_predictions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert predictions"
  ON ai_predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update predictions"
  ON ai_predictions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete predictions"
  ON ai_predictions FOR DELETE
  TO authenticated
  USING (true);

-- Alerts table policies
CREATE POLICY "Authenticated users can view alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (true);