'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, MessageCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/context/StoreContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { formatRelativeTime, formatDateTime } from '@/lib/utils'

function StatBlock({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`border-2 border-black p-4 ${accent ? 'bg-[oklch(0.55_0.24_27)] text-white' : 'bg-white'}`}>
      <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">{label}</p>
      <p className={`text-4xl font-bold ${accent ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Georgia, serif' }}>
        {value}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const { contacts, broadcasts, sendLogs, messages } = useStore()

  const today = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d
  }, [])

  const stats = useMemo(() => {
    const sentToday = sendLogs.filter(l => l.sentAt && new Date(l.sentAt) >= today).length
    const unread = messages.filter(m => m.direction === 'inbound' && !m.read).length
    const activeBroadcasts = broadcasts.filter(b => b.status === 'sending').length
    return { totalContacts: contacts.length, sentToday, unread, activeBroadcasts }
  }, [contacts, broadcasts, sendLogs, messages, today])

  const recentActivity = useMemo(() => {
    type Item =
      | { kind: 'send'; log: typeof sendLogs[0]; contact: typeof contacts[0] | undefined; broadcast: typeof broadcasts[0] | undefined; time: string }
      | { kind: 'message'; msg: typeof messages[0]; contact: typeof contacts[0] | undefined; time: string }

    const sends: Item[] = sendLogs.filter(l => l.sentAt).slice(-20).map(log => ({
      kind: 'send' as const, log,
      contact: contacts.find(c => c.id === log.contactId),
      broadcast: broadcasts.find(b => b.id === log.broadcastId),
      time: log.sentAt!,
    }))

    const msgs: Item[] = messages.filter(m => m.direction === 'inbound').map(msg => ({
      kind: 'message' as const, msg,
      contact: contacts.find(c => c.id === msg.contactId),
      time: msg.timestamp,
    }))

    return [...sends, ...msgs]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)
  }, [sendLogs, messages, contacts, broadcasts])

  const firstName = currentUser?.name.split(' ')[0] ?? 'Comrade'

  return (
    <PageWrapper
      title={`Good morning, Comrade ${firstName}`}
      description="System overview"
      actions={
        <Link
          href="/compose"
          className="bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors"
        >
          + New Broadcast
        </Link>
      }
    >
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-6 border-2 border-black">
        <div className="border-r-2 border-black last:border-r-0 md:[&:nth-child(2)]:border-r-2 md:[&:nth-child(3)]:border-r-2">
          <StatBlock label="Total Contacts" value={stats.totalContacts} />
        </div>
        <div className="border-r-0 md:border-r-2 border-black">
          <StatBlock label="Sent Today" value={stats.sentToday} />
        </div>
        <div className="border-t-2 md:border-t-0 border-r-2 border-black">
          <StatBlock label="Unread Replies" value={stats.unread} accent={stats.unread > 0} />
        </div>
        <div className="border-t-2 md:border-t-0 border-black">
          <StatBlock label="Active Sends" value={stats.activeBroadcasts} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="md:col-span-2 border-2 border-black bg-white">
          <div className="border-b-2 border-black px-4 py-3 flex items-center justify-between bg-black text-white">
            <span className="text-xs font-bold uppercase tracking-widest">Recent Activity</span>
            <Link href="/history" className="text-xs uppercase tracking-wider text-gray-400 hover:text-white flex items-center gap-1">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-gray-400 uppercase tracking-widest">
              No activity yet
            </div>
          ) : (
            <div>
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-200 last:border-0">
                  {item.kind === 'send' ? (
                    <>
                      <div className={`mt-0.5 flex-shrink-0 ${item.log.status === 'sent' ? 'text-green-600' : 'text-[oklch(0.55_0.24_27)]'}`}>
                        {item.log.status === 'sent' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black">
                          {item.contact?.name ?? 'Unknown'}
                          <span className="font-normal text-gray-500 ml-1">
                            {item.log.status === 'sent' ? 'received via' : 'failed via'} {item.log.channel.toUpperCase()}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.broadcast?.message.slice(0, 55)}...</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(item.time)}</span>
                    </>
                  ) : (
                    <>
                      <div className="mt-0.5 flex-shrink-0 text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black">
                          {item.contact?.name ?? 'Unknown'}
                          <span className="font-normal text-gray-500 ml-1">replied</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(item.time)}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="border-2 border-black bg-white">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white">
              <span className="text-xs font-bold uppercase tracking-widest">Quick Actions</span>
            </div>
            <div className="divide-y-2 divide-black">
              <Link href="/compose" className="flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[oklch(0.55_0.24_27)] hover:text-white transition-colors">
                + New Broadcast <ArrowRight className="w-3 h-3" />
              </Link>
              <Link href="/contacts" className="flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                + Add Contact <ArrowRight className="w-3 h-3" />
              </Link>
              <Link href="/inbox" className="flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                View Inbox
                {stats.unread > 0 && (
                  <span className="bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold px-1.5 py-0.5 ml-auto mr-2">
                    {stats.unread}
                  </span>
                )}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Recent broadcasts */}
          <div className="border-2 border-black bg-white">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest">Recent Broadcasts</span>
              <Link href="/history" className="text-xs text-gray-400 hover:text-white uppercase">All</Link>
            </div>
            <div>
              {broadcasts.slice(0, 3).map((b, i) => (
                <div key={b.id} className={`px-4 py-3 ${i < 2 ? 'border-b border-gray-200' : ''}`}>
                  <p className="text-xs text-black line-clamp-2 mb-1">{b.message.slice(0, 70)}...</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{formatDateTime(b.createdAt)}</span>
                    <span className="text-xs font-bold text-green-700">{b.sentCount}✓</span>
                    {b.failedCount > 0 && <span className="text-xs font-bold text-red-600">{b.failedCount}✗</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
