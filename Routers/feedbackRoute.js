
import express from "express";
import { submitFeedback, getFeedback } from "../Controllers/feedback.js";

const router = express.Router();
router.post("/feedback", submitFeedback);
router.get("/feedback", getFeedback);

export default router;