'use client'

import { useState } from 'react'
import { Trash2, Crown, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { useStore, useDispatch } from '@/context/StoreContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { cn, formatDate, generateId } from '@/lib/utils'
import type { UserRole } from '@/types'

export default function SettingsPage() {
  const { currentUser } = useAuth()
  const { users } = useStore()
  const dispatch = useDispatch()

  const [showAddUser, setShowAddUser] = useState(false)
  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('organizer')
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  if (currentUser?.role !== 'admin') {
    return (
      <PageWrapper title="Settings">
        <div className="border-2 border-black bg-white p-8 max-w-sm">
          <div className="border-b-2 border-black pb-3 mb-3">
            <p className="text-xs font-bold uppercase tracking-widest">Access Denied</p>
          </div>
          <p className="text-xs font-mono text-gray-600">Only admins can access settings, Comrade.</p>
        </div>
      </PageWrapper>
    )
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newUsername.trim()) return
    dispatch({
      type: 'ADD_USER',
      payload: { id: generateId(), name: newName.trim(), username: newUsername.trim().toLowerCase(), role: newRole, createdAt: new Date().toISOString() },
    })
    setNewName(''); setNewUsername(''); setNewRole('organizer')
    setShowAddUser(false)
    toast.success('Comrade added')
  }

  function handleDeleteUser(userId: string) {
    dispatch({ type: 'REMOVE_USER', payload: userId })
    setDeleteUserId(null)
    toast.success('User removed')
  }

  function handleToggleRole(userId: string) {
    const user = users.find(u => u.id === userId); if (!user) return
    const role: UserRole = user.role === 'admin' ? 'organizer' : 'admin'
    dispatch({ type: 'UPDATE_USER', payload: { ...user, role } })
    toast.success(`${user.name} → ${role}`)
  }

  const userToDelete = users.find(u => u.id === deleteUserId)

  return (
    <PageWrapper title="Settings" description="Organizer account management"
      actions={
        <button onClick={() => setShowAddUser(true)}
          className="bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors">
          + Add User
        </button>
      }>
      <div className="max-w-xl space-y-4">
        {/* Users */}
        <div className="border-2 border-black bg-white overflow-hidden">
          <div className="border-b-2 border-black px-4 py-3 bg-black text-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest">Organizer Accounts</span>
            <span className="text-xs font-mono text-gray-400">{users.length} users</span>
          </div>
          <div>
            {users.map((user, i) => {
              const isMe = user.id === currentUser.id
              const isAdmin = user.role === 'admin'
              return (
                <div key={user.id} className={cn('flex items-center gap-4 px-4 py-3 border-b border-gray-200 last:border-0')}>
                  <div className={cn('w-8 h-8 flex items-center justify-center text-xs font-bold border-2 flex-shrink-0',
                    isAdmin ? 'bg-[oklch(0.55_0.24_27)] text-white border-[oklch(0.55_0.24_27)]' : 'bg-black text-white border-black')}>
                    {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider truncate">{user.name}</p>
                      {isMe && <span className="text-xs font-mono text-gray-400">(you)</span>}
                    </div>
                    <p className="text-xs font-mono text-gray-400">@{user.username} · {formatDate(user.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn('text-xs font-bold uppercase px-2 py-1 border-2',
                      isAdmin ? 'bg-[oklch(0.55_0.24_27)] text-white border-[oklch(0.55_0.24_27)]' : 'border-black text-black')}>
                      {isAdmin ? <><Crown className="w-2.5 h-2.5 inline mr-0.5" />Admin</> : <><User className="w-2.5 h-2.5 inline mr-0.5" />Organizer</>}
                    </span>
                    {!isMe && (
                      <>
                        <button onClick={() => handleToggleRole(user.id)}
                          className="text-xs font-bold uppercase tracking-wider border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors">
                          {isAdmin ? 'Demote' : 'Promote'}
                        </button>
                        <button onClick={() => setDeleteUserId(user.id)}
                          className="p-1.5 border-2 border-[oklch(0.55_0.24_27)] text-[oklch(0.55_0.24_27)] hover:bg-[oklch(0.55_0.24_27)] hover:text-white transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* POC notice */}
        <div className="border-2 border-black px-4 py-3 bg-[oklch(0.975_0.002_60)]">
          <p className="text-xs font-bold uppercase tracking-widest mb-1">POC Mode</p>
          <p className="text-xs font-mono text-gray-600">
            Changes only persist in this session and reset on page refresh. No real auth backend.
          </p>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest">Add Organizer</p>
              <button onClick={() => setShowAddUser(false)} className="hover:text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1">Full Name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Jordan Kim" required
                  className="w-full border-2 border-black px-3 py-2 text-sm font-mono focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1">Username *</label>
                <input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="e.g. jkim" required
                  className="w-full border-2 border-black px-3 py-2 text-sm font-mono focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1">Role</label>
                <div className="flex gap-0 border-2 border-black">
                  <button type="button" onClick={() => setNewRole('organizer')}
                    className={cn('flex-1 py-2 text-xs font-bold uppercase tracking-wider border-r-2 border-black transition-colors',
                      newRole === 'organizer' ? 'bg-black text-white' : 'hover:bg-black hover:text-white')}>
                    Organizer
                  </button>
                  <button type="button" onClick={() => setNewRole('admin')}
                    className={cn('flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors',
                      newRole === 'admin' ? 'bg-[oklch(0.55_0.24_27)] text-white' : 'hover:bg-black hover:text-white')}>
                    Admin
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t-2 border-black">
                <button type="submit"
                  className="flex-1 bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest py-2.5 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors">
                  Add Comrade
                </button>
                <button type="button" onClick={() => setShowAddUser(false)}
                  className="px-4 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full">
            <div className="border-b-2 border-black px-4 py-3 bg-black text-white">
              <p className="text-xs font-bold uppercase tracking-widest">Remove {userToDelete?.name}?</p>
            </div>
            <div className="p-4">
              <p className="text-xs font-mono text-gray-600 mb-4">This removes their access to the system.</p>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteUser(deleteUserId)}
                  className="flex-1 bg-[oklch(0.55_0.24_27)] text-white text-xs font-bold uppercase tracking-widest py-2.5 border-2 border-[oklch(0.55_0.24_27)] hover:bg-black hover:border-black transition-colors">
                  Remove
                </button>
                <button onClick={() => setDeleteUserId(null)}
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
