// routes/demoRoutes.js
import express from "express";
import { submitDemoRequest , getDemoRequest, deleteDemoRequest} from "../Controllers/demorequest.js";

const router = express.Router();

router.post("/bookdemo", submitDemoRequest);
router.get("/bookdemo", getDemoRequest);
router.delete("/bookdemo/:id", deleteDemoRequest);



export default router;
