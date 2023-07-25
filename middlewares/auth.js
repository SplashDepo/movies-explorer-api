import jwt from 'jsonwebtoken';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';
import { RESPONSE_MESSAGES } from '../utils/constants.js';
import { NODE_ENV, SECRET_SIGNING_KEY } from '../utils/config.js';

const { unathorized } = RESPONSE_MESSAGES[401].users;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError(unathorized));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError(unathorized));
  }

  req.user = payload;

  return next();
};

export default auth;
