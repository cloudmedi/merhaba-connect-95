import express from 'express';
import { 
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlist.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPlaylists)
  .post(createPlaylist);

router.route('/:id')
  .get(getPlaylistById)
  .put(updatePlaylist)
  .delete(deletePlaylist);

router.route('/:id/songs')
  .post(addSongToPlaylist)
  .delete(removeSongFromPlaylist);

export default router;