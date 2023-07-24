import { Router } from 'express';
import { setCurrentUserInfoValidation } from '../utils/validation.js';
import { getCurrentUserInfo, setCurrentUserInfo } from '../controllers/userController.js';

const router = Router();

router.get('/me', getCurrentUserInfo);
router.patch('/me', setCurrentUserInfoValidation, setCurrentUserInfo);

export default router;
