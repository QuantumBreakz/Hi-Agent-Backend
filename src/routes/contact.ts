import { Router, Request, Response } from 'express'
import { ContactForm } from '../models/ContactForm'
import { sendContactNotificationEmail } from '../services/email'

const router = Router()

// POST /api/contact — contact form submission
router.post('/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, businessName, email, phone, message } = req.body

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' })
      return
    }

    await ContactForm.create({ name, businessName, email, phone, message })
    await sendContactNotificationEmail({ name, businessName, email, phone, message })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    res.status(500).json({ error: 'Failed to submit contact form' })
  }
})

export default router
