import type { User, Contact, Broadcast, SendLog, Message } from '@/types'

export const seedUsers: User[] = [
  { id: 'u1', name: 'Lorem Ipsum', username: 'admin', role: 'admin', createdAt: '2024-09-01T00:00:00Z' },
  { id: 'u2', name: 'Dolor Sit', username: 'dsit', role: 'organizer', createdAt: '2024-09-15T00:00:00Z' },
  { id: 'u3', name: 'Amet Consectetur', username: 'aconsectetur', role: 'organizer', createdAt: '2024-10-01T00:00:00Z' },
  { id: 'u4', name: 'Adipiscing Elit', username: 'aelit', role: 'organizer', createdAt: '2024-10-20T00:00:00Z' },
]

export const seedContacts: Contact[] = [
  { id: 'c1', name: 'Lorem Ipsum', phone: '555-0101', email: 'lorem@example.com', hasSignal: true, tags: ['mobile-branch', 'canvassers'], createdAt: '2024-09-05T00:00:00Z' },
  { id: 'c2', name: 'Dolor Sit', phone: '555-0102', email: 'dolor@example.com', hasSignal: false, tags: ['new-members'], createdAt: '2024-09-06T00:00:00Z' },
  { id: 'c3', name: 'Amet Consectetur', phone: '555-0103', email: 'amet@example.com', hasSignal: true, tags: ['event-attendees', 'new-members'], createdAt: '2024-09-08T00:00:00Z' },
  { id: 'c4', name: 'Adipiscing Elit', phone: '555-0104', hasSignal: false, tags: ['canvassers'], createdAt: '2024-09-10T00:00:00Z' },
  { id: 'c5', name: 'Sed Do Eiusmod', phone: '555-0105', email: 'sed@example.com', hasSignal: true, tags: ['mobile-branch'], createdAt: '2024-09-12T00:00:00Z' },
  { id: 'c6', name: 'Tempor Incididunt', phone: '555-0106', hasSignal: false, tags: ['event-attendees'], createdAt: '2024-09-14T00:00:00Z' },
  { id: 'c7', name: 'Ut Labore', phone: '555-0107', email: 'utlabore@example.com', hasSignal: true, tags: ['mobile-branch', 'canvassers'], createdAt: '2024-09-16T00:00:00Z' },
  { id: 'c8', name: 'Dolore Magna', phone: '555-0108', hasSignal: false, tags: ['new-members'], createdAt: '2024-09-18T00:00:00Z' },
  { id: 'c9', name: 'Aliqua Enim', phone: '555-0109', email: 'aliqua@example.com', hasSignal: true, tags: ['event-attendees', 'canvassers'], createdAt: '2024-09-20T00:00:00Z' },
  { id: 'c10', name: 'Quis Nostrud', phone: '555-0110', hasSignal: false, tags: ['mobile-branch'], createdAt: '2024-09-22T00:00:00Z' },
  { id: 'c11', name: 'Exercitation Ullamco', phone: '555-0111', email: 'exercitation@example.com', hasSignal: true, tags: ['new-members'], createdAt: '2024-09-24T00:00:00Z' },
  { id: 'c12', name: 'Laboris Nisi', phone: '555-0112', hasSignal: false, tags: ['canvassers', 'event-attendees'], createdAt: '2024-09-26T00:00:00Z' },
  { id: 'c13', name: 'Aliquip Ex Ea', phone: '555-0113', email: 'aliquip@example.com', hasSignal: true, tags: ['mobile-branch', 'new-members'], createdAt: '2024-09-28T00:00:00Z' },
  { id: 'c14', name: 'Commodo Consequat', phone: '555-0114', hasSignal: false, tags: ['event-attendees'], createdAt: '2024-10-01T00:00:00Z' },
  { id: 'c15', name: 'Duis Aute Irure', phone: '555-0115', email: 'duis@example.com', hasSignal: true, tags: ['canvassers'], createdAt: '2024-10-03T00:00:00Z' },
  { id: 'c16', name: 'Dolor In Reprehenderit', phone: '555-0116', hasSignal: false, tags: ['new-members', 'mobile-branch'], createdAt: '2024-10-05T00:00:00Z' },
  { id: 'c17', name: 'Voluptate Velit', phone: '555-0117', email: 'voluptate@example.com', hasSignal: true, tags: ['event-attendees', 'mobile-branch'], createdAt: '2024-10-07T00:00:00Z' },
  { id: 'c18', name: 'Esse Cillum', phone: '555-0118', hasSignal: false, tags: ['canvassers'], createdAt: '2024-10-09T00:00:00Z' },
  { id: 'c19', name: 'Fugiat Nulla', phone: '555-0119', email: 'fugiat@example.com', hasSignal: true, tags: ['new-members'], createdAt: '2024-10-11T00:00:00Z' },
  { id: 'c20', name: 'Pariatur Excepteur', phone: '555-0120', hasSignal: false, tags: ['mobile-branch', 'canvassers'], createdAt: '2024-10-13T00:00:00Z' },
  { id: 'c21', name: 'Sint Occaecat', phone: '555-0121', email: 'sint@example.com', hasSignal: true, tags: ['event-attendees'], createdAt: '2024-10-15T00:00:00Z' },
  { id: 'c22', name: 'Cupidatat Non', phone: '555-0122', hasSignal: false, tags: ['new-members', 'canvassers'], createdAt: '2024-10-17T00:00:00Z' },
  { id: 'c23', name: 'Proident Sunt', phone: '555-0123', email: 'proident@example.com', hasSignal: true, tags: ['mobile-branch'], createdAt: '2024-10-19T00:00:00Z' },
  { id: 'c24', name: 'Culpa Qui Officia', phone: '555-0124', hasSignal: false, tags: ['event-attendees', 'new-members'], createdAt: '2024-10-21T00:00:00Z' },
  { id: 'c25', name: 'Deserunt Mollit', phone: '555-0125', email: 'deserunt@example.com', hasSignal: true, tags: ['canvassers', 'mobile-branch'], createdAt: '2024-10-23T00:00:00Z' },
  { id: 'c26', name: 'Anim Id Est', phone: '555-0126', hasSignal: false, tags: ['mobile-branch'], createdAt: '2024-10-25T00:00:00Z' },
  { id: 'c27', name: 'Laborum Perspiciatis', phone: '555-0127', email: 'laborum@example.com', hasSignal: true, tags: ['new-members', 'event-attendees'], createdAt: '2024-10-27T00:00:00Z' },
  { id: 'c28', name: 'Unde Omnis Iste', phone: '555-0128', hasSignal: false, tags: ['canvassers'], createdAt: '2024-10-29T00:00:00Z' },
]

export const seedBroadcasts: Broadcast[] = [
  {
    id: 'b1',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    recipientCount: 28, sentCount: 27, failedCount: 1,
    status: 'complete', createdAt: '2024-11-02T19:00:00Z', sentBy: 'Lorem Ipsum',
  },
  {
    id: 'b2',
    message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    recipientCount: 25, sentCount: 24, failedCount: 1,
    status: 'complete', createdAt: '2024-11-15T18:00:00Z', sentBy: 'Dolor Sit',
  },
  {
    id: 'b3',
    message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    recipientCount: 15, sentCount: 15, failedCount: 0,
    status: 'complete', createdAt: '2024-11-22T10:00:00Z', sentBy: 'Lorem Ipsum',
  },
  {
    id: 'b4',
    message: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    recipientCount: 28, sentCount: 26, failedCount: 2,
    status: 'complete', createdAt: '2024-12-10T12:00:00Z', sentBy: 'Amet Consectetur',
  },
  {
    id: 'b5',
    message: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    recipientCount: 28, sentCount: 27, failedCount: 1,
    status: 'complete', createdAt: '2025-01-03T09:00:00Z', sentBy: 'Lorem Ipsum',
  },
  {
    id: 'b6',
    message: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    recipientCount: 28, sentCount: 26, failedCount: 2,
    status: 'complete', createdAt: '2025-02-07T16:00:00Z', sentBy: 'Adipiscing Elit',
  },
]

export const seedSendLogs: SendLog[] = generateSendLogs()

function generateSendLogs(): SendLog[] {
  const logs: SendLog[] = []
  let logId = 1

  seedBroadcasts.forEach((broadcast) => {
    const recipientIds = seedContacts.slice(0, broadcast.recipientCount).map(c => c.id)
    let failed = 0

    recipientIds.forEach((contactId) => {
      const contact = seedContacts.find(c => c.id === contactId)!
      const shouldFail = failed < broadcast.failedCount && Math.random() < 0.15
      const status: SendLog['status'] = shouldFail ? 'failed' : 'sent'
      if (shouldFail) failed++

      logs.push({
        id: `sl${logId++}`,
        broadcastId: broadcast.id,
        contactId,
        channel: contact.hasSignal ? 'signal' : 'sms',
        status,
        sentAt: status === 'sent' ? broadcast.createdAt : undefined,
      })
    })
  })

  return logs
}

export const seedMessages: Message[] = [
  // Conversation with Lorem Ipsum (c1)
  { id: 'm1', contactId: 'c1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-07T15:30:00Z', read: true },
  { id: 'm2', contactId: 'c1', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', direction: 'outbound', channel: 'signal', timestamp: '2025-02-07T15:45:00Z', read: true },
  { id: 'm3', contactId: 'c1', content: 'Ut enim ad minim veniam, quis nostrud exercitation?', direction: 'inbound', channel: 'signal', timestamp: '2025-02-07T16:00:00Z', read: false },

  // Conversation with Amet Consectetur (c3)
  { id: 'm4', contactId: 'c3', content: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-06T11:00:00Z', read: true },
  { id: 'm5', contactId: 'c3', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.', direction: 'outbound', channel: 'signal', timestamp: '2025-02-06T11:15:00Z', read: true },
  { id: 'm6', contactId: 'c3', content: 'Dolore eu fugiat nulla pariatur. Excepteur sint occaecat?', direction: 'inbound', channel: 'signal', timestamp: '2025-02-06T11:20:00Z', read: false },

  // Conversation with Dolor Sit (c2)
  { id: 'm7', contactId: 'c2', content: 'Cupidatat non proident, sunt in culpa qui officia deserunt.', direction: 'inbound', channel: 'sms', timestamp: '2025-02-07T17:00:00Z', read: true },
  { id: 'm8', contactId: 'c2', content: 'Mollit anim id est laborum. Perspiciatis unde omnis.', direction: 'outbound', channel: 'sms', timestamp: '2025-02-07T17:05:00Z', read: true },

  // Conversation with Sed Do Eiusmod (c5)
  { id: 'm9', contactId: 'c5', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-05T09:00:00Z', read: true },
  { id: 'm10', contactId: 'c5', content: 'Aut fugit, sed quia consequuntur magni dolores eos qui ratione.', direction: 'outbound', channel: 'signal', timestamp: '2025-02-05T09:20:00Z', read: true },
  { id: 'm11', contactId: 'c5', content: 'Voluptatem sequi nesciunt. Neque porro quisquam est.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-05T09:25:00Z', read: true },

  // Conversation with Adipiscing Elit (c4)
  { id: 'm12', contactId: 'c4', content: 'Qui dolorem ipsum quia dolor sit amet, consectetur.', direction: 'inbound', channel: 'sms', timestamp: '2025-01-20T14:00:00Z', read: true },
  { id: 'm13', contactId: 'c4', content: 'Adipisci velit, sed quia non numquam eius modi tempora incidunt.', direction: 'outbound', channel: 'sms', timestamp: '2025-01-20T14:10:00Z', read: true },
  { id: 'm14', contactId: 'c4', content: 'Ut labore et dolore magnam aliquam quaerat voluptatem.', direction: 'inbound', channel: 'sms', timestamp: '2025-01-20T14:15:00Z', read: false },

  // Conversation with Ut Labore (c7)
  { id: 'm15', contactId: 'c7', content: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-01T10:00:00Z', read: true },
  { id: 'm16', contactId: 'c7', content: 'Corporis suscipit laboriosam, nisi ut aliquid ex ea commodi.', direction: 'outbound', channel: 'signal', timestamp: '2025-02-01T10:15:00Z', read: true },

  // Conversation with Aliqua Enim (c9)
  { id: 'm17', contactId: 'c9', content: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit?', direction: 'inbound', channel: 'signal', timestamp: '2025-01-28T19:00:00Z', read: true },
  { id: 'm18', contactId: 'c9', content: 'Esse quam nihil molestiae consequatur, vel illum qui dolorem eum.', direction: 'outbound', channel: 'signal', timestamp: '2025-01-28T19:10:00Z', read: true },
  { id: 'm19', contactId: 'c9', content: 'Fugiat quo voluptas nulla pariatur at vero eos et accusamus.', direction: 'inbound', channel: 'signal', timestamp: '2025-01-28T19:15:00Z', read: false },

  // Conversation with Quis Nostrud (c10)
  { id: 'm20', contactId: 'c10', content: 'Et iusto odio dignissimos ducimus qui blanditiis praesentium.', direction: 'inbound', channel: 'sms', timestamp: '2025-01-10T08:00:00Z', read: true },
  { id: 'm21', contactId: 'c10', content: 'Voluptatum deleniti atque corrupti quos dolores et quas molestias.', direction: 'outbound', channel: 'sms', timestamp: '2025-01-10T08:30:00Z', read: true },

  // Conversation with Aliquip Ex Ea (c13)
  { id: 'm22', contactId: 'c13', content: 'Excepturi sint occaecati cupiditate non provident, similique sunt.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-10T12:00:00Z', read: false },
  { id: 'm23', contactId: 'c13', content: 'In culpa qui officia deserunt mollitia animi, id est laborum.', direction: 'outbound', channel: 'signal', timestamp: '2025-02-10T12:20:00Z', read: true },

  // Conversation with Duis Aute Irure (c15)
  { id: 'm24', contactId: 'c15', content: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque.', direction: 'inbound', channel: 'signal', timestamp: '2025-02-08T18:00:00Z', read: false },
  { id: 'm25', contactId: 'c15', content: 'Nihil impedit quo minus id quod maxime placeat facere possimus.', direction: 'outbound', channel: 'signal', timestamp: '2025-02-08T18:10:00Z', read: true },
]
