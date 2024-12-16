import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/musicapp';
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB bağlantısı başarılı');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB bağlantı hatası:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB bağlantısı kesildi');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB bağlantısı kapatıldı - Uygulama sonlandırılıyor');
      process.exit(0);
    });

    const conn = await mongoose.connect(mongoUri, options);
    logger.info(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

export default connectDB;