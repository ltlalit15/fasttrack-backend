import { Router } from "express";
import UserRoutes from "./Routers/AuthRoute.js";

import inquiryRoutes from "./Routers/inquiriesRoute.js";

import clientRoute from "./Routers/clientRoute.js"

import  admindashbaordRoute  from "./Routers/admindashbaordRoute.js";
import fileUpload from 'express-fileupload';


import feedbackRoute from "./Routers/feedbackRoute.js";
import demoRoutes from "./Routers/demoRoutes.js";
import cases from "./Routers/casesRoute.js";

import documentRouter  from "./Routers/documentRouter.js"; // Adjust the import path as needed

import contactRoutes from "./Routers/contactRoutes.js"; // Adjust the import path as needed

import appointmentRoutes from "./Routers/appointmentRoutes.js"; // Adjust the import path as needed

import caseTypeRoute from "./Routers/caseTypeRoute.js"; // Adjust the import path as needed

import staffSolicitorRoutes from "./Routers/staffSolicitorRoutes.js";



const router = Router();

router.use("/api/f1", UserRoutes);

router.use("/api/f1", inquiryRoutes);

router.use("/api/f1", clientRoute);

router.use("/api/f1", admindashbaordRoute);


router.use("/api/f1", feedbackRoute);

router.use("/api/f1", demoRoutes);

router.use("/api/f1", cases);

router.use("/api/f1", documentRouter);
router.use("/api/f1", contactRoutes);
router.use("/api/f1", appointmentRoutes);

router.use('/api/f1', caseTypeRoute);

router.use('/api/f1', staffSolicitorRoutes);



export default router;
