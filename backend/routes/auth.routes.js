import { Router } from 'express';
import { signup, signin, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;


