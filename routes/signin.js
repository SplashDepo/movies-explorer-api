import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { PASSWORD_REGEX } from '../utils/constants.js';
import { loginUser } from '../controllers/userController.js';

const router = Router();

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
  }),
}), loginUser);

export default router;
