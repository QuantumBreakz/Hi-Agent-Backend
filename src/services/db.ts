import mongoose from 'mongoose'

let connected = false

export async function connectDB() {
  if (connected) return
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — skipping DB connection (dev mode)')
    return
  }
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME ?? 'hi-agent',
  })
  connected = true
  console.log('✅ MongoDB connected')
}
