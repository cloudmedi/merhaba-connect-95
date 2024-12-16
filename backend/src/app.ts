import express from 'express';
import cors from 'cors';
import connectDB from './config/database';

// Routes
import adminAuthRoutes from './routes/admin/auth';
import adminUsersRoutes from './routes/admin/users';
import adminCategoriesRoutes from './routes/admin/categories';
import adminGenresRoutes from './routes/admin/genres';
import adminMoodsRoutes from './routes/admin/moods';
import adminSongsRoutes from './routes/admin/songs';
import adminPlaylistsRoutes from './routes/admin/playlists';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/genres', adminGenresRoutes);
app.use('/api/admin/moods', adminMoodsRoutes);
app.use('/api/admin/songs', adminSongsRoutes);
app.use('/api/admin/playlists', adminPlaylistsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;