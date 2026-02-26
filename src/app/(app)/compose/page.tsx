'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Send, Image as ImageIcon, X, Signal, MessageSquare, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { useStore, useDispatch } from '@/context/StoreContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatEstimatedTime, generateId, ALL_TAGS } from '@/lib/utils'
import type { Contact, SendStatus } from '@/types'
import { simulateSend } from '@/lib/mock-send'

type Step = 'compose' | 'sending' | 'complete'

export default function ComposePage() {
  const { currentUser } = useAuth()
  const { contacts } = useStore()
  const dispatch = useDispatch()

  const [step, setStep] = useState<Step>('compose')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [allContacts, setAllContacts] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [manualSelected, setManualSelected] = useState<Set<string>>(new Set())
  const [contactSearch, setContactSearch] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [contactStates, setContactStates] = useState<Record<string, { status: 'pending' | SendStatus }>>({})
  const [sendProgress, setSendProgress] = useState(0)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const recipients: Contact[] = useMemo(() => {
    if (allContacts) return contacts
    if (selectedTags.length > 0) {
      const tagFiltered = contacts.filter(c => selectedTags.some(t => c.tags.includes(t)))
      const tagIds = new Set(tagFiltered.map(c => c.id))
      return [...tagFiltered, ...contacts.filter(c => manualSelected.has(c.id) && !tagIds.has(c.id))]
    }
    return contacts.filter(c => manualSelected.has(c.id))
  }, [contacts, allContacts, selectedTags, manualSelected])

  const signalCount = recipients.filter(c => c.hasSignal).length
  const smsCount = recipients.length - signalCount

  const filteredContacts = useMemo(() => {
    if (!contactSearch) return contacts
    const q = contactSearch.toLowerCase()
    return contacts.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
  }, [contacts, contactSearch])

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  async function handleConfirmSend() {
    setShowConfirm(false)
    setStep('sending')
    const states: Record<string, { status: 'pending' | SendStatus }> = {}
    recipients.forEach(c => { states[c.id] = { status: 'pending' } })
    setContactStates(states)
    setSendProgress(0)

    const broadcastId = generateId()
    const broadcast = {
      id: broadcastId, message, imageUrl: imagePreview ?? undefined,
      recipientCount: recipients.length, sentCount: 0, failedCount: 0,
      status: 'sending' as const, createdAt: new Date().toISOString(),
      sentBy: currentUser?.name ?? 'Unknown',
    }
    dispatch({ type: 'ADD_BROADCAST', payload: broadcast })

    let sent = 0, failed = 0
    const logs: import('@/types').SendLog[] = []

    const result = await simulateSend(recipients, ({ contactId, status }) => {
      if (status === 'sent') sent++; else failed++
      setContactStates(prev => ({ ...prev, [contactId]: { status } }))
      setSendProgress(Math.round(((sent + failed) / recipients.length) * 100))
      const contact = recipients.find(c => c.id === contactId)
      logs.push({ id: generateId(), broadcastId, contactId, channel: contact?.hasSignal ? 'signal' : 'sms', status, sentAt: status === 'sent' ? new Date().toISOString() : undefined })
    })

    dispatch({ type: 'ADD_SEND_LOGS', payload: logs })
    dispatch({ type: 'UPDATE_BROADCAST', payload: { ...broadcast, sentCount: result.sent, failedCount: result.failed, status: 'complete' } })
    setSendResult(result)
    setStep('complete')
    toast.success(`Broadcast complete — ${result.sent} sent, ${result.failed} failed`)
  }

  function handleNewBroadcast() {
    setStep('compose'); setMessage(''); removeImage()
    setAllContacts(true); setSelectedTags([]); setManualSelected(new Set())
    setContactStates({}); setSendProgress(0); setSendResult(null)
  }

  // SENDING / COMPLETE VIEW
  if (step === 'sending' || step === 'complete') {
    const totalDone = Object.values(contactStates).filter(s => s.status !== 'pending').length
    return (
      <PageWrapper title={step === 'sending' ? 'Sending...' : 'Complete'}>
        <div className="max-w-2xl space-y-4">
          {/* Status block */}
          <div className="border-2 border-black bg-white">
            <div className={cn('border-b-2 border-black px-4 py-3', step === 'complete' ? 'bg-black text-white' : 'bg-[oklch(0.55_0.24_27)] text-white')}>
              <p className="text-xs font-bold uppercase tracking-widest">
                {step === 'sending' ? `Transmitting — ${totalDone}/${recipients.length}` : `Broadcast Complete`}
              </p>
            </div>
            <div className="p-4">
              {step === 'sending' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[oklch(0.55_0.24_27)]" />
                    <span className="text-xs font-mono text-gray-600">Signal contacts first, then SMS (4s rate limit)</span>
                  </div>
                  <div className="border-2 border-black h-6 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-[oklch(0.55_0.24_27)] transition-all duration-300" style={{ width: `${sendProgress}%` }} />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{sendProgress}%</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-3xl font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>{sendResult?.sent}</p>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Delivered</p>
                  </div>
                  {(sendResult?.failed ?? 0) > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-[oklch(0.55_0.24_27)]" style={{ fontFamily: 'Georgia, serif' }}>{sendResult?.failed}</p>
                      <p className="text-xs uppercase tracking-widest text-gray-500">Failed</p>
                    </div>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <Link href="/history"
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors">
                      View History
                    </Link>
                    <button onClick={handleNewBroadcast}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[oklch(0.55_0.24_27)] text-white border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors">
                      New Broadcast
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact list */}
          <div className="border-2 border-black bg-white overflow-hidden">
            <div className="border-b-2 border-black px-4 py-2 bg-black text-white">
              <p className="text-xs font-bold uppercase tracking-widest">Recipients ({recipients.length})</p>
            </div>
            <ScrollArea className="h-72">
              <div>
                {recipients.map(contact => {
                  const state = contactStates[contact.id]
                  return (
                    <div key={contact.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 last:border-0 text-xs font-mono">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-black">{contact.name}</span>
                        <span className="text-gray-400 ml-2">{contact.phone}</span>
                      </div>
                      <span className={cn('uppercase font-bold text-xs px-1.5 py-0.5 border',
                        contact.hasSignal ? 'border-black bg-black text-white' : 'border-gray-400 text-gray-500')}>
                        {contact.hasSignal ? 'SIG' : 'SMS'}
                      </span>
                      <div className="w-4 flex-shrink-0">
                        {!state || state.status === 'pending' ? (
                          <div className="w-3 h-3 border-2 border-gray-300" />
                        ) : state.status === 'sent' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[oklch(0.55_0.24_27)]" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // COMPOSE VIEW
  return (
    <PageWrapper title="New Broadcast" description="Compose a message to your contacts">
      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-md w-full">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white">
              <p className="text-xs font-bold uppercase tracking-widest">Confirm Broadcast</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="border-2 border-black p-3 bg-[oklch(0.975_0.002_60)]">
                <p className="text-sm font-mono line-clamp-4">{message}</p>
              </div>
              <div className="grid grid-cols-3 gap-0 border-2 border-black text-center">
                <div className="border-r-2 border-black p-3">
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{signalCount}</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Signal</p>
                </div>
                <div className="border-r-2 border-black p-3">
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{smsCount}</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500">SMS</p>
                </div>
                <div className="p-3 bg-[oklch(0.55_0.24_27)] text-white">
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{recipients.length}</p>
                  <p className="text-xs uppercase tracking-widest opacity-80">Total</p>
                </div>
              </div>
              <p className="text-xs font-mono text-gray-500">Est. time: Signal ~instant · SMS {formatEstimatedTime(smsCount)}</p>
            </div>
            <div className="border-t-2 border-black flex">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border-r-2 border-black hover:bg-[oklch(0.975_0.002_60)] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmSend}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-[oklch(0.55_0.24_27)] text-white hover:bg-black transition-colors">
                Confirm Send →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Left: Message + Recipients */}
        <div className="lg:col-span-3 space-y-4">
          {/* Message */}
          <div className="border-2 border-black bg-white">
            <div className="border-b-2 border-black px-4 py-2 bg-black text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest">Message</span>
              <span className="text-xs font-mono text-gray-400">{message.length} chars</span>
            </div>
            <div className="p-4">
              <textarea
                placeholder="Write your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full min-h-36 text-sm font-mono bg-transparent focus:outline-none resize-none placeholder:text-gray-400"
              />
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-black font-mono uppercase tracking-wider">
                  <ImageIcon className="w-3 h-3" /> Attach image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>
              {imagePreview && (
                <div className="mt-3 relative inline-block border-2 border-black">
                  <img src={imagePreview} alt="Attachment" className="max-h-32 block" />
                  <button onClick={removeImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white flex items-center justify-center border border-white hover:bg-[oklch(0.55_0.24_27)] transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recipients */}
          <div className="border-2 border-black bg-white">
            <div className="border-b-2 border-black px-4 py-2 bg-black text-white">
              <span className="text-xs font-bold uppercase tracking-widest">Recipients</span>
            </div>
            <div className="p-4 space-y-4">
              {/* All contacts toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={allContacts}
                  onChange={e => { setAllContacts(e.target.checked); if (e.target.checked) { setSelectedTags([]); setManualSelected(new Set()) } }}
                  className="accent-[oklch(0.55_0.24_27)] w-4 h-4" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">All Contacts</p>
                  <p className="text-xs font-mono text-gray-500">{contacts.length} contacts</p>
                </div>
              </label>

              {!allContacts && (
                <>
                  {/* Tags */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2">Filter by Tag</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_TAGS.map(tag => (
                        <button key={tag} type="button"
                          onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                          className={cn('px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black transition-colors',
                            selectedTags.includes(tag) ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white')}>
                          {tag} ({contacts.filter(c => c.tags.includes(tag)).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2">Manual Selection</p>
                    <input placeholder="Search contacts..." value={contactSearch}
                      onChange={e => setContactSearch(e.target.value)}
                      className="w-full border-2 border-black px-3 py-1.5 text-xs font-mono mb-2 focus:outline-none" />
                    <div className="border-2 border-black overflow-hidden">
                      <ScrollArea className="h-48">
                        <div>
                          {filteredContacts.map(contact => {
                            const isTagSelected = selectedTags.some(t => contact.tags.includes(t))
                            return (
                              <label key={contact.id}
                                className={cn('flex items-center gap-3 px-3 py-2 border-b border-gray-200 last:border-0 cursor-pointer text-xs font-mono hover:bg-[oklch(0.975_0.002_60)] transition-colors',
                                  isTagSelected && 'bg-[oklch(0.975_0.002_60)]')}>
                                <input type="checkbox"
                                  checked={manualSelected.has(contact.id) || isTagSelected}
                                  disabled={isTagSelected}
                                  onChange={e => setManualSelected(prev => {
                                    const n = new Set(prev); e.target.checked ? n.add(contact.id) : n.delete(contact.id); return n
                                  })}
                                  className="accent-[oklch(0.55_0.24_27)]" />
                                <span className="flex-1 font-bold">{contact.name}</span>
                                <span className={cn('px-1 uppercase font-bold', contact.hasSignal ? 'text-black' : 'text-gray-400')}>
                                  {contact.hasSignal ? 'SIG' : 'SMS'}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview + Send */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preview */}
          <div className="border-2 border-black bg-white">
            <div className="border-b-2 border-black px-4 py-2 bg-black text-white">
              <span className="text-xs font-bold uppercase tracking-widest">Preview</span>
            </div>
            <div className="p-4 min-h-20">
              {message ? (
                <>
                  <p className="text-sm font-mono whitespace-pre-wrap text-black">{message}</p>
                  {imagePreview && <img src={imagePreview} alt="" className="mt-2 max-h-24 border-2 border-black" />}
                </>
              ) : (
                <p className="text-xs font-mono text-gray-400 italic">Message preview...</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="border-2 border-black">
            <div className="grid grid-cols-2 border-b-2 border-black">
              <div className="p-3 border-r-2 border-black bg-white">
                <div className="flex items-center gap-1 mb-1">
                  <Signal className="w-3 h-3" />
                  <span className="text-xs font-bold uppercase tracking-wider">Signal</span>
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{signalCount}</p>
                <p className="text-xs font-mono text-gray-400">~instant</p>
              </div>
              <div className="p-3 bg-white">
                <div className="flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs font-bold uppercase tracking-wider">SMS</span>
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{smsCount}</p>
                <p className="text-xs font-mono text-gray-400">{formatEstimatedTime(smsCount)}</p>
              </div>
            </div>
            <div className="bg-[oklch(0.55_0.24_27)] text-white p-3">
              <p className="text-xs uppercase tracking-widest font-bold">Total</p>
              <p className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{recipients.length}</p>
              <p className="text-xs font-mono opacity-70">recipients</p>
            </div>
          </div>

          {/* Send button */}
          <button
            disabled={!message.trim() || recipients.length === 0}
            onClick={() => setShowConfirm(true)}
            className="w-full bg-[oklch(0.55_0.24_27)] text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Review &amp; Send
          </button>
          {!message.trim() && <p className="text-xs font-mono text-gray-400 text-center">Write a message first</p>}
          {message.trim() && recipients.length === 0 && <p className="text-xs font-mono text-gray-400 text-center">Select at least one recipient</p>}
        </div>
      </div>
    </PageWrapper>
  )
}
