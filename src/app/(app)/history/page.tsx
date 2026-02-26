'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Signal, MessageSquare } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatDateTime, formatDate } from '@/lib/utils'
import type { Broadcast } from '@/types'

function BroadcastCard({ broadcast }: { broadcast: Broadcast }) {
  const [expanded, setExpanded] = useState(false)
  const { contacts, sendLogs } = useStore()

  const logs = useMemo(() => sendLogs.filter(l => l.broadcastId === broadcast.id), [sendLogs, broadcast.id])
  const logsByContact = useMemo(() => logs.map(log => ({ log, contact: contacts.find(c => c.id === log.contactId) })), [logs, contacts])
  const successRate = broadcast.recipientCount > 0 ? Math.round((broadcast.sentCount / broadcast.recipientCount) * 100) : 0

  return (
    <div className="border-2 border-black bg-white">
      {/* Header */}
      <div className="border-b-2 border-black px-4 py-2 bg-black text-white flex items-center justify-between">
        <span className="text-xs font-bold font-mono">{formatDateTime(broadcast.createdAt)}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">by {broadcast.sentBy}</span>
          <span className="text-xs font-bold text-green-400">{broadcast.sentCount}✓</span>
          {broadcast.failedCount > 0 && <span className="text-xs font-bold text-[oklch(0.7_0.24_27)]">{broadcast.failedCount}✗</span>}
        </div>
      </div>

      {/* Message preview */}
      <div className="p-4">
        <p className="text-sm font-mono text-black line-clamp-3 leading-relaxed mb-3">{broadcast.message}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 border-2 border-black h-5 relative overflow-hidden">
            <div className={cn('absolute inset-y-0 left-0 transition-all', broadcast.failedCount > 0 ? 'bg-yellow-400' : 'bg-black')}
              style={{ width: `${successRate}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{successRate}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0">
            <span className="flex items-center gap-1">
              <Signal className="w-3 h-3" />{logs.filter(l => l.channel === 'signal').length}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />{logs.filter(l => l.channel === 'sms').length}
            </span>
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors">
          {expanded ? <><ChevronUp className="w-3 h-3" />Hide Recipients</> : <><ChevronDown className="w-3 h-3" />View Recipients ({logsByContact.length})</>}
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t-2 border-black">
          <div className="border-b-2 border-black px-4 py-2 bg-[oklch(0.975_0.002_60)]">
            <p className="text-xs font-bold uppercase tracking-widest">Full Message</p>
            <p className="text-xs font-mono mt-1 text-gray-700 leading-relaxed">{broadcast.message}</p>
          </div>
          <div className="border-b-2 border-black px-4 py-2 bg-black text-white">
            <p className="text-xs font-bold uppercase tracking-widest">Recipients ({logsByContact.length})</p>
          </div>
          <ScrollArea className="max-h-64">
            <div>
              {logsByContact.map(({ log, contact }) => (
                <div key={log.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 last:border-0 text-xs font-mono">
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-black">{contact?.name ?? 'Unknown'}</span>
                    <span className="text-gray-400 ml-2">{contact?.phone}</span>
                  </div>
                  <span className={cn('px-1.5 py-0.5 font-bold uppercase border',
                    log.channel === 'signal' ? 'border-black text-black' : 'border-gray-400 text-gray-500')}>
                    {log.channel === 'signal' ? 'SIG' : 'SMS'}
                  </span>
                  {log.status === 'sent'
                    ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    : <XCircle className="w-4 h-4 text-[oklch(0.55_0.24_27)] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const { broadcasts } = useStore()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() =>
    broadcasts.filter(b => {
      if (dateFrom && new Date(b.createdAt) < new Date(dateFrom)) return false
      if (dateTo && new Date(b.createdAt) > new Date(dateTo + 'T23:59:59')) return false
      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [broadcasts, dateFrom, dateTo])

  return (
    <PageWrapper title="Broadcast History" description={`${broadcasts.length} total broadcasts`}>
      {/* Date filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4 border-2 border-black bg-white p-3">
        <span className="text-xs font-bold uppercase tracking-widest flex-shrink-0">Filter:</span>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="border-2 border-black px-2 py-1 text-xs font-mono focus:outline-none min-w-0 flex-shrink-0" />
        <span className="text-xs font-mono text-gray-400 flex-shrink-0">→</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="border-2 border-black px-2 py-1 text-xs font-mono focus:outline-none min-w-0 flex-shrink-0" />
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo('') }}
            className="text-xs font-bold uppercase tracking-wider border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors flex-shrink-0">
            Clear
          </button>
        )}
        <span className="ml-auto text-xs font-mono text-gray-500 flex-shrink-0">{filtered.length} results</span>
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-black bg-white px-4 py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">No broadcasts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(broadcast => <BroadcastCard key={broadcast.id} broadcast={broadcast} />)}
        </div>
      )}
    </PageWrapper>
  )
}
