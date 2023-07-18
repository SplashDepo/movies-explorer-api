import { Router } from 'express';
import { getCurrentUserInfo, setCurrentUserInfo } from '../controllers/userController.js';

const router = Router();

router.get('/me', getCurrentUserInfo);
router.patch('/me', setCurrentUserInfo);

export default router;
