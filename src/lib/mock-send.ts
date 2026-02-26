import type { Contact, SendStatus } from '@/types'

export interface SendProgressUpdate {
  contactId: string
  status: SendStatus
}

export interface SendResult {
  sent: number
  failed: number
}

export async function simulateSend(
  recipients: Contact[],
  onProgress: (update: SendProgressUpdate) => void
): Promise<SendResult> {
  let sent = 0
  let failed = 0

  // Signal contacts first (fast), then SMS
  const signalContacts = recipients.filter(c => c.hasSignal)
  const smsContacts = recipients.filter(c => !c.hasSignal)

  // Process Signal contacts with short delays
  for (const contact of signalContacts) {
    await delay(150 + Math.random() * 150)
    const status: SendStatus = Math.random() < 0.05 ? 'failed' : 'sent'
    if (status === 'sent') sent++
    else failed++
    onProgress({ contactId: contact.id, status })
  }

  // Process SMS contacts with 4-second delays
  for (const contact of smsContacts) {
    await delay(3800 + Math.random() * 400)
    const status: SendStatus = Math.random() < 0.05 ? 'failed' : 'sent'
    if (status === 'sent') sent++
    else failed++
    onProgress({ contactId: contact.id, status })
  }

  return { sent, failed }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
