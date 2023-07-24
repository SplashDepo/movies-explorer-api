import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { getCurrentUserInfo, setCurrentUserInfo } from '../controllers/userController.js';

const router = Router();

router.get('/me', getCurrentUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/.+@.+\..+/),
    name: Joi.string().required().min(2).max(30),
  }),
}), setCurrentUserInfo);

export default router;
