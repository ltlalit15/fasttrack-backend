import express from "express";
import {
  addStaffSolicitor,
  getAllStaffSolicitors,
  getStaffSolicitorById,
  updateStaffSolicitor,
  deleteStaffSolicitor
} from "../controllers/staffSolicitor.js";

const router = express.Router();

router.post("/", addStaffSolicitor);
router.get("/", getAllStaffSolicitors);
router.get("/:id", getStaffSolicitorById);
router.put("/:id", updateStaffSolicitor);
router.delete("/:id", deleteStaffSolicitor);

export default router;
