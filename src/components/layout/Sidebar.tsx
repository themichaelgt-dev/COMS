'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Mail, Inbox, History,
  Settings, LogOut, Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/context/StoreContext'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
  badge?: number
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { currentUser, logout } = useAuth()
  const { messages } = useStore()

  const unreadCount = messages.filter(m => m.direction === 'inbound' && !m.read).length

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/contacts', label: 'Contacts', icon: Users },
    { href: '/compose', label: 'Compose', icon: Mail },
    { href: '/inbox', label: 'Inbox', icon: Inbox, badge: unreadCount || undefined },
    { href: '/history', label: 'History', icon: History },
  ]

  return (
    <div className="flex h-full flex-col border-r-2 border-black bg-[oklch(0.975_0.002_60)]">
      {/* Logo */}
      <div className="border-b-2 border-black p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="COMS" className="w-full h-auto block" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-black transition-colors',
                isActive
                  ? 'bg-[oklch(0.55_0.24_27)] text-white'
                  : 'text-black hover:bg-black hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 border-2 min-w-[22px] text-center',
                  isActive ? 'bg-white text-black border-white' : 'bg-[oklch(0.55_0.24_27)] text-white border-[oklch(0.55_0.24_27)]'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t-2 border-black">
        {currentUser?.role === 'admin' && (
          <Link
            href="/settings"
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-black transition-colors',
              pathname === '/settings'
                ? 'bg-[oklch(0.55_0.24_27)] text-white'
                : 'text-black hover:bg-black hover:text-white'
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        )}

        {/* User row */}
        <div className="px-4 py-2 border-b-2 border-black bg-black text-white">
          <p className="text-xs font-bold uppercase tracking-wider truncate">{currentUser?.name}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider capitalize">{currentUser?.role}</p>
        </div>

        <button
          onClick={() => { onNavigate?.(); logout() }}
          className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest w-full text-left text-black hover:bg-black hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 h-screen sticky top-0 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[oklch(0.975_0.002_60)] border-b-2 border-black flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-3 border-r-2 border-black hover:bg-black hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-52 p-0 border-r-2 border-black">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex-1 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="COMS" className="h-8 w-auto" />
        </div>
      </div>
    </>
  )
}
