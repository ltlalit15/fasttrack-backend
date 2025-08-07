import express from 'express';
import {
  bookAppointment,
//   getAppointmentsByClient,
  rescheduleAppointment,
  getappointmentsByClientId,
  getappointments,
   requestReschedule,
  handleRescheduleRequest,
} from '../Controllers/bookAppointmentcontroller.js';

const router = express.Router();

router.post('/bookAppointment', bookAppointment);
router.get('/getappointments', getappointments);
router.put('/rescheduleAppointment/:id', rescheduleAppointment);
router.get('/getappointmentsByClientId/:client_id', getappointmentsByClientId);
router.put('/requestReschedule/:id', requestReschedule);

// Admin handles (approve/reject) the reschedule request
router.put('/handleRescheduleRequest/:id', handleRescheduleRequest);



// router.get('/getAvailableTimeSlots', getAvailableTimeSlots);
  
export default router;
