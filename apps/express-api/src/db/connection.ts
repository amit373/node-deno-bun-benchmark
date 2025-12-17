import mongoose from 'mongoose';
import { Config } from '@student-api/shared-config';
import { Logger } from '@student-api/shared-logger';

export class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      Logger.info('MongoDB already connected');
      return;
    }

    try {
      await mongoose.connect(Config.mongodbUri);
      this.isConnected = true;
      Logger.info('MongoDB connected successfully', {
        host: mongoose.connection.host,
        database: mongoose.connection.name,
      });

      mongoose.connection.on('error', (error) => {
        Logger.error('MongoDB connection error', { error });
      });

      mongoose.connection.on('disconnected', () => {
        Logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });
    } catch (error) {
      Logger.error('Failed to connect to MongoDB', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      Logger.info('MongoDB disconnected');
    } catch (error) {
      Logger.error('Error disconnecting from MongoDB', { error });
      throw error;
    }
  }

  getConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }
}
