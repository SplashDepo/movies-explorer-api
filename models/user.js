import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

import NotFoundError from '../utils/errors/NotFoundError.js';
import { RESPONSE_MESSAGES } from '../utils/constants.js';

const { emailRegistration } = RESPONSE_MESSAGES[404].users;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверно указана почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Имя не может быть короче 2 символов'],
    maxlength: [30, 'Имя не может быть длиннее 30 символов'],
  },
}, {
  statics: {
    findUserByCredentials(email, password) {
      return (
        this
          .findOne({ email })
          .select('+password')
      )
        .then((user) => {
          if (user) {
            return bcrypt.compare(password, user.password)
              .then((matched) => {
                if (matched) return user;

                return Promise.reject();
              });
          }

          throw new NotFoundError(emailRegistration);
        });
    },
  },
});

export default mongoose.model('User', userSchema);
