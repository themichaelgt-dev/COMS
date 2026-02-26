'use client'

import { useState, useMemo, useRef } from 'react'
import { Search, Upload, Download, Trash2, Signal, Filter, Users, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useStore, useDispatch } from '@/context/StoreContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { cn, formatDate, generateId, TAG_COLORS, ALL_TAGS } from '@/lib/utils'
import type { Contact } from '@/types'

function ContactForm({
  contact,
  onSave,
  onClose,
}: {
  contact?: Contact
  onSave: (data: Omit<Contact, 'id' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(contact?.name ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [email, setEmail] = useState(contact?.email ?? '')
  const [hasSignal, setHasSignal] = useState(contact?.hasSignal ?? false)
  const [tags, setTags] = useState<string[]>(contact?.tags ?? [])
  const [notes, setNotes] = useState(contact?.notes ?? '')

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    onSave({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined, hasSignal, tags, notes: notes.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required
          className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:bg-[oklch(0.975_0.002_60)]" />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Phone *</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="555-0100" required
          className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:bg-[oklch(0.975_0.002_60)]" />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email"
          className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:bg-[oklch(0.975_0.002_60)]" />
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setHasSignal(!hasSignal)}
          className={cn('w-10 h-5 border-2 border-black relative transition-colors flex-shrink-0', hasSignal ? 'bg-[oklch(0.55_0.24_27)]' : 'bg-white')}>
          <span className={cn('absolute top-0 bottom-0 w-4 transition-all border-r-2 border-black', hasSignal ? 'left-[calc(100%-1rem)] border-r-0 border-l-2' : 'left-0')} />
        </button>
        <label className="text-xs font-bold uppercase tracking-widest cursor-pointer" onClick={() => setHasSignal(!hasSignal)}>
          Has Signal
        </label>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map(tag => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={cn('px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black transition-colors',
                tags.includes(tag) ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white')}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Notes</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional..."
          className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none" />
      </div>
      <div className="flex gap-2 pt-2 border-t-2 border-black">
        <button type="submit"
          className="flex-1 bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest py-2.5 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors">
          {contact ? 'Save Changes' : 'Add Contact'}
        </button>
        <button type="button" onClick={onClose}
          className="px-4 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ContactsPage() {
  const { contacts } = useStore()
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showTagFilterMenu, setShowTagFilterMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const q = search.toLowerCase()
      const matchSearch = !search || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email?.toLowerCase().includes(q) ?? false)
      const matchTag = tagFilter === 'all' || c.tags.includes(tagFilter)
      return matchSearch && matchTag
    })
  }, [contacts, search, tagFilter])

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function toggleSelectAll() {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)))
  }

  function handleAddContact(data: Omit<Contact, 'id' | 'createdAt'>) {
    dispatch({ type: 'ADD_CONTACT', payload: { ...data, id: generateId(), createdAt: new Date().toISOString() } })
    setShowAddPanel(false)
    toast.success('Contact added')
  }

  function handleEditContact(data: Omit<Contact, 'id' | 'createdAt'>) {
    if (!editContact) return
    dispatch({ type: 'UPDATE_CONTACT', payload: { ...data, id: editContact.id, createdAt: editContact.createdAt } })
    setEditContact(null)
    toast.success('Contact updated')
  }

  function handleDeleteSelected() {
    dispatch({ type: 'DELETE_CONTACTS', payload: Array.from(selected) })
    setSelected(new Set())
    setShowDeleteConfirm(false)
    toast.success(`${selected.size} contact${selected.size > 1 ? 's' : ''} deleted`)
  }

  function handleExportCSV() {
    const rows = [
      ['Name', 'Phone', 'Email', 'Signal', 'Tags', 'Added'],
      ...contacts.map(c => [c.name, c.phone, c.email ?? '', c.hasSignal ? 'Yes' : 'No', c.tags.join(';'), formatDate(c.createdAt)]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'contacts.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Contacts exported')
  }

  function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.trim().split('\n')

      // Auto-detect header row and skip it
      const dataLines = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('phone')
        ? lines.slice(1)
        : lines

      let imported = 0
      for (const line of dataLines) {
        if (!line.trim()) continue

        // Handle both quoted and unquoted CSV
        const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim())
        const name = cols[0]
        const phone = cols[1]
        if (!name || !phone) continue

        dispatch({
          type: 'ADD_CONTACT',
          payload: {
            id: generateId(),
            name,
            phone,
            email: cols[2] || undefined,
            hasSignal: cols[3]?.toLowerCase() === 'yes' || cols[3]?.toLowerCase() === 'true',
            tags: cols[4] ? cols[4].split(';').map(t => t.trim()).filter(Boolean) : [],
            notes: cols[5] || undefined,
            createdAt: new Date().toISOString(),
          },
        })
        imported++
      }

      if (imported > 0) {
        toast.success(`Imported ${imported} contact${imported > 1 ? 's' : ''}`)
      } else {
        toast.error('No valid contacts found. Check CSV format: Name, Phone, Email, Signal (Yes/No), Tags')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const activePanel = showAddPanel ? 'add' : editContact ? 'edit' : null

  return (
    <PageWrapper
      title="Contacts"
      description={`${contacts.length} total`}
      actions={
        <button
          onClick={() => { setShowAddPanel(true); setEditContact(null) }}
          className="bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors"
        >
          + Add Contact
        </button>
      }
    >
      <div className={cn('flex gap-4', activePanel ? 'flex-col md:flex-row' : '')}>
        {/* Main table area */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="flex-1 flex border-2 border-black bg-white">
              <Search className="w-4 h-4 mx-3 self-center text-gray-400 flex-shrink-0" />
              <input
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 py-2 text-sm font-mono bg-transparent focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="px-3 hover:bg-gray-100">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Tag filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTagFilterMenu(!showTagFilterMenu)}
                className="flex items-center gap-2 border-2 border-black px-3 py-2 text-xs font-bold uppercase tracking-widest bg-white hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                <Filter className="w-3 h-3" />
                {tagFilter === 'all' ? 'All Tags' : tagFilter}
                <ChevronDown className="w-3 h-3 ml-auto" />
              </button>
              {showTagFilterMenu && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border-2 border-black border-t-0">
                  {['all', ...ALL_TAGS].map(tag => (
                    <button key={tag} onClick={() => { setTagFilter(tag); setShowTagFilterMenu(false) }}
                      className={cn('block w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider border-b border-gray-200 last:border-0 hover:bg-black hover:text-white transition-colors',
                        tagFilter === tag ? 'bg-black text-white' : '')}>
                      {tag === 'all' ? 'All Tags' : tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-0 border-2 border-black">
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border-r-2 border-black">
                <Upload className="w-3 h-3" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button onClick={handleExportCSV}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleImportCSV} />
          </div>

          {/* CSV format hint */}
          <p className="text-xs text-gray-400 font-mono mb-3">
            CSV format: Name, Phone, Email, Signal (Yes/No), Tags (semicolon-separated)
          </p>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="mb-2 flex items-center gap-3 border-2 border-[oklch(0.55_0.24_27)] bg-[oklch(0.975_0.002_60)] px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.55_0.24_27)]">{selected.size} selected</span>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase tracking-widest border-2 border-[oklch(0.55_0.24_27)] text-[oklch(0.55_0.24_27)] hover:bg-[oklch(0.55_0.24_27)] hover:text-white transition-colors">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
              <button onClick={() => setSelected(new Set())}
                className="ml-auto text-xs text-gray-500 font-mono hover:text-black">
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div className="border-2 border-black bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b-2 border-black bg-black text-white">
                    <th className="pl-4 py-2.5 w-8 text-left">
                      <input type="checkbox"
                        checked={selected.size > 0 && selected.size === filtered.length}
                        onChange={toggleSelectAll}
                        className="accent-[oklch(0.55_0.24_27)]" />
                    </th>
                    <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider hidden sm:table-cell">Phone</th>
                    <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider hidden lg:table-cell">Email</th>
                    <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider">Ch.</th>
                    <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider hidden md:table-cell">Tags</th>
                    <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider hidden lg:table-cell">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-xs uppercase tracking-widest">
                        <Users className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                        No contacts found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((contact) => (
                      <tr key={contact.id}
                        className={cn('border-b border-gray-200 last:border-0 cursor-pointer transition-colors',
                          selected.has(contact.id) ? 'bg-[oklch(0.975_0.002_60)]' : 'hover:bg-[oklch(0.975_0.002_60)]')}
                        onClick={() => { setEditContact(contact); setShowAddPanel(false) }}>
                        <td className="pl-4 py-2.5" onClick={e => { e.stopPropagation(); toggleSelect(contact.id) }}>
                          <input type="checkbox" checked={selected.has(contact.id)} onChange={() => toggleSelect(contact.id)}
                            className="accent-[oklch(0.55_0.24_27)]" />
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="font-bold text-black">{contact.name}</p>
                          <p className="text-gray-400 sm:hidden">{contact.phone}</p>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600 hidden sm:table-cell">{contact.phone}</td>
                        <td className="px-4 py-2.5 text-gray-500 hidden lg:table-cell">{contact.email ?? '—'}</td>
                        <td className="px-4 py-2.5">
                          {contact.hasSignal ? (
                            <span className="bg-black text-white px-1.5 py-0.5 text-xs font-bold uppercase">
                              <Signal className="w-2.5 h-2.5 inline mr-0.5" />SIG
                            </span>
                          ) : (
                            <span className="border border-gray-400 text-gray-500 px-1.5 py-0.5 text-xs font-bold uppercase">SMS</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="border border-black px-1.5 py-0.5 text-xs uppercase tracking-wider">
                                {tag.split('-').map(w => w[0]).join('')}
                              </span>
                            ))}
                            {contact.tags.length > 2 && (
                              <span className="border border-gray-300 text-gray-400 px-1.5 py-0.5 text-xs">+{contact.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-gray-400 hidden lg:table-cell">{formatDate(contact.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t-2 border-black bg-black text-white text-xs font-mono">
              {filtered.length} / {contacts.length} contacts
            </div>
          </div>
        </div>

        {/* Side panel — Add / Edit */}
        {activePanel && (
          <div className="w-full md:w-80 flex-shrink-0 border-2 border-black bg-white self-start">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest">
                {activePanel === 'add' ? 'Add Contact' : 'Edit Contact'}
              </span>
              <button onClick={() => { setShowAddPanel(false); setEditContact(null) }}
                className="hover:text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {activePanel === 'add' && (
              <ContactForm onSave={handleAddContact} onClose={() => setShowAddPanel(false)} />
            )}
            {activePanel === 'edit' && editContact && (
              <ContactForm contact={editContact} onSave={handleEditContact} onClose={() => setEditContact(null)} />
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white">
              <p className="text-xs font-bold uppercase tracking-widest">Confirm Delete</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-mono mb-4">Delete {selected.size} contact{selected.size > 1 ? 's' : ''}? This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={handleDeleteSelected}
                  className="flex-1 bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest py-2.5 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors">
                  Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
