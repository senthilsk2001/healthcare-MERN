import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] }, // "10:30"
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent double-booking the same doctor at the same date+time
// (cancelled appointments free up the slot)
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['scheduled', 'completed'] } } }
);

export default mongoose.model('Appointment', appointmentSchema);
