import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Patient name is required'], trim: true },
    age: { type: Number, required: [true, 'Age is required'], min: 0, max: 150 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, trim: true },
    bloodGroup: { type: String, enum: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    medicalHistory: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
