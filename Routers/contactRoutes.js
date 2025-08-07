import express from 'express';
import { submitContactForm, getContactForm ,deleteContactForm } from '../Controllers/contactController.js';

const router = express.Router();

router.post('/contact', submitContactForm);
router.get('/contact', getContactForm);
router.delete('/deleteContactForm/:id', deleteContactForm);





export default router;
