import { MongoClient, Db } from 'mongodb';
import { Config } from '@student-api/shared-config';
import { Logger } from '@student-api/shared-logger';

export class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<Db> {
    if (this.db) {
      Logger.info('MongoDB already connected');
      return this.db;
    }

    try {
      this.client = new MongoClient(Config.mongodbUri);
      await this.client.connect();
      this.db = this.client.db();

      Logger.info('MongoDB connected successfully', {
        database: this.db.databaseName,
      });

      return this.db;
    } catch (error) {
      Logger.error('Failed to connect to MongoDB', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      Logger.info('MongoDB disconnected');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }
}
