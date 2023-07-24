import { Router } from 'express';

import routeSignup from './signup.js';
import routeSignin from './signin.js';

import auth from '../middlewares/auth.js';

import routeUsers from './users.js';
import routeMovies from './movies.js';

import NotFoundError from '../utils/errors/NotFoundError.js';

const router = Router();

router.use('/', routeSignup);
router.use('/', routeSignin);

router.use(auth);

router.use('/users', routeUsers);
router.use('/movies', routeMovies);

router.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

export default router;
