import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './services/db'
import webhookRouter from './routes/webhook'
import contactRouter from './routes/contact'

const app = express()
const PORT = process.env.PORT ?? 3001

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://*.vercel.app', /\.vercel\.app$/]
    : '*'
}))

// Raw body for webhook signature verification
app.use('/webhook', express.raw({ type: 'application/json' }))

// JSON body parser for all other routes
app.use(express.json())

// Routes
app.use('/webhook', webhookRouter)
app.use('/api', contactRouter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV })
})

async function main() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 HI Agent backend running on port ${PORT}`)
  })
}

main().catch(console.error)
