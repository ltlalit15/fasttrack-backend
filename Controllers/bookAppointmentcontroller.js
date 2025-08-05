
import { pool } from "../Config/dbConnect.js";
export const bookAppointment = async (req, res) => {
  const {
    client_id,
    staff_id,
    date,
    time,
    duration,
    case_id,
    reminders
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO appointments (client_id, date, time, duration, case_id, status, reminders, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?,  NOW())`,
      [client_id, date, time, duration, case_id || null, 'Confirmed', JSON.stringify(reminders || {})]
    );

    res.status(201).json({ message: "Appointment booked successfully", appointment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment", error: err.message });
  }
};


// export const getAppointmentsByClient = async (req, res) => {
//   const clientId = req.params.clientId;

//   try {
//     const [appointments] = await pool.query(
//       `SELECT a.*, u.name as staff_name, u.email as staff_email
//        FROM appointments a
//        JOIN users u ON a.staff_id = u.id
//        WHERE a.client_id = ?
//        ORDER BY a.date ASC, a.time ASC`,
//       [clientId]
//     );

//     res.status(200).json(appointments);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching appointments", error: err.message });
//   }
// };


export const rescheduleAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const { new_date, new_time, reason } = req.body;

  try {
    const [update] = await pool.query(
      `UPDATE appointments
       SET date = ?, time = ?, status = ?, reschedule_reason = ?, updated_at = NOW()
       WHERE id = ?`,
      [new_date, new_time, 'Rescheduled', reason || null, appointmentId]
    );

    res.status(200).json({ message: "Appointment rescheduled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error rescheduling appointment", error: err.message });
  }
};


// export const getAvailableTimeSlots = async (req, res) => {
//   const { staff_id, date } = req.query;

//   try {
//     const [appointments] = await pool.query(
//       `SELECT time FROM appointments
//        WHERE staff_id = ? AND date = ?`,
//       [staff_id, date]
//     );

//     const bookedTimes = appointments.map(a => a.time);

//     const allSlots = [
//       "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
//       "02:00", "02:30", "03:00", "03:30", "04:00", "04:30"
//     ];

//     const available = allSlots.filter(t => !bookedTimes.includes(t));
//     res.status(200).json(available);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching time slots", error: err.message });
//   }
// };
