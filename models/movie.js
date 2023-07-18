import mongoose from 'mongoose';
// import validator from 'validator';
import { URL_REGEX } from '../utils/constants.js';

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется URL',
      },
    },

    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется URL',
      },
    },

    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется URL',
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    movieId: {
      type: Number,
      required: true,
    },

    nameRU: {
      type: String,
      required: true,
    },

    nameEN: {
      type: String,
      required: true,
    },
  },
);

export default mongoose.model('Movie', movieSchema);
