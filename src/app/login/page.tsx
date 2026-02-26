'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!username || !password) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 350))
    login(username, password)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[oklch(0.975_0.002_60)] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="w-full max-w-sm mb-0 border-2 border-black overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="COMS" className="w-full h-auto block" />
      </div>

      {/* Login form */}
      <div className="w-full max-w-sm border-2 border-black border-t-0 bg-white">
        <div className="border-b-2 border-black px-5 py-3 bg-black">
          <p className="text-xs font-bold uppercase tracking-widest text-white">— Organizer Access —</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:bg-[oklch(0.975_0.002_60)] placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:bg-[oklch(0.975_0.002_60)] placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[oklch(0.55_0.24_27)] text-white font-bold uppercase tracking-widest text-sm py-3 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        <div className="border-t-2 border-black px-5 py-3 bg-[oklch(0.93_0_0)]">
          <p className="text-xs font-mono text-gray-600">
            Welcome, Comrade. Any credentials will work.<br />
            Default: <span className="font-bold text-black">admin</span> / <span className="font-bold text-black">admin</span>
          </p>
        </div>
      </div>
    </div>
  )
}
