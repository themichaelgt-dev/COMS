'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, ArrowLeft, Signal, MessageSquare } from 'lucide-react'
import { useStore, useDispatch } from '@/context/StoreContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatRelativeTime, generateId } from '@/lib/utils'
import type { Contact, Message } from '@/types'

function ConversationItem({ contact, lastMessage, unreadCount, isActive, onClick }: {
  contact: Contact
  lastMessage: Message | undefined
  unreadCount: number
  isActive: boolean
  onClick: () => void
}) {
  const initials = contact.name.split(' ').map(n => n[0]).slice(0, 2).join('')
  return (
    <button onClick={onClick}
      className={cn('w-full text-left px-4 py-3 flex items-start gap-3 border-b-2 border-black transition-colors last:border-b-0',
        isActive ? 'bg-[oklch(0.55_0.24_27)] text-white' : 'bg-white hover:bg-[oklch(0.975_0.002_60)]')}>
      <div className={cn('w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold border-2',
        isActive ? 'bg-white text-[oklch(0.55_0.24_27)] border-white' : 'bg-black text-white border-black')}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 min-w-0">
          <p className={cn('text-xs font-bold uppercase tracking-wider truncate flex-1 min-w-0', unreadCount > 0 && !isActive ? 'text-black' : '')}>
            {contact.name}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            {lastMessage && <span className={cn('text-xs font-mono hidden xs:block', isActive ? 'text-red-200' : 'text-gray-400')}>{formatRelativeTime(lastMessage.timestamp)}</span>}
            {unreadCount > 0 && (
              <span className={cn('text-xs font-bold px-1 py-0.5 border-2 min-w-[18px] text-center', isActive ? 'bg-white text-[oklch(0.55_0.24_27)] border-white' : 'bg-[oklch(0.55_0.24_27)] text-white border-[oklch(0.55_0.24_27)]')}>
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        {lastMessage && (
          <p className={cn('text-xs font-mono truncate mt-0.5', isActive ? 'text-red-100' : unreadCount > 0 ? 'text-black' : 'text-gray-400')}>
            {lastMessage.direction === 'outbound' && 'You: '}{lastMessage.content}
          </p>
        )}
      </div>
    </button>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isOutbound = msg.direction === 'outbound'
  return (
    <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[78%] border-2 px-3 py-2',
        isOutbound ? 'bg-[oklch(0.55_0.24_27)] text-white border-[oklch(0.55_0.24_27)]' : 'bg-white text-black border-black')}>
        <p className="text-sm font-mono leading-relaxed">{msg.content}</p>
        <div className={cn('flex items-center gap-2 mt-1', isOutbound ? 'justify-end text-red-200' : 'text-gray-400')}>
          <span className="text-xs font-mono">{formatRelativeTime(msg.timestamp)}</span>
          <span className={cn('text-xs font-bold uppercase px-1 border',
            isOutbound
              ? 'border-red-300 text-red-100'
              : msg.channel === 'signal' ? 'border-black text-black' : 'border-gray-400 text-gray-400')}>
            {msg.channel === 'signal' ? 'SIG' : 'SMS'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function InboxPage() {
  const { contacts, messages } = useStore()
  const dispatch = useDispatch()
  const [activeContactId, setActiveContactId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showMobileConversation, setShowMobileConversation] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const conversationContacts = useMemo(() => {
    const contactIds = new Set(messages.map(m => m.contactId))
    return contacts.filter(c => contactIds.has(c.id)).map(contact => {
      const msgs = messages.filter(m => m.contactId === contact.id)
      const lastMessage = msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      const unread = msgs.filter(m => m.direction === 'inbound' && !m.read).length
      return { contact, lastMessage, unread }
    }).sort((a, b) => {
      if (a.unread > 0 && b.unread === 0) return -1
      if (b.unread > 0 && a.unread === 0) return 1
      if (!a.lastMessage) return 1; if (!b.lastMessage) return -1
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    })
  }, [contacts, messages])

  const activeContact = contacts.find(c => c.id === activeContactId)
  const activeMessages = useMemo(() =>
    messages.filter(m => m.contactId === activeContactId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [messages, activeContactId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages.length, activeContactId])

  function openConversation(contactId: string) {
    setActiveContactId(contactId)
    setShowMobileConversation(true)
    dispatch({ type: 'MARK_READ', payload: contactId })
  }

  function handleSendReply() {
    if (!replyText.trim() || !activeContactId) return
    const contact = contacts.find(c => c.id === activeContactId)
    dispatch({
      type: 'ADD_MESSAGE',
      payload: { id: generateId(), contactId: activeContactId, content: replyText.trim(), direction: 'outbound', channel: contact?.hasSignal ? 'signal' : 'sms', timestamp: new Date().toISOString(), read: true },
    })
    setReplyText('')
  }

  const totalUnread = messages.filter(m => m.direction === 'inbound' && !m.read).length

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Mobile: back when in conversation */}
      {showMobileConversation && (
        <div className="md:hidden border-b-2 border-black bg-[oklch(0.975_0.002_60)] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowMobileConversation(false)}
            className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {activeContact && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{activeContact.name}</p>
              <p className="text-xs font-mono text-gray-500">{activeContact.phone}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)] md:h-screen">
        {/* Conversation list */}
        <div className={cn('w-full md:w-64 flex flex-col border-r-2 border-black',
          showMobileConversation ? 'hidden md:flex' : 'flex')}>
          <div className="px-4 py-3 border-b-2 border-black bg-black text-white">
            <p className="text-xs font-bold uppercase tracking-widest">
              Inbox {totalUnread > 0 && <span className="ml-2 bg-[oklch(0.55_0.24_27)] px-1.5 py-0.5">{totalUnread}</span>}
            </p>
          </div>
          <ScrollArea className="flex-1 bg-[oklch(0.975_0.002_60)]">
            {conversationContacts.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-gray-400 uppercase tracking-widest">No conversations</div>
            ) : (
              conversationContacts.map(({ contact, lastMessage, unread }) => (
                <ConversationItem key={contact.id} contact={contact} lastMessage={lastMessage}
                  unreadCount={unread} isActive={activeContactId === contact.id}
                  onClick={() => openConversation(contact.id)} />
              ))
            )}
          </ScrollArea>
        </div>

        {/* Conversation thread */}
        <div className={cn('flex-1 flex flex-col bg-[oklch(0.975_0.002_60)]',
          !showMobileConversation ? 'hidden md:flex' : 'flex')}>
          {activeContact ? (
            <>
              {/* Thread header */}
              <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-black text-white border-b-2 border-black">
                <div className="w-8 h-8 border-2 border-white bg-[oklch(0.55_0.24_27)] flex items-center justify-center text-xs font-bold text-white">
                  {activeContact.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest">{activeContact.name}</p>
                  <p className="text-xs font-mono text-gray-400">{activeContact.phone} · {activeContact.hasSignal ? 'Signal' : 'SMS only'}</p>
                </div>
                <span className={cn('text-xs font-bold uppercase px-2 py-1 border-2',
                  activeContact.hasSignal ? 'border-white text-white' : 'border-gray-600 text-gray-400')}>
                  {activeContact.hasSignal ? 'SIG' : 'SMS'}
                </span>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-5 py-4">
                <div className="space-y-3 max-w-2xl mx-auto">
                  {activeMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              {/* Reply input */}
              <div className="border-t-2 border-black bg-white px-3 sm:px-5 py-3 flex-shrink-0">
                <div className="max-w-2xl mx-auto flex gap-2 items-end">
                  <textarea
                    placeholder={`Reply to ${activeContact.name}...`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply() } }}
                    className="flex-1 border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none resize-none min-h-10 max-h-20"
                    rows={1}
                  />
                  <button onClick={handleSendReply} disabled={!replyText.trim()}
                    className="bg-[oklch(0.55_0.24_27)] text-white border-2 border-[oklch(0.55_0.24_27)] p-2 hover:bg-black hover:border-black transition-colors disabled:opacity-40 flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-mono text-gray-400 mt-1 max-w-2xl mx-auto hidden sm:block">
                  Enter to send · Shift+Enter new line · via {activeContact.hasSignal ? 'Signal' : 'SMS'}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center border-2 border-black p-8 bg-white">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Select a Conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
