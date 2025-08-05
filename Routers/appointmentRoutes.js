import express from 'express';
import {
  bookAppointment,
//   getAppointmentsByClient,
  rescheduleAppointment,
//   getAvailableTimeSlots
} from '../Controllers/bookAppointmentcontroller.js';

const router = express.Router();

router.post('/bookAppointment', bookAppointment);
// router.get('/getAppointmentsByClient/:clientId', getAppointmentsByClient);
router.put('/rescheduleAppointment/:id', rescheduleAppointment);
// router.get('/getAvailableTimeSlots', getAvailableTimeSlots);

export default router;
