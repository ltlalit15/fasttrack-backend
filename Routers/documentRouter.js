// routes/documents.js
import express from "express";

import { uploadClientDocument , ClientDocuments, deleteClientDocument} from "../Controllers/documentsController.js";

const router = express.Router();

// POST /api/documents/upload/:client_id
router.post("/upload/:client_id", uploadClientDocument);
router.get("/ClientDocuments/:client_id", ClientDocuments);
router.delete("/deleteClientDocument/:id", deleteClientDocument);







export default router;
