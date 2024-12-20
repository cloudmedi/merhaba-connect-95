import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import deviceRoutes from './routes/manager/devices';
import tokenRoutes from './routes/manager/tokens';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/manager/devices', deviceRoutes);
app.use('/api/manager/tokens', tokenRoutes);

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;