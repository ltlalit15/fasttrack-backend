
import express from "express";
import { addCase, updateCaseStatus, getallcase, deletecase, getCaseById,updateCase, getCasesByClientId} from "../Controllers/cases.js";
const router = express.Router();



router.post('/cases', addCase);
router.put('/cases/:caseId', updateCaseStatus);
router.put('/updateCase/:id', updateCase);
router.get('/cases', getallcase);
router.delete('/cases/:id', deletecase);
router.get('/cases/:id', getCaseById);

router.get('/getCasesByClientId/:client_id', getCasesByClientId);

export default router;