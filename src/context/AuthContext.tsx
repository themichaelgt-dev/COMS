'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { seedUsers } from '@/data/seed'

interface AuthContextValue {
  currentUser: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  const login = useCallback((username: string, _password: string): boolean => {
    // Any credentials work — find matching user or default to admin
    const user = seedUsers.find(u => u.username === username) ?? seedUsers[0]
    setCurrentUser(user)
    return true
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
