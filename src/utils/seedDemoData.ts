import { supabase } from '../lib/supabase';

export async function seedDemoPatients() {
  const demoPatients = [
    {
      patient_code: 'ICU-001',
      name: 'John Anderson',
      age: 65,
      gender: 'Male',
      blood_type: 'O+',
      room_number: 'ICU-101',
      diagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
      doctor_name: 'Dr. Sarah Mitchell',
      status: 'active'
    },
    {
      patient_code: 'ICU-002',
      name: 'Maria Rodriguez',
      age: 58,
      gender: 'Female',
      blood_type: 'A+',
      room_number: 'ICU-102',
      diagnosis: 'Septic Shock',
      doctor_name: 'Dr. Michael Chen',
      status: 'active'
    },
    {
      patient_code: 'ICU-003',
      name: 'Robert Thompson',
      age: 72,
      gender: 'Male',
      blood_type: 'B-',
      room_number: 'ICU-103',
      diagnosis: 'Myocardial Infarction',
      doctor_name: 'Dr. Sarah Mitchell',
      status: 'active'
    },
    {
      patient_code: 'ICU-004',
      name: 'Emily Watson',
      age: 45,
      gender: 'Female',
      blood_type: 'AB+',
      room_number: 'ICU-104',
      diagnosis: 'Traumatic Brain Injury',
      doctor_name: 'Dr. James Wilson',
      status: 'active'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('patients')
      .upsert(demoPatients, { onConflict: 'patient_code' })
      .select();

    if (error) {
      console.error('Error seeding demo patients:', error);
      return { success: false, error };
    }

    console.log('Demo patients seeded successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return { success: false, error };
  }
}
