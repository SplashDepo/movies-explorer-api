import { Router } from 'express';
import { loginUser } from '../controllers/userController.js';

const router = Router();

router.post('/signin', loginUser);

export default router;
