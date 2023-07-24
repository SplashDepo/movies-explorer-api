import { Router } from 'express';
import { registerUserValidation } from '../utils/validation.js';
import { createUser } from '../controllers/userController.js';

const router = Router();

router.post('/signup', registerUserValidation, createUser);

export default router;
