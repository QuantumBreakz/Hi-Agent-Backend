import { Router, Request, Response } from 'express'
import { validateVapiSignature } from '../middleware/validateVapi'
import { CallLog } from '../models/CallLog'
import { sendCallSummaryEmail } from '../services/email'

const router = Router()

// POST /webhook/vapi — called by Vapi after every call ends
router.post('/vapi', validateVapiSignature, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = JSON.parse(
      Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body)
    )

    // Vapi sends different event types — only process call-end
    if (body.message?.type !== 'end-of-call-report') {
      res.status(200).json({ received: true, skipped: true })
      return
    }

    const call = body.message.call ?? body.call ?? {}
    const durationSecs = call.startedAt && call.endedAt
      ? Math.round((Date.parse(call.endedAt) - Date.parse(call.startedAt)) / 1000)
      : 0

    // 1. Save to MongoDB
    await CallLog.create({
      callId:       call.id ?? `unknown-${Date.now()}`,
      phone:        call.customer?.number ?? 'unknown',
      durationSecs,
      summary:      body.message.summary ?? call.summary,
      transcript:   body.message.transcript ?? call.transcript,
      endedAt:      call.endedAt ? new Date(call.endedAt) : new Date(),
    })

    // 2. Send notification email
    await sendCallSummaryEmail({
      callerPhone:  call.customer?.number,
      durationSecs,
      summary:      body.message.summary ?? call.summary,
      transcript:   body.message.transcript ?? call.transcript,
    })

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
