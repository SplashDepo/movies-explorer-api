import { Router } from 'express';
import { createMovieValidation, deleteMovieValidation } from '../utils/validation.js';
import { getSavedMovies, createMovie, deleteMovie } from '../controllers/movieController.js';

const router = Router();

router.get('/', getSavedMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:id', deleteMovieValidation, deleteMovie);

export default router;
