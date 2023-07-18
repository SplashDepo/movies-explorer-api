import Movie from '../models/movie.js';
import { RESPONSE_MESSAGES } from '../utils/constants.js';

import ForbiddenError from '../utils/errors/ForbiddenError.js';
import NotFoundError from '../utils/errors/NotFoundError.js';
import InaccurateDataError from '../utils/errors/InaccurateDataError.js';

const { cast } = RESPONSE_MESSAGES[400].users;
const { validationSaving } = RESPONSE_MESSAGES[400].movies;
const { accessRightsDeletion } = RESPONSE_MESSAGES[403].movies;
const { userIdNotFound, dataNotFound } = RESPONSE_MESSAGES[404].movies;

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const { _id } = req.user;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: _id,
      movieId,
      nameRU,
      nameEN,
    })
    .then((movie) => {
      const { _id: dbMovieId } = movie;

      res.status(201).send({ message: dbMovieId });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError(validationSaving));
      } else {
        next(err);
      }
    });
};

const getSavedMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie
    .find({ owner: _id })
    .populate('owner', '_id')
    .then((movies) => {
      if (movies) return res.send(movies);

      throw new NotFoundError(userIdNotFound);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError(cast));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(dataNotFound);

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) {
        throw new ForbiddenError(accessRightsDeletion);
      }

      movie
        .deleteOne()
        .then(() => res.send({ message: null }))
        .catch(next);
    })
    .catch(next);
};

export { createMovie, getSavedMovies, deleteMovie };
