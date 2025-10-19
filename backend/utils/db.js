import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    console.warn('Warning: MONGO_URI is not set in environment variables.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000
  });
  console.log('✅ MongoDB connected:', mongoose.connection.name);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.connection.close(false);
  console.log('🛑 MongoDB connection closed');
}

