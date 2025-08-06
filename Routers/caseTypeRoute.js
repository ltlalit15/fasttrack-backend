import express from 'express';
import {
  addCaseType,
  getAllCaseTypes,
  updateCaseType,
  deleteCaseType,
  getcasebyclientid
} from '../Controllers/caseType.js';

const router = express.Router();

router.post('/addCaseType', addCaseType);
router.get('/getAllCaseTypes', getAllCaseTypes);
router.get('/getcasebyclientid/:client_id', getcasebyclientid);

router.put('/updateCaseType:id', updateCaseType);
router.delete('/deleteCaseType/:id', deleteCaseType);

export default router;
