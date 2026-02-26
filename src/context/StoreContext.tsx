'use client'

import React, { createContext, useContext, useReducer } from 'react'
import type { COMSStore, StoreAction } from '@/types'
import { seedContacts, seedBroadcasts, seedSendLogs, seedMessages, seedUsers } from '@/data/seed'

const initialState: COMSStore = {
  currentUser: null,
  contacts: seedContacts,
  broadcasts: seedBroadcasts,
  sendLogs: seedSendLogs,
  messages: seedMessages,
  users: seedUsers,
}

function storeReducer(state: COMSStore, action: StoreAction): COMSStore {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload }

    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] }

    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      }

    case 'DELETE_CONTACTS':
      return {
        ...state,
        contacts: state.contacts.filter(c => !action.payload.includes(c.id)),
      }

    case 'ADD_BROADCAST':
      return { ...state, broadcasts: [action.payload, ...state.broadcasts] }

    case 'UPDATE_BROADCAST':
      return {
        ...state,
        broadcasts: state.broadcasts.map(b =>
          b.id === action.payload.id ? action.payload : b
        ),
      }

    case 'ADD_SEND_LOGS':
      return { ...state, sendLogs: [...state.sendLogs, ...action.payload] }

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }

    case 'MARK_READ':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.contactId === action.payload ? { ...m, read: true } : m
        ),
      }

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] }

    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
      }

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u =>
          u.id === action.payload.id ? action.payload : u
        ),
      }

    default:
      return state
  }
}

const StoreContext = createContext<COMSStore | null>(null)
const DispatchContext = createContext<React.Dispatch<StoreAction> | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <StoreContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  )
}

export function useStore(): COMSStore {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function useDispatch(): React.Dispatch<StoreAction> {
  const ctx = useContext(DispatchContext)
  if (!ctx) throw new Error('useDispatch must be used within StoreProvider')
  return ctx
}
