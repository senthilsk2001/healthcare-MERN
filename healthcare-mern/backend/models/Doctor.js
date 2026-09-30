import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Doctor name is required'], trim: true },
    specialization: { type: String, required: [true, 'Specialization is required'], trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    experience: { type: Number, min: 0, default: 0 },
    fee: { type: Number, min: 0, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
