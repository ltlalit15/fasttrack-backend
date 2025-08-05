import express from "express";

import { signUp, login , getAllUsers, getUserById , logout,
forgotPassword,
resetPassword
} from "../Controllers/AuthCtrl.js"
import { authenticate } from "../Middlewares/AuthMiddleware.js";
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
// router.get('/users', authenticate, getAllUsers);
router.get('/users', getAllUsers);
router.get('/user/:id', getUserById);

router.post('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);







export default router;

// routes/auth.routes.js



