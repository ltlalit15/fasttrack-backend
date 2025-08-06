import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  updateInquirystatus,
  
} from "../Controllers/inquiries.js";

const router = express.Router();

router.post("/inquiry", createInquiry);
router.get("/inquiry", getAllInquiries);
router.get("/inquiry/:id", getInquiryById);
router.put("/inquiry/:id", updateInquiry);
router.delete("/inquiry/:id", deleteInquiry);
router.patch("/inquirystatus/:id", updateInquirystatus);


export default router;
