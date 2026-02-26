export type UserRole = 'admin' | 'organizer'
export type MessageChannel = 'signal' | 'sms'
export type SendStatus = 'pending' | 'sent' | 'failed'
export type BroadcastStatus = 'draft' | 'sending' | 'complete'

export interface User {
  id: string
  name: string
  username: string
  role: UserRole
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  hasSignal: boolean
  tags: string[]
  notes?: string
  createdAt: string
}

export interface Broadcast {
  id: string
  message: string
  imageUrl?: string
  recipientCount: number
  sentCount: number
  failedCount: number
  status: BroadcastStatus
  createdAt: string
  sentBy: string
}

export interface SendLog {
  id: string
  broadcastId: string
  contactId: string
  channel: MessageChannel
  status: SendStatus
  sentAt?: string
}

export interface Message {
  id: string
  contactId: string
  content: string
  direction: 'inbound' | 'outbound'
  channel: MessageChannel
  timestamp: string
  read: boolean
}

export interface COMSStore {
  currentUser: User | null
  contacts: Contact[]
  broadcasts: Broadcast[]
  sendLogs: SendLog[]
  messages: Message[]
  users: User[]
}

export type StoreAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACTS'; payload: string[] }
  | { type: 'ADD_BROADCAST'; payload: Broadcast }
  | { type: 'UPDATE_BROADCAST'; payload: Broadcast }
  | { type: 'ADD_SEND_LOGS'; payload: SendLog[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'MARK_READ'; payload: string } // contactId
  | { type: 'ADD_USER'; payload: User }
  | { type: 'REMOVE_USER'; payload: string } // userId
  | { type: 'UPDATE_USER'; payload: User }
