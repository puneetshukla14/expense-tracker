import mongoose from 'mongoose';

// 🔐 Replace YOUR_FULL_MONGODB_URI with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://puneetshukla044:NRIzCDa43PM4AAZt@cluster0.s7gqetk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is missing. Please check the hardcoded URI.');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
