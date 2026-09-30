import { Router } from 'express';
import { crud } from '../controllers/crud.js';
import { protect, adminOnly } from '../middleware/auth.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// Any logged-in user can read/create/update. Only admins can delete.
const buildRouter = (controller) => {
  const router = Router();
  router.use(protect);
  router.route('/').get(controller.getAll).post(controller.create);
  router
    .route('/:id')
    .get(controller.getOne)
    .put(controller.update)
    .delete(adminOnly, controller.remove);
  return router;
};

export const patientRoutes = buildRouter(
  crud(Patient, { searchFields: ['name', 'phone', 'email'] })
);
export const doctorRoutes = buildRouter(
  crud(Doctor, { searchFields: ['name', 'specialization'] })
);
export const appointmentRoutes = buildRouter(
  crud(Appointment, { populate: 'patient doctor', searchFields: ['reason', 'status'] })
);
