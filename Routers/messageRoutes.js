import express from 'express';
import { sendMessage, getChatHistory } from '../Controllers/chatcontroller.js';

const router = express.Router();

// ✅ Send a message (Admin or Client)
router.post('/send', sendMessage);

// ✅ Get chat history between admin & a specific client
router.get('/history/:user1/:user2', getChatHistory);


export default router;
