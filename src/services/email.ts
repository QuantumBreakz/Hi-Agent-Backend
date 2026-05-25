import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = process.env.NOTIFICATION_EMAIL ?? 'hassan@smartlogicsllc.com'

export interface CallSummaryPayload {
  callerPhone?: string
  durationSecs: number
  summary?: string
  transcript?: unknown
}

export interface ContactPayload {
  name: string
  businessName?: string
  email: string
  phone?: string
  message?: string
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${s}s`
}

export async function sendCallSummaryEmail(payload: CallSummaryPayload) {
  const { callerPhone = 'unknown', durationSecs, summary, transcript } = payload
  const transcriptText = Array.isArray(transcript)
    ? transcript.map((t: any) => `${t.role === 'assistant' ? '🤖 HI Agent' : '👤 Caller'}: ${t.content ?? t.text ?? ''}`).join('\n')
    : JSON.stringify(transcript ?? '', null, 2)

  await resend.emails.send({
    from: 'HI Agent <notifications@hiagent.ai>',
    to: TO,
    subject: `📞 New Call — ${callerPhone} (${formatDuration(durationSecs)})`,
    text: [
      `New inbound call completed.`,
      ``,
      `Caller: ${callerPhone}`,
      `Duration: ${formatDuration(durationSecs)}`,
      ``,
      `--- SUMMARY ---`,
      summary ?? 'No summary provided.',
      ``,
      `--- TRANSCRIPT ---`,
      transcriptText,
    ].join('\n'),
  })
}

export async function sendContactNotificationEmail(payload: ContactPayload) {
  const { name, businessName, email, phone, message } = payload
  await resend.emails.send({
    from: 'HI Agent <notifications@hiagent.ai>',
    to: TO,
    subject: `📋 New Contact Form — ${name} (${businessName ?? 'no business'})`,
    text: [
      `New contact form submission.`,
      ``,
      `Name: ${name}`,
      `Business: ${businessName ?? 'N/A'}`,
      `Email: ${email}`,
      `Phone: ${phone ?? 'N/A'}`,
      ``,
      `Message:`,
      message ?? '(none)',
    ].join('\n'),
  })
}
