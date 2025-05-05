import mongoose from 'mongoose';
import { MongooseCache, ConnectionResult } from '@/lib/types';

// Cadena de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/tic-tac-toe';

// Variable para almacenar la conexión en desarrollo (para no reconectar en cada hot reload)
let cached: MongooseCache = {
  conn: null,
  promise: null
};

/**
 * Conecta a la base de datos MongoDB
 */
export async function connectToDatabase(): Promise<ConnectionResult> {
  // Si ya estamos conectados, devolver la conexión existente
  if (cached.conn) {
    return { success: true, message: 'Ya conectado a MongoDB' };
  }

  // Si hay una promesa de conexión en curso, esperar a que termine
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Crear una nueva promesa de conexión
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
        throw error;
      });
  }

  try {
    // Esperar a que la conexión se complete
    cached.conn = await cached.promise;
    return { success: true, message: 'Conectado a MongoDB exitosamente' };
  } catch (error) {
    return { 
      success: false, 
      message: `Error al conectar a MongoDB: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}