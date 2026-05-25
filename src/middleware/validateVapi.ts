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

  const providedSecret = req.headers['x-vapi-secret'] as string | undefined
  if (!providedSecret) {
    res.status(401).json({ error: 'Missing webhook signature' })
    return
  }

  if (providedSecret !== secret) {
    res.status(401).json({ error: 'Invalid webhook signature' })
    return
  }

  next()
}
