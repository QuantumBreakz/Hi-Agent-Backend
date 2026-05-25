// For local testing — simulates a Vapi webhook payload
import { connectDB } from '../services/db'
import { CallLog } from '../models/CallLog'

async function seed() {
  await connectDB()
  await CallLog.create({
    callId: 'test-001',
    phone: '+15551234567',
    durationSecs: 120,
    summary: 'Caller wanted a plumbing quote.',
    transcript: [{ role: 'user', text: 'Hi' }],
    sentiment: 'interested',
    endedAt: new Date()
  })
  console.log('Seed done')
  process.exit(0)
}

seed()
