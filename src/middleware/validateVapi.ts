import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export function validateVapiSignature(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.VAPI_WEBHOOK_SECRET
  if (!secret) {
    // In development without secret, skip validation
    if (process.env.NODE_ENV !== 'production') {
      next()
      return
    }
    res.status(500).json({ error: 'Webhook secret not configured' })
    return
  }

  const signature = req.headers['x-vapi-secret'] as string | undefined
  if (!signature) {
    res.status(401).json({ error: 'Missing webhook signature' })
    return
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body as Buffer)
    .digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    res.status(401).json({ error: 'Invalid webhook signature' })
    return
  }

  next()
}
