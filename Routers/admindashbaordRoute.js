
import express from "express";
import { Admindashboard } from "../Controllers/admindashbaordRoute.js";

const router = express.Router();
router.get('/Admindashboard', Admindashboard);

export default router;
