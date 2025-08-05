import express from 'express';
import { submitContactForm, getContactForm } from '../Controllers/contactController.js';

const router = express.Router();

router.post('/contact', submitContactForm);
router.get('/contact', getContactForm);


export default router;
