import express from 'express';
import {
  uploadSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong
} from '../controllers/song.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSongs)
  .post(uploadSong);

router.route('/:id')
  .get(getSongById)
  .put(updateSong)
  .delete(deleteSong);

export default router;