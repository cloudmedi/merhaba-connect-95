import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/database';
import { initializeWebSocket } from './config/websocket';
import { logger, stream } from './utils/logger';
import { requestLogger, responseLogger } from './middleware/logger';
import morgan from 'morgan';
import { validateBunnyCredentials } from './utils/bunnyValidator';

// Routes
import authRoutes from './routes/auth.routes';
import adminAuthRoutes from './routes/admin/auth';
import adminUsersRoutes from './routes/admin/users';
import adminCategoriesRoutes from './routes/admin/categories';
import adminGenresRoutes from './routes/admin/genres';
import adminMoodsRoutes from './routes/admin/moods';
import adminSongsRoutes from './routes/admin/songs';
import adminPlaylistsRoutes from './routes/admin/playlists';
import adminMetricsRoutes from './routes/admin/metrics';

const app = express();
const httpServer = createServer(app);

// Initialize WebSocket
const io = initializeWebSocket(httpServer);

// Make io available in request object
declare global {
  namespace Express {
    interface Request {
      io?: any;
    }
  }
}

// Middleware to attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to MongoDB and validate Bunny CDN credentials
const initializeApp = async () => {
  try {
    await connectDB();
    logger.info('MongoDB connected successfully');

    const isBunnyValid = await validateBunnyCredentials();
    if (!isBunnyValid) {
      logger.error('⚠️ WARNING: Bunny CDN credentials validation failed. File uploads may not work correctly.');
    }
  } catch (error) {
    logger.error('Failed to initialize app:', error);
  }
};

initializeApp();

app.use(morgan('combined', { stream }));

// Logger middleware - MUST be before routes
app.use(requestLogger);
app.use(responseLogger);

// CORS configuration - Güncellendi
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4173', 'http://localhost:4174', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Expires',
    'cache-control',
    'x-requested-with'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/genres', adminGenresRoutes);
app.use('/api/admin/moods', adminMoodsRoutes);
app.use('/api/admin/songs', adminSongsRoutes);
app.use('/api/admin/playlists', adminPlaylistsRoutes);
app.use('/api/admin/metrics', adminMetricsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Application error:', {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

export default app;
