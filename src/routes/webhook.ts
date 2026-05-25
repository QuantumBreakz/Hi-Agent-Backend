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

    const call = body.message?.call ?? body.call ?? {}
    const callId = call.id ?? `unknown-${Date.now()}`
    
    const durationSecs = call.startedAt && call.endedAt
      ? Math.round((Date.parse(call.endedAt) - Date.parse(call.startedAt)) / 1000)
      : 0

    // 1. Upsert to MongoDB (handles 'status-update', 'end-of-call-report', etc.)
    await CallLog.findOneAndUpdate(
      { callId },
      {
        $set: {
          phone:        call.customer?.number ?? 'unknown',
          durationSecs,
          summary:      body.message?.summary ?? call.summary ?? '',
          transcript:   body.message?.transcript ?? call.transcript ?? [],
          endedAt:      call.endedAt ? new Date(call.endedAt) : undefined,
          status:       body.message?.type, // store latest event type
        }
      },
      { upsert: true, new: true }
    )

    // 2. Send notification email ONLY when the call is fully completed and summarized
    if (body.message?.type === 'end-of-call-report') {
      await sendCallSummaryEmail({
        callerPhone:  call.customer?.number,
        durationSecs,
        summary:      body.message?.summary ?? call.summary,
        transcript:   body.message?.transcript ?? call.transcript,
      })
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
