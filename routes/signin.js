import { Router } from 'express';
import { loginUserValidation } from '../utils/validation.js';
import { loginUser } from '../controllers/userController.js';

const router = Router();

router.post('/signin', loginUserValidation, loginUser);

export default router;
