import express from 'express';
import { send_message, get_messages } from '../Controllers/messageController.js';

const router = express.Router();

// ✅ Send a message (Admin or Client)
router.post('/send', send_message);

// ✅ Get chat history between admin & a specific client
router.get('/history/:user1/:user2', get_messages);


export default router;
