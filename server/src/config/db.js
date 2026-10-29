import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongod = null;

export const connectDB = async () => {
  let uri = config.mongodbUri;

  if (uri) {
    try {
      console.log(`[DB] Attempting connection to MongoDB: ${uri.split('@').pop()}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ [DB] Connected to MongoDB Atlas / Server successfully');
      return;
    } catch (err) {
      console.warn(`⚠️ [DB] Could not connect to configured MONGODB_URI: ${err.message}`);
      console.log('🔄 [DB] Falling back to embedded local MongoDB engine...');
    }
  }

  // Fallback to embedded real MongoDB engine (mongodb-memory-server)
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'chat_replyzer_ai',
      }
    });
    uri = mongod.getUri();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ [DB] Connected to Real Embedded MongoDB Engine at: ${uri}`);
  } catch (embeddedErr) {
    console.warn(`⚠️ [DB] Embedded MongoDB could not start (${embeddedErr.message}). Continuing in-memory mode for WhatsApp services.`);
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};
