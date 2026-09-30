import ResourcePage from './ResourcePage.jsx';

// Field/column configs are module-level constants so their identity is stable.

const patientFields = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'age', label: 'Age', type: 'number', required: true },
  { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'], required: true },
  { name: 'phone', label: 'Phone', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'bloodGroup', label: 'Blood group', type: 'select', options: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'medicalHistory', label: 'Medical history', type: 'textarea' },
];
const patientColumns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  { key: 'phone', label: 'Phone' },
  { key: 'bloodGroup', label: 'Blood' },
];

const doctorFields = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'specialization', label: 'Specialization', required: true },
  { name: 'phone', label: 'Phone', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'experience', label: 'Experience (years)', type: 'number', default: 0 },
  { name: 'fee', label: 'Consultation fee (₹)', type: 'number', default: 0 },
  { name: 'available', label: 'Available', type: 'checkbox', default: true },
];
const doctorColumns = [
  { key: 'name', label: 'Name' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'experience', label: 'Exp (yrs)' },
  { key: 'fee', label: 'Fee', render: (r) => `₹${r.fee}` },
  { key: 'available', label: 'Available', render: (r) => (r.available ? 'Yes' : 'No') },
];

const appointmentFields = [
  { name: 'patient', label: 'Patient', ref: 'patients', required: true },
  { name: 'doctor', label: 'Doctor', ref: 'doctors', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'time', label: 'Time', type: 'time', required: true },
  { name: 'status', label: 'Status', type: 'select', options: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  { name: 'reason', label: 'Reason', type: 'textarea' },
  { name: 'notes', label: 'Doctor notes', type: 'textarea' },
];
const appointmentColumns = [
  { key: 'patient', label: 'Patient', render: (r) => r.patient?.name ?? '—' },
  { key: 'doctor', label: 'Doctor', render: (r) => r.doctor?.name ?? '—' },
  { key: 'date', label: 'Date', render: (r) => String(r.date).slice(0, 10) },
  { key: 'time', label: 'Time' },
  { key: 'status', label: 'Status', render: (r) => <span className={`badge ${r.status}`}>{r.status}</span> },
];

export const Patients = () => (
  <ResourcePage title="Patients" endpoint="patients" columns={patientColumns} fields={patientFields} />
);
export const Doctors = () => (
  <ResourcePage title="Doctors" endpoint="doctors" columns={doctorColumns} fields={doctorFields} />
);
export const Appointments = () => (
  <ResourcePage title="Appointments" endpoint="appointments" columns={appointmentColumns} fields={appointmentFields} />
);
