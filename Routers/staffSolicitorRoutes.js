import express from "express";
import {
  addStaffSolicitor,
  getAllStaffSolicitors,
  getStaffSolicitorById,
  updateStaffSolicitor,
  deleteStaffSolicitor
} from '../controllers/staffSolicitor.js';

const router = express.Router();

// Add new staff/solicitor
router.post('/', addStaffSolicitor);

// Get all staff/solicitors
router.get('/', getAllStaffSolicitors);

// Get by ID
router.get('/:id', getStaffSolicitorById);

// Update staff/solicitor
router.put('/:id', updateStaffSolicitor);

// Delete staff/solicitor
router.delete('/:id', deleteStaffSolicitor);

export default router;
