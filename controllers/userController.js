import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

import { RESPONSE_MESSAGES, PASSWORD_REGEX } from '../utils/constants.js';
import { NODE_ENV, SECRET_SIGNING_KEY } from '../utils/config.js';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';
import ConflictError from '../utils/errors/ConflictError.js';
import NotFoundError from '../utils/errors/NotFoundError.js';
import InaccurateDataError from '../utils/errors/InaccurateDataError.js';

const {
  cast,
  passwordRequirements,
  validationRegistration,
  validationUpdate,
} = RESPONSE_MESSAGES[400].users;

const { idNotFound } = RESPONSE_MESSAGES[404].users;
const { emailDuplication } = RESPONSE_MESSAGES[409].users;
const { unathorized } = RESPONSE_MESSAGES[401].users;

const { registrationSuccess } = RESPONSE_MESSAGES[201].users;

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!PASSWORD_REGEX.test(password)) {
    throw new InaccurateDataError(passwordRequirements);
  }

  User
    .findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'dev-secret',
          { expiresIn: '7d' },
        );

        return res.send({ token });
      }

      throw new UnauthorizedError(unathorized);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!PASSWORD_REGEX.test(password)) {
    throw new InaccurateDataError(passwordRequirements);
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(201).send({ message: registrationSuccess, email, password }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(emailDuplication));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError(validationRegistration));
      } else {
        next(err);
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError(idNotFound);
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError(cast));
      } else {
        next(err);
      }
    });
};

const setCurrentUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  const { _id } = req.user;

  User
    .findByIdAndUpdate(
      _id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      },
    ).then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError(idNotFound);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(emailDuplication));
      }

      if (err.name === 'CastError') {
        return next(new InaccurateDataError(cast));
      }

      if (err.name === 'ValidationError') {
        return next(new InaccurateDataError(validationUpdate));
      }

      return next(err);
    });
};

export {
  getCurrentUserInfo,
  setCurrentUserInfo,
  createUser,
  loginUser,
};
