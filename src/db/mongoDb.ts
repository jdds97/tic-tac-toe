import mongoose from 'mongoose';
import { MongooseCache } from '../lib/types';
import { MONGODB_URI } from '../lib/constants';

if (!MONGODB_URI) {
  throw new Error('Por favor, define la variable de entorno MONGODB_URI');
}

/**
 * Variable global para mantener la conexión durante las recargas en desarrollo.
 */

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose as MongooseCache;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      family: 4 
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('MongoDB conectado exitosamente');
        return mongoose;
      })
      .catch(err => {
        console.error('Error de conexión a MongoDB:', err);
        cached.promise = null;
        throw err;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}