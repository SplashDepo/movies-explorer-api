import { Router } from 'express';
import { getSavedMovies, createMovie, deleteMovie } from '../controllers/movieController.js';

const router = Router();

router.get('/', getSavedMovies);
router.post('/', createMovie);
router.delete('/:id', deleteMovie);

export default router;
