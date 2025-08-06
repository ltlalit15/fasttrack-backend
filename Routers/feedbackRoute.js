
import express from "express";
import { submitFeedback, getFeedback , deletefeedback} from "../Controllers/feedback.js";

const router = express.Router();
router.post("/feedback", submitFeedback);
router.get("/feedback", getFeedback);
router.delete("/deletefeedback/:id", deletefeedback);
export default router;
